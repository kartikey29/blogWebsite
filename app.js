const { text } = require("express");
const express = require("express");
const { head } = require("lodash");

var _ = require("lodash");

const mongoose = require("mongoose");

const app = express();

let blogPost = [];

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/blogDB");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model("Blog", blogSchema);

const blog1 = new Blog({
  title: "Home",
  content: "This is the home page of blog website",
});

const blog2 = new Blog({
  title: "How to compose",
  content: "go to /compose to compose a blog post",
});

blogPost = [blog1, blog2];

app.use(express.static("public"));

//all get requests

app.get("/", (req, res) => {
  Blog.find({}, (err, foundList) => {
    if (foundList.length == 0) {
      Blog.insertMany(blogPost, (err) => {
        if (err) console.log(err);
      });
      res.redirect("/");
    } else {
      res.render("home", { blogPosts: foundList });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/contacts", (req, res) => {
  res.render("contacts");
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:id", function (req, res) {
  const toFind = req.params.id;
  Blog.findOne({ _id: toFind }, (err, blog) => {
    res.render("post", {
      blogTitle: blog.title,
      blogContent: blog.content,
    });
  });
});

//all post request

app.post("/compose", (req, res) => {
  const heading = _.capitalize(req.body.Title);
  const blog = new Blog({
    title: heading,
    content: req.body.Content,
  });
  blog.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

//server listen

app.listen(3000, (req, res) => {
  console.log("server started on port 3000");
});

//adding read more
