const {AuthorModel} = require('../models/author');

const {PostModel} = require('../models/post');

module.exports.post = async (_, args, req) => {
    try {
        return await PostModel.findOne({id: args.id})
    } catch (e) {
        console.log(e);
    }
};
module.exports.posts = async (_, args, req) => {
    try {
        return await PostModel.find({_id: {$exists: true}});
    } catch (e) {
        console.log(e);
    }
};
module.exports.addPost = async (_, args, req) => {
    let lastPost = await PostModel.find({id: {$exists: true}}).sort({id: -1}).limit(1);
    if (Array.isArray(lastPost) && lastPost.length > 0) {
        lastPost = lastPost[0]
    }
    let post = new PostModel({
        title: args.post.title,
        body: args.post.body,
        picture: [],
        author: args.post.author,
        id: lastPost['id'] + 1,
        dateCreated: new Date(),
        tags: []
    });
    if (Array.isArray(lastPost) && lastPost.length === 0) {
        post.id = 0;
    }
    if (args.post.picture && Array.isArray(args.post.picture) && args.post.picture.length) {
        args.post.picture.forEach(x => {
            post.picture.push(x);
        });
    }
    if (args.post.tags && Array.isArray(args.post.tags) && args.post.tags.length) {
        args.post.tags.forEach(x => {
            post.tags.push(x);
        });
    }
    try {
        const result = await post.save();
        let author = await AuthorModel.find({_id: args.post.author});
        if (Array.isArray(author) && author.length > 0) {
            author = author[0];
        }
        author['posts'].push(result._id.toString());
        await author.save();
        return result;
    } catch (e) {
        console.log('Could not save the post');
        console.log(e);
    }
};

module.exports.editPost = async (_, args, req) => {
    let post = await PostModel.findOne({id: args.post.id});
    console.log(post);
    if (post) {
        args.post.lastModified = new Date();
        if (post.author !== args.post.author) {
            args.post.author = post.author;
        }
        try {
            if (post.tags !== args.post.tags) {
                return await PostModel.findOneAndUpdate({id: args.post.id}, {
                    $set: args.post,
                    $push: {'post.tags': {$each: args.post.tags}}
                }, {new: true});
            }
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }
};

module.exports.deletePost = async (_, args, req) => {
    let post = await PostModel.findById(args.post._id);
    if (post && (typeof post === 'object')) {
        if (args.post.id !== post.id) {
            throw new Error("The post ids don't match ");
        }
        if (args.post.title !== post.title) {
            throw new Error("The titles don't match");
        }
        if (args.post.author !== post.author.toString()) {
            throw new Error("The authors don't match");
        }
        try {
            const author = await AuthorModel.findById(args.post.author);
            if (author) {
                let posts = [];
                author.posts.forEach(x => {
                    if (x.toString() !== args.post._id) {
                        posts.push(x);
                    }
                });
                author.posts = [];
                posts.forEach(x => {
                    author.posts.push(x);
                });
                await author.save();
                return await PostModel.findOneAndDelete(args.post._id);
            } else {
                throw new Error("Couldn't find the author");
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
};

module.exports.postsByTag = async(_, args, req) => {
  try {
      if(args.tag && (typeof args.tag === 'number')) {
          return await PostModel.find({tags: args.tag}).sort({id: -1});
      } else {
          throw new Error("Tag can only be a integer");
      }
  } catch (e) {
      console.log(e);
      throw e;
  }
};
