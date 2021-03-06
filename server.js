const express = require('express');
const app = express();
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const session = require('express-session')
const User = require('./models/users')
const Content = require('./models/contents')
const usersController = require('./controllers/users')
const contentsController = require('./controllers/contents')

require('dotenv').config()

require('./db/db')

const PORT = process.env.PORT;

app.use(session({
    secret: "this is a random secret string",
    resave: false, 
    saveUninitialized: false 
}));

app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/users', usersController)
app.use('/contents', contentsController)


//route page
app.get('/', (req, res) => {
    res.render('route.ejs')
});

//home page
app.get('/home', async (req,res) => {
    if(!req.session.userId) {
        res.redirect('/')
    }
    try{
        const allUsers = await User.find({})
        const users = await User.find({}).populate('content')
        const content = await Content.find({})
        res.render('index.ejs', {
            message: req.session.message,
            logOut: req.session.logOutMsg,
            users: users,
            content: content,
            user: allUsers,
            currentUser: req.session.userId,
            logged: req.session.logged
        });
    } catch(err) {
        console.log(err)
    }
   
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

