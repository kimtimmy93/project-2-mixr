const express = require('express');
const app = express();
const PORT = 3333;
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const session = require('express-session')

require('./db/db')


app.use(session({
    secret: "this is a random secret string",
    resave: false, 
    saveUninitialized: false 
  }));

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));

const usersController = require('./controllers/users')
app.use('/users', usersController)

const contentsController = require('./controllers/contents')
app.use('/contents', contentsController)


//route page
app.get('/', (req,res) => {
    console.log(req.session, 'home route')
    res.render('route.ejs')
});

//home page
app.get('/home', (req,res) => {
    console.log(req.session, 'home route')
    res.render('index.ejs', {
        message: req.session.message,
        logOut: req.session.logOutMsg
    })
});



app.listen(PORT, () => {
    console.log('listening on port', 3333)
});

