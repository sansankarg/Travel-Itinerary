var express = require('express');
var mdb = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var User = require('./Models/userf.js');
var app = express();

var allowedOrigins = ["http://localhost:3000"];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST"]
    })
);
app.use(bodyParser.json());

mdb.connect("mongodb+srv://btwiamsankar:sansankarg2004@travel.olwg8cv.mongodb.net/userDatabase");

var db = mdb.connection;
db.once("open", () => {
    console.log("MongoDB connection successful");
});

app.get("/", (req, res) => {
    res.send("Welcome to backend Server");
});

app.post("/login", async (request, response) => {
    try {
        const { name, password } = request.body;
        console.log("Data is receiving from front end:", request.body);
        let user = await User.findOne({ name: name });
        console.log("Data retrieved from backend :", user);

        if (user) {
            if (user.password === password) {
                console.log("Login Successful");
                return response.send("Login success");
            } else {
                console.log("Incorrect password");
                return response.send("Invalid password");
            }
        } else {
            console.error("Account doesn't exist");
            return response.send("Account doesn't exist");
        } 
    } catch (error) {
        console.error("Error during login:", error);
        return response.status(500).send("Login unsuccessful");
    }
});


app.post("/signup", async (request, response) => {
    try {
        console.log("Data is receiving from front end:", request.body);
        var { name, email, password } = request.body;
        let responseMessage = "";

        let reservedId = await User.findOne({ name: name });
        if (reservedId) {
            reservedId = null;
            responseMessage = "Username already used";
        }

        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            existingUser = null;
            responseMessage = "This email id has an account";
        }

        if (!responseMessage) {
            var newUser = new User({
                name: name,
                email: email,
                password: password
            });
            console.log("This is new user:", newUser.name);

            await newUser.save();
            responseMessage = "Your account was signed up successfully";
        }

        console.log(responseMessage);
        return response.send(responseMessage);
    } catch (error) {
        console.error("Error:", error);
        return response.status(500).json({ message: "An error occurred" });
    }
});

app.listen(4000, () => console.log("backend started"));
