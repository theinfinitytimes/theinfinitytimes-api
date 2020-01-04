const {AuthorModel} = require('../models/author');

module.exports.author = async (_, args, req) => {
    try {
        return await AuthorModel.findOne({_id: args._id})
    } catch (e) {
        console.log(e);
    }

};

module.exports.addAuthor = async (_, args, req) => {
    const authors = await AuthorModel.find({account: args.author.account});
    if (Array.isArray(authors) && authors.length > 0) {
        throw new Error("An author object is already associated with this account");
    }
    const author = new AuthorModel({
        account: args.author.account,
        description: args.author.description,
        posts: []
    });
    try {
        return await author.save();
    } catch (e) {
        console.log('Could not save the author');
        console.log(e);
    }
};

module.exports.editAuthor = async (_, args, req) => {
  try {
      let author = await AuthorModel.findById(args.author._id);
      if (!(author && (typeof author === 'object'))){
          throw new Error("Author doesn't exist");
      }
      if(author.account.toString() !== args.author.account){
          throw new Error("The account associated with the author object cannot be changed")
      }
      if(!args.author.posts && author.posts && Array.isArray(author.posts) && author.posts.length ){
          args.author.posts = [];
          author.posts.forEach(x => {
              args.author.posts.push(x);
          })
      }
      return await AuthorModel.findOneAndUpdate({_id: args.author._id}, {$set: args.author}, {new: true});
  } catch (e){
      console.log(e);
  }
};
