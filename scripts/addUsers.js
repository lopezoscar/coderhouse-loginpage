"use strict";

var unUsuario = {
    username:"laureaninga",
    about:"Hola Soy Laureano, me gusta puntonete",
    firstname:"Laureano",
    lastname:"Paez",
    birthday: "01 February 1982",
    occupation:"Developer",
    mobile:"(+6283) 456 789",
    country:"Argentina",
    email:"laureano@gmail.com",
    phone:" (+021) 956 789123"
};

const User = require("../lib/User");

User.saveUser(unUsuario,function(err,result){
    console.log(err,result);
});


