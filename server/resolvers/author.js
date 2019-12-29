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
        posts: []
    });
    try {
        return await author.save();
    } catch (e) {
        console.log('Could not save the author');
        console.log(e);
    }
};
