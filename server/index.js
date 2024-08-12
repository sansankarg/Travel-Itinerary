var express = require('express');
var mdb = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var User = require('./Models/userf.js');
var app = express();
const Itinerary = require('./Models/itinerary');

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
// mdb.connect("mongodb://localhost:27016/");

var db = mdb.connection;
db.once("open", () => {
    console.log("MongoDB connection successful");
});

app.get("/", (req, res) => {
    res.send("Welcome to backend Server");
});

app.post('/save-itinerary', async (req, res) => {
    const { data, username } = req.body;
    console.log("Itinerary recieved");
    const deleteResult = await Itinerary.deleteMany({ username: username});
    if (deleteResult.deletedCount > 0) {
        console.log(`Successfully deleted ${deleteResult.deletedCount} itineraries.`);
    } else {
        console.log("No itineraries found for deletion.");
    }
    const itineraryEntries = Object.keys(data).map( day => {
        return {
            username : username,
            day: day.replace('day', ''),
            places: data[day]
        };
    });
    console.log(itineraryEntries);
    Itinerary.insertMany(itineraryEntries)
        .then(result => {
            console.log("Itinerary saved:", result);
            res.json({ success: true, message: "Itinerary saved successfully!" });
        })
        .catch(error => {
            console.error("Error saving itinerary:", error);
            res.status(500).json({ success: false, message: "Failed to save itinerary." });
        });
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
                return response.json({ message: "Login success", name: user.name});
            } else {
                console.log("Incorrect password");
                return response.json({ message: "Invalid password" });
            }
        } else {
            console.error("Account doesn't exist");
            return response.json({ message: "Account doesn't exist." });
        } 
    } catch (error) {
        console.error("Error during login:", error);
        return response.json({ message: "Login unsuccessful", username : user.name });
    }
});
app.post("/plan-page", async (request, response) => {
    try {
        const { username } = request.body;
        console.log("Data request recieved for user :", request.body);
        let user = await User.findOne({ name: username });
        let final = {
            "1" :   await Itinerary.findOne({username : username, day : 1}),
            "2" :   await Itinerary.findOne({username : username, day : 2}),
            "3" :   await Itinerary.findOne({username : username, day : 3}),
            "4" :   await Itinerary.findOne({username : username, day : 4}),
            "5" :   await Itinerary.findOne({username : username, day : 5}),
            "6" :   await Itinerary.findOne({username : username, day : 6}),
            "7" :   await Itinerary.findOne({username : username, day : 7}),
            "8" :   await Itinerary.findOne({username : username, day : 8}),
            "9" :   await Itinerary.findOne({username : username, day : 9}),
        }
        let data = await Itinerary.findOne({username : username, day : 4});
        console.log("Sample data sent : ", data);
        
        return response.json({ message: "data sent", dataset : final });
    
    } catch (error) {
        console.error("Error during login:", error);
        return response.json({ message: "data unsent" });
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
