const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  methodOverride = require("method-override"),
	  expressSanitizer = require("express-sanitizer");

//App config
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//Mongoose model config
let blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);


// RESTful Routes
app.get("/", (req, res) => {
	res.redirect("/blogs");
});

// Index Route
app.get("/blogs", (req, res) => {
	Blog.find({}, (err, blogs) => {
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

//New Route
app.get("/blogs/new", (req, res) => {
	res.render("new");
});


//Create Route
app.post("/blogs", (req, res) => {
	
	//create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err){
			res.render("new");
		} else {
			//redirect
			res.redirect("/blogs");
		}
	});
});

//Show Route
app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

//Edit Route
app.get("/blogs/:id/edit", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

//Update Route
app.put("/blogs/:id", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if(err){
			res.render("/blogs");
		} else {
			//redirect
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//Delete Route
app.delete("/blogs/:id", (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (err) => {
		if (err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.listen(3000, () => {
	console.log("Server is started on port 3000");
})