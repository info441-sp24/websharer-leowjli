import mongoose from 'mongoose';

let models = {};

console.log("connecting to mongoDB");

await mongoose.connect("mongodb+srv://leowjli:info441@leocluster.ey4mlks.mongodb.net/");

console.log("successfully connected to mongoDB");

const postSchema = new mongoose.Schema({
  url: String,
  description: String,
  created_date: Date
});

models.Post = mongoose.model('Post', postSchema);
console.log("mongoose models created");

export default models;