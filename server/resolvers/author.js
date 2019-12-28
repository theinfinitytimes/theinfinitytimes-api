const Author = require('../models/author');

module.exports.author = async(_, args, req) => {
    try {
        return await Author.findOne({account: args.account})
    } catch (e) {
        console.log(e);
    }

};

module.exports.addAuthor = async(_,args, req) => {
  const author = new Author({
      account: args.account
  });
  try {
      return await author.save();
  } catch (e) {
      console.log('Could not save the author');
      console.log(e);
  }
};
