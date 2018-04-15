const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const db = require('./config/db');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });


const app = express();

const customers = require('./routes/customers');
const administrators = require('./routes/administrators');
const books = require('./routes/books');

// Port Number
const port = 3000;


// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(upload.any());

// Passport Middleware
app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/customer', customers);
app.use('/admin', administrators);
app.use('/book', books);


// Index Route
app.get('/', (req, res) => {
    res.send('invalid endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
    console.log('Server started on port '+port);
    db.sync({force: false}).then(message => {}).catch(function(err) {
        throw err;
    });
});
