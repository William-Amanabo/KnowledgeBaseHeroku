const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');

mongoose.connect(config.database,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false}).then(()=>{
    console.log("DataBase connected successfully")
}).catch(err=>{
    console.log.error(err) 
});
let db = mongoose.connection;

// Check connection
db.once('open', function() {
    console.log('Connected to MongoDB');
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log('Connected to uploads');
});


// Check for DB errors
db.on('error', function(err) {
    console.log(err);
});

// Configuring storage.... 
const storage = new GridFsStorage({
    url: config.database,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) return reject(err)

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            })
        })
    }

})

// making the storage usable
const upload = multer({ storage });

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');


// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));


// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname,'./build')));



// Home Route
app.get('/articles', function(req, res) {
    Article.find({}, function(err, articles) {
        //console.log(articles);
        if (err) {
            console.log(err);
            res.json({error:"Error getting articles"});
            throw err;
        } else {
            res.send(articles);
        }
    });
});

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users); 

app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    //console.log("this is user from '*' :",res.locals.user)
    res.sendFile(path.join(__dirname,'./build/index.html'));
});

// Start Server
const port = process.env.PORT || 5000
app.listen(port, function() {
    console.log('Server started on port '+port);
})