import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.post('/', async (req, res) => {
  console.log(req.body);

  try {
    const newPost = new req.models.Post({
      url: req.body.url,
      description: req.body.description,
      created_date: new Date()
    })

    await newPost.save();
    
    res.json({"status": "success"});
  } catch(err) {
    console.log("Error connecting to db", err.message);
    res.status(500).json({"status": "error", "error": err})
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await req.models.Post.find();

    let postData = await Promise.all(
      posts.map(async (post) => { 
        try {
          const {url, description} = post;
          const htmlPreview = await getURLPreview(url);
          return {description, htmlPreview};
        } catch(err) {
          return {description, htmlPreview: `Error generating preview: ${err.message}`};
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