const graphql = require('graphql');
const Movies = require('../models/movie');
const Directors = require('../models/director');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    watched: { type: new GraphQLNonNull(GraphQLBoolean) },
    rate: { type: GraphQLInt },
    director: {
      type: DirectorType,
      resolve({ directorId }) {
        return Directors.findById(directorId);
      }
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve({ id }) {
        return Movies.find({ directorId: id });
      }
    },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: {
        id: {
          type: GraphQLID,
        }
      },
      resolve(_, { id }) {
        return Movies.findById(id);
      },
    },
    director: {
      type: DirectorType,
      args: {
        id: {
          type: GraphQLID,
        }
      },
      resolve(_, { id }) {
        return Directors.findById(id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      args: { name: { type: GraphQLString } },
      resolve(_, { name }) {
        return Movies.find({ name: { $regex: name, $options: "i" } });
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      args: { name: { type: GraphQLString } },
      resolve() {
        return Directors.find({ name: { $regex: name, $options: "i" } });
      }
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => (
    {
      addDirector: {
        type: DirectorType,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          age: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve(_, { name, age }) {
          const director = new Directors({
            name: name,
            age: age,
          });

          return director.save();
        }
      },
      addMovie: {
        type: MovieType,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          genre: { type: new GraphQLNonNull(GraphQLString) },
          watched: { type: new GraphQLNonNull(GraphQLBoolean) },
          directorId: { type: GraphQLID },
          rate: { type: GraphQLInt },
        },
        resolve(_, { name, genre, directorId, watched, rate }) {
          const movie = new Movies({
            name,
            genre,
            directorId,
            watched,
            rate,
          });

          return movie.save();
        }
      },
      deleteDirector: {
        type: DirectorType,
        args: {
          id: { type: GraphQLID },
        },
        resolve(_, { id }) {
          return Directors.findByIdAndRemove(id);
        }
      },
      deleteMovie: {
        type: MovieType,
        args: {
          id: { type: GraphQLID },
        },
        resolve(_, { id }) {
          return Movies.findByIdAndRemove(id);
        }
      },
      updateDirector: {
        type: DirectorType,
        args: {
          id: { type: GraphQLID },
          name: { type: new GraphQLNonNull(GraphQLString) },
          age: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve(_, { id, name, age }) {
          return Directors.findByIdAndUpdate(
            id,
            {
              $set: {
                name,
                age,
              },
            },
            { new: true },
          );
        }
      },
      updateMovie: {
        type: MovieType,
        args: {
          id: { type: GraphQLID },
          name: { type: new GraphQLNonNull(GraphQLString) },
          genre: { type: new GraphQLNonNull(GraphQLString) },
          directorId: { type: GraphQLID },
          watched: { type: new GraphQLNonNull(GraphQLBoolean) },
          rate: { type: GraphQLInt },
        },
        resolve(_, { id, name, genre, directorId, watched, rate }) {
          return Movies.findByIdAndUpdate(
            id,
            {
              $set: {
                name,
                genre,
                directorId,
                watched,
                rate,
              },
            },
            { new: true },
          );
        }
      },
    }
  ),
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});