// app.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const __dirname = path.resolve();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// In-memory posts array
let posts = [];

// Routes
app.get("/", (req, res) => {
  res.render("home", { posts });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:title", (req, res) => {
  const requestedTitle = req.params.title.toLowerCase();
  const post = posts.find(
    (p) => p.title.toLowerCase().split(" ").join("-") === requestedTitle
  );
  if (post) {
    res.render("post", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

app.get("/edit/:title", (req, res) => {
  const requestedTitle = req.params.title.toLowerCase();
  const post = posts.find(
    (p) => p.title.toLowerCase().split(" ").join("-") === requestedTitle
  );
  if (post) {
    res.render("edit", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/edit/:title", (req, res) => {
  const requestedTitle = req.params.title.toLowerCase();
  const index = posts.findIndex(
    (p) => p.title.toLowerCase().split(" ").join("-") === requestedTitle
  );
  if (index !== -1) {
    posts[index].title = req.body.postTitle;
    posts[index].content = req.body.postBody;
  }
  res.redirect("/");
});

app.post("/delete/:title", (req, res) => {
  const requestedTitle = req.params.title.toLowerCase();
  posts = posts.filter(
    (p) => p.title.toLowerCase().split(" ").join("-") !== requestedTitle
  );
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
