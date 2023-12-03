const { AuthenticationError } = require('apollo-server-express');
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
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            throw new AuthenticationError('User with this email already exists');
          }
          const hashedPassword = await bcrypt.hash(password, 10);
    
          const newUser = new User({
            username,
            email,
            password: hashedPassword,
          });
              await newUser.save();
    
          const authToken = generateAuthToken(newUser);
    
          return {
            authToken,
            user: newUser,
          };
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