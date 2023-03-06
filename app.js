//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", {useNewURLParser: true});

const articleSchema = {
    title: String,
    content: String,
}

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////////////////REQUETS ALL ///////////////////////////////////////////////////////
app.route("/articles")
    .get( async (req, res) => { 
        try { 
                const articles = await Article.find({}); 
                res.send(articles); } 
        catch (err) { 
            console.log(err); 
        } })

    .post(async(req, res) => {
        try {
                      const newArticle = new Article({
                title: req.query.title,
                content:req.query.content
            });

            newArticle.save().then(saveDoc => {
                try {
                    console.log("Article saved!");
                }
                catch (err) {
                    console.log(err);
               }
            });
        }
        catch (err) {
            console.log(err);
        }
    })

    .delete( async(req, res) => {
    try {
        Article.deleteMany({}).then (function() {
                res.send("All articles are successfully deleted!");
        });
    }
    catch (err) {
        console.log(err);
    }
});

//////////////////////////////////////////////////REQUETS A SPECIFIC ///////////////////////////////////////////////////////
app.route("/articles/:articleTitle")
    .get( async (req, res) => { 
        try { 
                const articles = await Article.findOne({title: req.params.articleTitle }); 
                console.log("Article gefunden!");
                res.send(articles); } 
        catch (err) { 
            console.log(err); 
        } })
    .put( async(req, res) => {
        try {
            const articleUpdate = await Article.updateOne({title: req.params.articleTitle}, 
                {
                    title: req.query.title,
                    content: req.query.content
                }, {overwrite: true});
            console.log("updated succesfully");
            res.send("/articles/"+ req.query.title);
        }
        catch (err){
            console.log(err); 
        }
    })
    .patch( async(req, res) => {
        try {
            const articleUpdate = await Article.updateOne({title: req.params.articleTitle}, 
                { $set: req.query });
            console.log("updated (patch) succesfully");
            res.send("/articles/"+ req.query.title);
        }
        catch (err){
            console.log(err); 
        }
    })
    .delete( async(req, res) => {
        try {
            Article.deleteOne({title: req.params.articleTitle}).then (function() {
                console.log("Article deleted")    ;
                res.send("This articles are successfully deleted!");
                    
            });
        }
        catch (err) {
            console.log(err);
        }
    });



////////////////////////////////////////////////// SERVER  ///////////////////////////////////////////////////////
app.listen(3000, function() {
  console.log("Server started on port 3000");
});