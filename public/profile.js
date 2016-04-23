"use strict";

var Profile = {

    init:function(params){
        this.params = params;
    },
    saveUser: function(){
        var user = {
            about: $("#about").val(),
            firstname:$("#f-name").val(),
            lastname:$("#l-name").val(),
            birthday: $("#b-day").val(),
            occupation:$("#occupation").val(),
            mobile: $("#mobile").val(),
            country:$("#c-name").val(),
            email:$("#email").val(),
            phone:$("#phone").val()
        };
        console.log("user to save",user);
        $.post("/saveUser",user,function(result){
            console.log(result);
        });
        /*$.ajax({
            type: 'POST',
            url: "/saveUser",
            headers: { "Content-Type":"application/json"},
            dataType: "json",
            data: JSON.stringify(user),
            success: function(a,b,c){
                console.log(a,b,c);
            }
        });*/
    }
};

window.Profile = Profile;