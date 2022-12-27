const express = require('express');
require('dotenv').config()
const { connect } = require('./db/dbConnection');
const routerUser = require("./routes/user");

const app=express();




app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/v1", routerUser);
const uri=process.env.DATABASE_URL

connect(uri, (err) => {
  if (err) {
    console.log("Erreur lors de la connexion à la base de données");
    console.log(err);
    process.exit(-1);
  } else {
    console.log("Connexion avec la base de données établie");
    app.listen(3000);
    console.log("Attente des requêtes au port 3OO0");
  }
});
//102.64.222.217/32
