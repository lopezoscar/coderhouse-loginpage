"use strict";


const express = require("express");
const app = express();
const exphbs = require("express-handlebars");

app.use(express.static("public"));

app.engine('hbs', exphbs({}));
app.set('view engine', 'hbs');

app.get("/profile",function(req,res,next){
   res.render("profile.hbs",{});
});

app.listen(3000,function(){
    console.log("server up");
});