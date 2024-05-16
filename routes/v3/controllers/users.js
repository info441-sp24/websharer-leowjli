import express from 'express';
let router = express.Router();

router.get("/myIdentity", async (req, res) => {
  if(req.session.isAuthenticated) {
    res.json({
      status: "loggedin", 
      userInfo: {
        name: req.session.account.name, 
        username: req.session.account.username
      }
   })
  } else {
    res.json({status: "loggedout"})
  }
});

router.get("/", async (req, res) => {
  try{
      let allUsers = await req.models.User.find()
      res.json(allUsers)
  } catch(err){
      console.log("error: ", err)
      res.status(500).json({status: "error"})
  }
});

export default router;