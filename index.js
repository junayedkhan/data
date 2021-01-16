const express = require("express");
const expbhs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mtor = require('method-override'); 
const e = require("express");
const app = express();
const port = 3000;
//
app.use(mtor("_method"));
//
app.engine('handlebars', expbhs());
app.set('view engine', 'handlebars');
//
const uri = "mongodb+srv://junayed:250@cluster0.ncjgs.mongodb.net/junayed?retryWrites=true&w=majority"
mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log("MongoDB connected")
}).catch((err) => {
    console.log(err)
})
const postSchema = mongoose.Schema({
    name:{type:String},
    phone:{type:String}
})
const Post = mongoose.model('Post', postSchema)
//
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//
app.get('/', async (req, res) => {
    const posts = await Post.find({}).lean()
    res.render('home', {
        posts
    })
})
//
app.get('/edit/:id', async(req, res) => {
    const post = await Post.findOne({_id:req.params.id}).lean();
    res.render('edit', {
        post
    })
})
//
app.post('/add', async(req, res) => {
    const {name, phone} = req.body
    const newPost = new Post({
        name,
        phone
    })
    const public = await newPost.save()
    if(public){
        res.redirect('/')
    } else {
        res.redirect('/')
    }
})
//
app.put('/update', async(req, res) => {
    const {name, phone, id} = req.body
    const post = await Post.findById(id)
    if(post){
        post.name = name;
        post.phone = phone;
     const updatePost = await post.save();
     if(updatePost){
        res.redirect('/')
     } else {
        res.redirect('/edit/' +id )
     }
    } else {
        res.redirect('/')
    }

})
//
app.get('/add', (req, res) => {
    res.render('add')
})
//
app.delete('/delete/:id', async(req, res) => {
    const deleted = await Post.deleteOne({_id:req.params.id})
    if(deleted){
        res.redirect('/')
    } else {
        res.redirect('/')
    }
})
//
app.listen(port, console.log("server start "+port))