//https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
//https://blog.appsignal.com/2022/09/14/secure-your-nodejs-app-with-json-web-tokens.html
const { ObjectID } = require("bson");
const client = require("../db/dbConnection");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
require('dotenv').config()

var state = false

const verifyUserToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    //req.email = decoded.email;
   // next();
    state=true;
    console.log(state);
  } catch (err) {
    res.status(400).send("Invalid token.");
    

  }
};


const addUser = async (req, res) => {
  try {
    let user = new User(
      req.body.email,
      req.body.password,
      req.body.pseudo,
      req.body.skills,
      req.body.portfolio,
      req.body.num,
      req.body.longitude,
      req.body.latitude,
    );
    let result = await client
      .db()
      .collection("Users")
      .insertOne(user);

    res.status(200).json(result);
  } catch (error) {
   // console.log(error);
    res.status(501).json(error);
  }
};



const getUsers = async (req, res) => {
 verifyUserToken(req,res)
  try {
    let cursor = client
      .db()
      .collection("Users")
      .find()
      .sort({ email: 1 });
    let result = await cursor.toArray();
   
    if (result.length > 0 && state == true) {    
      res.status(200).json(result);
    } else {
      res.status(204).json({ msg: "Aucun utilisateur trouvé" });
    }
  } catch (error) {
    //console.log(error);
    res.status(501).json(error);
  }
};

const getUser = async (req, res) => {
  verifyUserToken(req,res)
  try {
    let id = new ObjectID(req.params.id);
    let cursor = client.db().collection("Users").find({ _id: id });
    let result = await cursor.toArray();
    if (result.length > 0 && state == true) {
      res.status(200).json(result[0]);
    } else {
      res.status(204).json({ msg: "Cet utilisateur n'existe pas" });
    }
  } catch (error) {
    //console.log(error);
    res.status(501).json(error);
  }
};

const getUser1 = async (req, res) => {
  try {
    let email = req.params.email;
    let password = req.params.password
    let cursor = client.db().collection("Users").find({ email: email, password:password });

    let result = await cursor.toArray();
    if (result.length > 0) {
      //res.status(200).json(result[0]);
      const token = jwt.sign({ email }, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
     
    } else {
      return res.status(400).send("Invalid email or password");
     // res.status(204).json({ msg: "Cet utilisateur n'existe pas" });
    }
  } catch (error) {
   // console.log(error);
    res.status(501).json(error);
  }
};


const updateUser = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let email=  req.body.email;
    let password =  req.body.password;
    let pseudo  = req.body.pseudo;
    let skills =  req.body.skills;
    let portfolio =  req.body.portfolio;
    let num =   req.body.num;
    let longitude =  req.body.longitude;
    let latitude =  req.body.latitude;
    let result = await client
      .db()
      .collection("Users")
      .updateOne({ _id: id }, { $set: { email, password,pseudo,skills,portfolio,num,longitude,latitude } });

    if (result.modifiedCount === 1) {
      res.status(200).json({ msg: "Modification réussie" });
    } else {
      res.status(404).json({ msg: "Cet utilisateur n'existe pas" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let result = await client
      .db()
      .collection("Users")
      .deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.status(200).json({ msg: "Suppression réussie" });
    } else {
      res.status(404).json({ msg: "Cet utilisateur n'existe pas" });
    }
  } catch (error) {
    //console.log(error);

    res.status(501).json(error);
  }
};

module.exports = {
  addUser,
  getUsers,
  getUser,
  getUser1,
  updateUser,
  deleteUser,
};