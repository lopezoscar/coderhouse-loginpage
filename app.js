"use strict";


const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const debug = require("debug")("app");
const utils = require("./lib/utils");
const mongojs = require("mongojs");

const User = require("./lib/User");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'anitalavalatina',
    store: new MongoStore({
        url: 'mongodb://localhost:27017/sessions',
        ttl: 14 * 24 * 60 * 60 // 14 dias
    })
}));

app.engine('hbs', exphbs({defaultLayout:'layout.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static("public"));

app.use(function(req,res,next){

    //Public routes
    if(req.path == "/login" || req.path == "/signup"){
        return next();
    }

    try{
        if(typeof req.session.user_id !== "undefined"){
            debug("Está logueado");
            req.loginOk = true;
            next();
        }else{
            res.redirect("/login");
        }
    }catch(err){
        debug("Error "+err);
        next();
    }
});

app.get("/login",function(req,res,next){
    res.render("login.hbs",{layout:false});
});

app.get("/signup",function(req,res,next){
    res.render("signup.hbs",{layout:false});
});

app.post("/signup",function(req,res,next){
    var user = req.body;

    user.password = utils.encrypt(user.password);
    User.registerUser(user,function(err,persistedUser){
        if(err){
            debug(err);
            res.redirect("/signup?error=true");
        }else{
            req.session.user_id = persistedUser._id;
            req.session.username = persistedUser.username;
            debug("Signup and Login");
            res.redirect("/profile/"+req.session.username);
        }
    });
});

app.post("/login",function(req,res,next){
    var login = req.body;
    debug(login.username);

    User.getUserByUsername(login.username,function(err,user){
       if(err){
           res.redirect("/login?loginFailed=true");
       }else{
           try{
               if( user.password == utils.encrypt(login.password) ){
                   debug("Login OK");
                   req.session.username = user.username;
                   req.session.user_id = user._id;
                   res.redirect("/profile/"+req.session.username);
               }else{
                   res.redirect("/login?passwordFailed=true");
               }
           }catch(err){
               res.redirect("/login?error=true");
           }
       }
    });
});

app.get("/logout",function(req,res,next){
    req.session.destroy(function(){
        res.redirect("/login");
    });
});

app.get("/profile/:username",function(req,res,next){
   debug("Req profile for :"+req.params.username);
   User.getUserByUsername(req.params.username,function(err,user){
      if(err){
          debug("Error "+err);
          res.render("404.hbs",{});
      }else{
          debug(user);
          res.render("profile.hbs",{user:user});
      }
   });
});

app.post("/saveUser",function(req,res,next){
    var updatedUser = req.body;

    debug(JSON.stringify(updatedUser));

    User.updateUser({_id: req.session.user_id},updatedUser,function(err,result){
        if(err){
            debug("Error /saveUser "+err);
            res.send("error");
        }else{
            debug("/saveUser ok "+result);
            res.send("ok");
        }
    });
});

app.get("/",function(req,res,next){
    res.render("home.hbs",{});
});

app.listen(3000,function(){
    console.log("server up");
});