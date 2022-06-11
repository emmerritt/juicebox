const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;
    
    try {
        const postsArr = await getPostsByTagName(tagName);
        
        const posts = postsArr.filter(post => {
            return post.active || (req.user && post.author.id === req.user.id);
        });

        if (postsArr.length) {
            res.send({posts: posts});
        } else {
            next({ 
                name: 'NoPostsFound', 
                message: 'No posts with this tag were found.'
            });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
  });

tagsRouter.get('/', async (req, res) => {
    const posts = await getAllTags();
  
    res.send({
      posts
    });
});

module.exports = tagsRouter;