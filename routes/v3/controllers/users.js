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
  try {
    let user = req.query.user;
    let userInfo = await req.models.User.find({username: user})
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(userInfo);
  } catch(err) {
    console.log("error: ", err)
    res.status(500).json({status: "error"})
  }
});

router.post("/", async (req, res) => {
  if(req.session.isAuthenticated) {
    try {
      let username = req.session.account.username;
      let favorite_song = req.body.favorite_song;

      let users = await req.models.User.find({username: username});

      if(users.length == 0) {
        let newUser = new req.models.User({
          username: username,
          favorite_song: favorite_song
        })
        await newUser.save();
      } else {
        if(users[0].username.includes(username)) {
          let currUser = await req.models.User.findById(users[0]._id)
          currUser.favorite_song = favorite_song;
          await currUser.save();
        }
      }

      res.json({status: "success"})
    } catch(err) {
      console.log("error: ", err)
      res.status(500).json({status: "error"})
    }
  }
})

export default router;