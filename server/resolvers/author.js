const {AuthorModel} = require('../models/author');
const {ForbiddenError} = require('apollo-server-express');


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
    req.user = {...req.user, ...(await req.user.checkAuthentication())};
    const reqUser = req.user._doc;
    if(reqUser && reqUser._id && (reqUser._id.toString()=== args.author.account || reqUser.accountType === 'admin')) {
        try {
            let author = await AuthorModel.findById(args.author._id);
            if (!(author && (typeof author === 'object'))) {
                throw new Error("Author doesn't exist");
            }
            if (author.account.toString() !== args.author.account) {
                throw new Error("The account associated with the author object cannot be changed")
            }
            if (!args.author.posts && author.posts && Array.isArray(author.posts) && author.posts.length) {
                args.author.posts = [];
                author.posts.forEach(x => {
                    args.author.posts.push(x);
                })
            }
            return await AuthorModel.findOneAndUpdate({_id: args.author._id}, {$set: args.author}, {new: true});
        } catch (e) {
            console.log(e);
        }
    } else {
        throw new ForbiddenError('403-Forbidden');
    }
};

module.exports.deleteAuthor = async (_, args, req) => {
    req.user = {...req.user, ...(await req.user.checkAuthentication())};
    const reqUser = req.user._doc;
    if(reqUser && reqUser._id && (reqUser._id.toString()=== args.author.account || reqUser.accountType === 'admin')) {
        try {
            let author = await AuthorModel.findById(args.author._id);
            if (author && (typeof author === 'object')) {
                if (args.author.account !== author.account.toString()) {
                    throw new Error("The account _id doesn't match the author's account _id");
                }
                return await AuthorModel.findByIdAndDelete(args.author._id);
            } else {
                throw new Error("Couldn't find the author specified");
            }
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    } else {
        throw new ForbiddenError('403-Forbidden');
    }
};
