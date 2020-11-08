const express = require("express");
const router = express.Router();

const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
const config = require("../config/database");
const path = require("path");


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

// Article Model
let Article = require("../models/article");
// User Model
let User = require("../models/user");

// Add Route
router.get("/add", ensureAuthenticated, function(req, res) {
  res.end();
});

// Add Submit POST Route
router.post("/add",ensureAuthenticated, upload.single("pic"), function(req, res) {
  //console.log("this is for from input:-");
  //console.log(JSON.stringify(req.body));
  //console.log("this is for file input:-");
  //console.log(JSON.stringify(req.file));
  //console.log("check for req.data");
  //console.log(req.data);
  if (!req.file) {
    req.checkBody("title", "Title is required").notEmpty();
    req.checkBody("body", "Body is required").notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors && errors !== '') {
      let errorsArray = [];
    errors.forEach(error=>{
      errorsArray.push({error:error.msg})
    });
      res.send(errorsArray);
      res.end();
    } else {
      let article = new Article();
      article.title = req.body.title;
      article.author = req.user._id;
      article.authorName = req.user.name;
      article.body = req.body.body;
      article.userImage = req.user.userImage;
      var date = new Date();
      article.date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
      //console.log("this is article.date :-");
      //console.log(JSON.stringify(article.date));
      article.pic = req.body.pic;
      //console.log("this is article.pic:-");
      //console.log(JSON.stringify(article.pic));

      article.save(function(err) {
        if (err) {
          console.log(err);
          return;
        } else {
          //console.log("Formdata added");
          res.send([{success: "Article Added"}]);
        }
      });
    }
  } else {
    //console.log("This is uploaded pics file name :-");
    //console.log(req.file.filename);
    req.file.owner = req.user._id;
    res.send([{success: "Article Added"}]);
  }
});

// Load Edit Form
router.get("/edit/:id", ensureAuthenticated, function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if (article.author != req.user._id) {
      return res.send([{error:"You are not the owner of this Article"}])
    }
    res.send(article)
  });
});

// Update Submit POST Route
router.post("/edit/:id", upload.single("pic"), function(req, res) {
  if (!req.file) {
    let article = {};
    article.title = req.body.title;
    article.author = req.user._id;
    article.authorName = req.user.name;
    article.body = req.body.body;
    article.userImage = req.user.userImage;
    var date = new Date();
    article.date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    //console.log("this is article.date :-");
    //console.log(JSON.stringify(article.date));
    article.pic = req.body.pic;
    //console.log("this is article.pic:-");
    //console.log(JSON.stringify(article.pic));

    let query = {
      _id: req.params.id,
    };

    Article.update(query, article, function(err) {
      if (err) {
        console.log(err);
        return;
      } else {
        //console.log("success", "Article Updated");
        res.send([{success:"Article updated"}]);
      }
    });
    if(req.body.deletePic){
      gfs.files.remove(
        {
          filename: req.data.deletePic,
        },
        function(err) {
          if (err) {
            console.log(err);
          } else {
            //console.log("Related image deleted");
          }
        }
      );
    }

    

  } else {
    //console.log("This is uploaded pics file name :-");
    //console.log(req.file.filename);
    req.file.owner = req.user._id;
    res.send([{success:"Article image uploaded"}]);
  }
});

// Delete Article
router.delete("/:id", function(req, res) {
  if (!req.user._id) {
    res.send([{error:"You re Unauthorized"}])
  }

  let query = {
    _id: req.params.id,
  };

  Article.findById(req.params.id, function(err, article) {
    if (article.author != req.user._id) {
      res.status(500).send([{error:'You are unauthorized to delete this article'}]);
    } else {
      gfs.files.remove(
        {
          filename: article.pic,
        },
        function(err) {
          if (err) {
            console.log(err);
          } else {
            //console.log("Related image deleted");
          }
        }
      );
      Article.remove(query, function(err) {
        if (err) {
          console.log(err);
        }
        res.send([{success:"Article deleted successfully"}]);
      });
    }
  });

});

// Get Single Article
router.get("/:id", function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if (err) throw err.message;
    User.findById(article.author, function(err, user) {
      res.send(article)
    });
  });
});

router.get("/pic/:filename", (req, res) => {
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
          //console.log("no file " + file);
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

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send([{error:"You are not authenticated"}])
  }
}

module.exports = router;
