//imports
const express = require("express");
const Model = require("./users/model.js");

//instance of express
const server = express();

//global middleware
server.use(express.json());

//Endpoints

// [Post], creates user using info sent inside request body
server.post("/api/users",(req,res)=>{
    const newUser = req.body;
    if(!newUser.name || !newUser.bio){
        res.status(400).json("Please provide name and bio for the user");
    } else {
        Model.insert(newUser)
        .then(user=>{
            res.status(201).json(user)
        })
        .catch(error=>{
            res.status(500).json({message:"There was and error while saving the user to the database"});
        });
    };
});

// [Get], returns users array
server.get("/api/users",(req,res)=>{
    Model.find()
        .then(users=>{
            res.status(200).json(users);
        })
        .catch(error=>{
            res.status(500).json({message:"The users information could not be retrieved"});
        });
});

// [Get], returns user object with the specific id
server.get("/api/users/:id",(req,res)=>{
    const idVar = req.params.id;
    Model.findById(idVar)
        .then(user=>{
            if(!user){
                res.status(404).json(`The user with the specified ID does not exist`);
            } else {
                res.status(200).json(user);
            }
        })
        .catch(error=>{
            res.status(500).json({message:"The user information could not be retrieved"});
        });
});

// [Delete], removes user with the specific id and returns the deleted user
server.delete("/api/users/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        const deletedUser = await Model.remove(id);
        if(!deletedUser){
            res.status(404).json("The user with the specified ID does not exist");
        } else {
            res.status(200).json(deletedUser);
        }
    }
    catch(error){
        res.status(500).json({message:"The user could not be removed"});
    };
});

// [Put], updates the user with the specified id using data from req body, returns the modified user
server.put("/api/users/:id",async (req,res)=>{
    const {id} = req.params;
    const changes = req.body;
    try{
        if(!changes.name || !changes.bio){
            res.status(400).json("Please provide name and bio for the user");
        } else {
            const updatedUser = await Model.update(id, changes);
            if(!updatedUser){
                res.status(404).json("The user with the specified ID does not exist");
            } else {
                res.status(200).json(updatedUser);
            }
        }
    }
    catch(error){
        res.status(500).json({message:"The user information could not be modified"});
    };
});

//404 Endpoint
server.use("*",(req,res)=>{
    res.status(404).json({message:"404 Not Found"});
});


module.exports = server;