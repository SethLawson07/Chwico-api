const { ObjectID } = require("bson");
const client = require("../db/dbConnection");
const { User } = require("../models/user");

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
    console.log(error);
    res.status(501).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    let cursor = client
      .db()
      .collection("Users")
      .find()
      .sort({ email: 1 });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).json({ msg: "Aucun utilisateur trouvé" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    let id = new ObjectID(req.params.id);
    let cursor = client.db().collection("Users").find({ _id: id });
    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(204).json({ msg: "Cet utilisateur n'existe pas" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};

const getUser1 = async (req, res) => {
  try {
    let email = req.params.email;
    let cursor = client.db().collection("Users").find({ email: email });

    let result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json(result[0]);
      
     
    } else {
      res.status(204).json({ msg: "Cet utilisateur n'existe pas" });
    }
  } catch (error) {
    console.log(error);
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
    console.log(error);

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