var bodyParser=require("body-parser"),
	methodOveride=require("method-override"),
	express=require("express"),
	mongoose=require("mongoose"),
	app=express();
mongoose.connect("mongodb://localhost/blog_post",{useNewUrlParser: true,useUnifiedTopology:true}, () => { console.log("we are connected")}).catch(err => console.log(err));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOveride("_method"));
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);
// Blog.create({
// 	title:"Test Blog",
// 	image:"https://images.unsplash.com/photo-1579623430776-9ca237d80b20?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	body:"This is the place where you find peace"
// });
app.get("/",function(req,res){
	res.redirect("/blog");
});
app.get("/blog",function(req,res){
	Blog.find({},function(err,blog){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blog:blog});
		}
	});
});
//create a new post
app.get("/blog/new",function(req,res){
	res.render("new");
});
app.post("/blog",function(req,res){
	Blog.create(req.body.blog,function(err,allblogs){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/blog");;
		}
		
	});
});
app.get("/blog/:id",function(req,res){
	Blog.findById(req.params.id,function(err,showblog){
		if(err){
			res.redirect("/blog");
		}
		else{
			res.render("show",{blog:showblog});
		}
	});
});
app.get("/blog/:id/edit",function(req,res){
	 Blog.findById(req.params.id,function(err,findBlog){
		 if(err){
			 console.log(err);
		 }
		 else{
			 res.render("edit",{blog:findBlog});
		 }
	 });
});
app.put("/blog/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/blog/"+req.params.id);
		}
	});
});
app.delete("/blog/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/blog");
		}
	});
});
app.listen(3000,function(){
	console.log("server started");
}); 