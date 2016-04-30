"use strict";
const config = require("config");
const mongojs = require("mongojs");
const db = mongojs(config.get("mongodb").stringconn+"/profile",["users"]);
const debug = require("debug")("lib:User");

var User = {
    getUserById(id,cb){
        db.users.findOne({_id:mongojs.ObjectId(id)},cb);
    },
    getUserByUsername(username,cb){
        db.users.findOne({username:username},cb);
    },
    saveUser(user,cb){
        db.users.insert(user,cb);
    },
    updateUser(query,update,cb){
        db.users.update({_id: mongojs.ObjectId(query._id) },{ $set: update },cb);
    },
    registerUser(user,cb){
        var _this = this;
        db.users.findOne({username:user.username}, function(err,aUser){
            if(err || aUser != null){
                debug(err);
                debug(aUser);
                cb(err || aUser, null);
            }else{
                debug("Register User Ok");
                _this.saveUser(user,cb);
            }
        });
    }
};

module.exports = User;

/**
 *  {
 *      _id:ObjectId("asdkfjasdlkfjasdlkf"),
 *      username:"ladoc",
 *      about:"Hello I’m Jenifer Smith, a leading expert in interactive and creative design specializing in the mobile medium. My graduation from Massey University with a Bachelor of Design majoring in visual communication.",
 *      firstname:"Jenifer",
 *      lastname:"Smith",
 *      birthday: "27 August 1987",
 *      occupation:"Designer",
 *      mobile:"",
 *      country:"",
 *      email:"",
 *      phone:""
 *  }
 *
 **/

