import express from 'express';
let router = express.Router();

router.get("/myIdentity", async (req, res) => {
  if(req.session.userid) {

    
    res.json({
      status: "loggedin", 
      userInfo: {
        name: "Kyle Thayer", 
        username: "kmthayer@uw.edu"
      }
   })
  } else {
    res.json({status: "loggedout"})
  }
})