const express = require('express')
const cors = require('cors')

const app = express();

var corsOption = {
    origin: 'http://localhost:8081'
};


const db = require("./app/models")
const Role = db.role;

app.use(cors(corsOption));

// json() is a method in express to recognize the incoming Request object as a json object.
app.use(express.json())

// urlencoded() is a method in express to recognize the incoming Request object as strings or arrays
app.use(express.urlencoded({ extended: true}));

app.get('/', (req,res) => {
    res.json({ Message: 'welcome to FIRO application!'});
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
const dbConfig = require('./app/config/db.config')

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
});

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
}).catch(err => {
    console.log("Connection error", err);
    process.exit();
});

function initial(){
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count == 0) {
            new Role({
                name: "user"
            }).save(err => {
                if(err){
                    console.log("Error", err);
                }

                console.log("added 'user' to roles collection");
            });
            
            new Role({
                name: "moderator"
            }).save(err => {
                if(err){
                    console.log("Error", err)
                }
                console.log("added 'moderator' to roles collection")
            });

            new Role({
                name: "admin"
            }).save(err => {
                if(err){
                    console.log("Error", err);
                }

                console.log("added 'admin' to roles collection.");
            })
        }
    })
}