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
          const {username, url, description, website_type} = post;
          const htmlPreview = await getURLPreview(url);
          return {username, website_type, description, htmlPreview};
        } catch(err) {
          return {username, website_type, description, htmlPreview: `Error generating preview: ${err.message}`};
        }
      })
    );
    res.json(postData);
  } catch(err) {
    console.log("Error:", err.message);
    res.status(500).json({"status": "error", "error": err})
  }
})

export default router;