const exp = require("express");
const adminApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require('../Middlewares/verifyToken');
require("dotenv").config();

let adminscollection;
let recipescollection;

// Middleware to get collections from the app
adminApp.use((req, res, next) => {
  adminscollection = req.app.get("adminscollection");
  recipescollection = req.app.get("recipescollection");
  next();
});

// User registration route
adminApp.post(
  "/admin",
  expressAsyncHandler(async (req, res) => {
    try {
      const newUser = req.body;
      const dbuser = await adminscollection.findOne({ username: newUser.username });

      if (dbuser) {
        return res.status(400).send({ message: "Admin already exists" });
      }

      const hashedPassword = await bcryptjs.hash(newUser.password, 6);
      newUser.password = hashedPassword;
      await adminscollection.insertOne(newUser);
      res.status(201).send({ message: "Admin created" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);


adminApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    try {
      const userCred = req.body;
      const dbuser = await adminscollection.findOne({ username: userCred.username });

      if (!dbuser) {
        return res.status(400).send({ message: "Invalid username or password" });
      }

      const isPasswordValid = await bcryptjs.compare(userCred.password, dbuser.password);
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid username or password" });
      }

      const signedToken = jwt.sign({ username: dbuser.username }, process.env.SECRET_KEY, { expiresIn: '1d' });
      res.send({ message: "Login successful", token: signedToken, user: dbuser });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);


adminApp.get(
  "/recipes",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    try {
      const recipesList = await recipescollection.find({ status: true }).toArray();
      res.send({ message: "Recipes fetched successfully", payload: recipesList });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);


adminApp.post(
  "/comment/:recipeId",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    try {
      const userComment = req.body;
      const recipeIdFromUrl = parseInt(req.params.recipeId, 10);

      if (isNaN(recipeIdFromUrl)) {
        return res.status(400).send({ message: "Invalid recipe ID" });
      }

      const result = await recipescollection.updateOne(
        { recipeId: recipeIdFromUrl },
        { $addToSet: { comments: userComment } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Recipe not found" });
      }

      res.send({ message: "Comment posted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

module.exports = adminApp;
