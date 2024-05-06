import express from 'express';
let router = express.Router();

router.get('/', async (req, res) => {
  try {
    let postID = req.query.postID;
    let comments = await req.models.Comment.find({ post: postID });
    res.json(comments);
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({"status": "error", "error": err.message});
  }
});

router.post('/', async (req, res) => {
  if (req.session.isAuthenticated) {
    try {
      const newComment = new req.models.Comment({
        username: req.session.account.username,
        comment: req.body.newComment,
        post: req.body.postID,
        created_date: new Date()
      })

      await newComment.save();

      res.json({status: "success"});
    } catch (err) {
      console.log("Error", err.message);
      res.status(500).json({"status": "error", "error": err.message});  
    }
  } else {
    res.status(401).json({status: "error", "error": "not logged in"});
  }
})

export default router;