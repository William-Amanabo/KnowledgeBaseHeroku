const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
const config = require("../config/database");
const path = require("path");

// Bring in User Model
let User = require("../models/user");

//mongoose.connect(config.database);

const storage = new GridFsStorage({
  url: config.database,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          /* filename: filename, */
          filename: file.originalname,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

// making the storage usable
const upload = multer({
  storage,
});

// Register Proccess
router.post("/register", upload.single("userImage"), function(req, res) {
  if (!req.file) {
    //console.log("this is req.body from users/register", req.body);
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const userImage = req.body.userImage;

    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("email", "Email is required").notEmpty();
    req.checkBody("email", "Email is not valid").isEmail();
    req.checkBody("username", "Username is required").notEmpty();
    req.checkBody("password", "Password is required").notEmpty();
    req
      .checkBody("confirmPassword", "Passwords do not match")
      .equals(req.body.password);

    let errors = req.validationErrors();

    if (errors && errors !== "") {
      let errorsArray = [];
      errors.forEach((error) => {
        errorsArray.push({ error: error.msg });
      });
      res.send(errorsArray);
      res.end();
    } else {
      let newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password,
        userImage: userImage,
      });

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          if (err) {
            console.log(err);
          }
          newUser.password = hash;
          newUser.save(function(err) {
            if (err) {
              console.log(err);
              return;
            } else {
              //console.log("New user created redirecting to login page");
              res.end();
            }
          });
        });
      });
    }
  } else {
    //console.log("This is registration uploaded pics file name :-");
    //console.log(req.file.filename);
    req.file.owner = req.user._id;
    res.send([{ success: "Registration successful" }]);
  }
});

// Login Process
router.post("/login", function(req, res, next) {
  //console.log("from /login checking if req.user", req.user);
  passport.authenticate("local", {}, (error, user, messages) => {

    if (user) {
      req.logIn(user, (err) => {
        if (err) console.log(error);
        return res.send({ user, messages });
      });
    } else {
      res.send({ user, messages });
    }
  })(req, res, next);
});



// logout
router.get("/logout", function(req, res) {
  req.logout();
  //console.log("user loggedout");
  res.send([{ success: "You are now Logged out" }]);
});

router.get("/userImage/:filename", (req, res) => {
  if (
    req.params.filename &&
    req.params.filename != undefined &&
    req.params.filename != ":undefined"
  ) {
    gfs.files.findOne(
      {
        filename: req.params.filename,
      },
      (err, file) => {
        //Check if files
        if (!file || file.length === 0) {
          //console.log("no file for users" + file);
          return res.status(404).json({
            err: "No file exist",
          });
        } else {
          if (
            file.contentType === "image/jpeg" ||
            file.contentType === "image/png"
          ) {
            //Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
          } else {
            res.status(404).json({
              err: "Not an Image",
            });
          }
        }
      }
    );
  }
});

module.exports = router;
