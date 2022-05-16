const express = require('express');


const ejs = require('ejs');


const _ = require('lodash');


const bodyparser = require('body-parser');


const res = require('express/lib/response');


const { redirect } = require('express/lib/response');

const mongoose = require("mongoose");

const { times } = require('lodash');

mongoose.connect('mongodb://localhost:27017/ContentDB');

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"))

app.set('view engine', 'ejs');


const contentSchema = mongoose.Schema({
    cnt: String
});

const Content = new mongoose.model('content', contentSchema);



const titleSchema = new mongoose.Schema({
    title: String,
    relatedContent: [contentSchema]
});


const Title = new mongoose.model('titleWithContent', titleSchema);





const languageShema = new mongoose.Schema({
    languageName: String,
    languageContent: [titleSchema]
});

const Language = new mongoose.model('languagename', languageShema);


app.get("/",function(req,res){

    Language.find(function(err,foundList){

        if(err){
            console.log(err);
        }
        else{
            res.render('home',{Lang:foundList}) 
        }

    })
    

});




app.get("/about", function (req, res) {


    res.render("about", { aboutdata: abtdata });
    console.log(req.params.topic);

});
app.get("/contact", function (req, res) {


    res.render('contact', { contactdata: cntdata })

});


app.get("/compose", function (req, res) {

    res.render('compose');


})
app.post("/compose", function (req, res) {

    const currentLanguageName=req.body.lngname

    const currentTitle = req.body.title;
    
    const currentContent =  req.body.item;
    

    Language.findOne({languageName:currentLanguageName},function(err,foundList){

        if(foundList){

            const ttl=new Title({
                title:currentTitle,
                relatedContent:[{cnt:currentContent}]
            })

            foundList.languageContent.push(ttl);

            foundList.save();
            
        }
        else{


            const title=new Title({

                title:currentTitle,
                relatedContent:[{cnt:currentContent}]

            });
            
            
            const lngdata = new Language({

                languageName: currentLanguageName,
                languageContent: [title]

            });

            lngdata.save();

        }
    });



    res.redirect("/");

});




app.get("/posts/:postname", function (req, res) {


    const requested_post = req.params.postname; (req.params.postname);

    const StringArray=requested_post.split("&")
    
    Language.findOne({languageName:StringArray[0]},function(err,foundList,){

        if(err){

            console.log(err);

        }
        else{
            

            foundList.languageContent.forEach(function(data){
                if(data.title===StringArray[1]){

                    res.render('posts',{langname:StringArray[0],title:data.title,content:data.relatedContent}); 
                    
                }
                
            });
               
            
        }
    });
    
});

app.listen(3000, function () {
    
    console.log("server is listening to port 3000");

});
