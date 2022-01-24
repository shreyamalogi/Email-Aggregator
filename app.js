//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const https = require('https');
const request = require("request"); //vvv imp


const app = express();

//all the images and custom css which are static must be in public folder to render templates along with bootsrap
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html"); //so when we run app.js we cant see all the colors applied so inorder we set up static 
});

app.post("/", function(req, res) {
    var firstName = req.body.fName; //req.body.<name ka input in form>
    var lastName = req.body.lName;
    var email = req.body.email;

    //console.log(firstName, lastName, email);//log chesaka we wont find anything cuz form lo method = post mention cheyali along with form action for which location
    //lets create a js object which holds our data, has members which should be in an array of objects
    //look at docs

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data); //for flat packed minifiesd json data
    console.log(firstName)
    const url = "https://us20.api.mailchimp.com/3.0/lists/d7e364a507";

    const options = {
        method: "POST",
        auth: "shreyamalogi:6d6f8493571d84c05b55b3008206ed62-us20"
    }


    const request = https.request(url, options, function(response) { //to get post req, then fill the fields by adding it to constants
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) { //after posting req, to check back the data we recieve from  the mailchimp servers
            console.log(JSON.parse(data)); //to log our data in json format
        });
    });
    request.write(jsonData);
    request.end();
});



app.post("/failure", function(req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
    console.log(`server is listening `);
});



// 6d6f8493571d84c05b55b3008206ed62-us20 //in the url paste 20 for x

//d7e364a507