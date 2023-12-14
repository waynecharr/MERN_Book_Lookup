const { signToken, AuthenticationError } = require("../utils/auth");
const { User } = require('../models');
const bcrypt = require('bcrypt');

const resolvers = {
    Query: {
        // Gets the user by username
        me: async (parent, { username }) => {
          return User.findOne({ username }).populate('savedBooks');
        },
      },
      Mutation: {
        login: async (parent, { email, password }) => {
          const user = await User.findOne({ email });
          if (!user) {
            throw new AuthenticationError('Invalid credentials');
          }
          const passwordValid = await user.comparePassword(password);
          if (!passwordValid) {
            throw new AuthenticationError('Invalid credentials');
          }
          const authToken = generateAuthToken(user);
          return {
            authToken,
            user,
          }
        },

        addUser: async (parent, { username, email, password }) => {
          const user = await User.create({ username, email, password });
          const token = signToken(user);

          return { token, user };
      },

        // Adds a book to the user's saved books
        saveBook: async (parent, { input }, context) => {
          if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $push: { savedBooks: input } },
              { new: true }
            ).populate('savedBooks');
    
            return updatedUser;
          } else {
            throw new AuthenticationError('You need to be logged in to perform this action');
          }
        },
    
        // Removes a book from the user's saved books
        removeBook: async (parent, { bookId }, context) => {
          if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId } } },
              { new: true }
            ).populate('savedBooks');
    
            return updatedUser;
          } else {
            throw new AuthenticationError('You need to be logged in to perform this action');
          }
        },
      },
      
      
}

module.exports = resolvers;