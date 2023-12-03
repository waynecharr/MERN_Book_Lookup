const { Book, User } = require('../models');

const resolvers = {
    Query: {
        // Gets the user by username
        getUser: async (_, { username }) => {
          return User.findOne({ username }).populate('savedBooks');
        },
      },
      Mutation: {
        // Adds a book to the user's saved books
        addBook: async (_, { input }, context) => {
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
        removeBook: async (_, { bookId }, context) => {
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