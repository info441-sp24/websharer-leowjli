import mongoose from 'mongoose';

let models = {};

console.log("connecting to mongoDB");

await mongoose.connect("mongodb+srv://leowjli:info441@leocluster.ey4mlks.mongodb.net/Websharer");

console.log("successfully connected to mongoDB");

const postSchema = new mongoose.Schema({
  url: String,
  description: String,
  username: String,
  website_type: String,
  likes: [String],
  created_date: Date
});

models.Post = mongoose.model('Post', postSchema);

const commentSchema = new mongoose.Schema({
  username: String,
  comment: String,
  post: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
  created_date: Date
});

models.Comment = mongoose.model('Comment', commentSchema);
console.log("mongoose models created");

const userSchema = new mongoose.Schema({
  username: String,
  favorite_song: String
});

models.User = mongoose.model('User', userSchema);
console.log("mongoose models created");

export default models;