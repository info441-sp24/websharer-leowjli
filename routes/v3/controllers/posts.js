import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async (req, res) => {
  if(req.session.isAuthenticated) {
    try {
      const newPost = new req.models.Post({
        username: req.session.account.username,
        url: req.body.url,
        description: req.body.description,
        website_type: req.body.website_type,
        likes: req.body.likes,
        created_date: new Date()
      })
  
      await newPost.save();
      
      res.json({"status": "success"});
    } catch(err) {
      console.log("Error connecting to db", err.message);
      res.status(500).json({"status": "error", "error": err.message})
    }
  } else {
    res.status(401).json({status: "error", error: "not logged in"});
  }
});

router.get('/', async (req, res) => {
  try {
    const currUsername = req.query.username;
    const filteredUsers = currUsername ? {username: currUsername} : {};

    let posts = await req.models.Post.find(filteredUsers);
    let postData = await Promise.all(
      posts.map(async (post) => { 
        try {
          const {id, username, url, description, created_date, website_type, likes} = post;
          const htmlPreview = await getURLPreview(url);
          
          console.log(website_type)
          return {id, username, description, htmlPreview, created_date, website_type, likes};
        } catch(err) {
          return {id, username, description, created_date, htmlPreview: `Error generating preview: ${err.message}`, website_type, likes};
        }
      })
    );
    res.json(postData);
  } catch(err) {
    console.log("Error:", err.message);
    res.status(500).json({"status": "error", "error": err})
  }
});

router.post('/like', async (req, res) => {
  if(req.session.isAuthenticated) {
    try {
      let postID = req.body.postID;
      let username = req.session.account.username;
      let post = await req.models.Post.findById(postID);

      if(!post.likes.includes(username)) {
        post.likes.push(username);
      }
  
      await post.save();
      
      res.json({"status": "success"});
    } catch(err) {
      console.log("Error", err.message);
      res.status(500).json({"status": "error", "error": err.message})
    }
  } else {
    res.status(401).json({status: "error", error: "not logged in"});
  }
});

router.post('/unlike', async (req, res) => {
  if(req.session.isAuthenticated) {
    try {
      let postID = req.body.postID;
      let username = req.session.account.username;

      let post = await req.models.Post.findById(postID);

      if(post.likes.includes(username)) {
        post.likes.splice(post.likes.indexOf(username), 1);
      }
  
      await post.save();
      
      res.json({"status": "success"});
    } catch(err) {
      console.log("Error", err.message);
      res.status(500).json({"status": "error", "error": err.message})
    }
  } else {
    res.status(401).json({status: "error", error: "not logged in"});
  }
});

router.delete('/', async (req, res) => {
  if(req.session.isAuthenticated) {
    try {
      let postID = req.body.postID;
      let post = await req.models.Post.findById(postID);

      if(post.username !== req.session.account.username) {
        res.status(401).json({status: "error", error: "you can only delete your own posts"});
      }

      await req.models.Comment.deleteMany({post: postID});
      await req.models.Post.deleteOne({_id: postID});

      res.json({status: "success"})
    } catch(err) {
      console.log("Error", err.message);
      res.status(500).json({"status": "error", "error": err.message})
    }
  } else {
    res.status(401).json({status: "error", error: "not logged in"})
  }
})

export default router;