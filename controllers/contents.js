const express = require('express');
const router = express.Router();
const Content = require('../models/contents');
const User = require ('../models/users');

const isLoggedIn = (req, res, next) => {
    if(req.session.userId){
        next()
    } else {
        res.redirect('/')
    }
}

//edit
router.get('/:id/edit', async (req, res) => {
    try {
        const allUsers = await User.find({})
        const foundContentUser = await User.findOne({'content': req.params.id})
                                .populate({path:'content',
                                match: {_id: req.params.id}})
                                .exec()
            res.render('contents/edit.ejs', {
                content: foundContentUser.content[0],
                users: allUsers,
                contentUser: foundContentUser
            });
    } catch(err) {
        res.send(err);
    }   
});


//index
router.get('/', async (req, res) => {
    
    try {
        const allContents = await Content.find({});
            res.render('contents/index.ejs', {
                contents: allContents,
                logged: req.session.logged,
                currentUser: req.session.userId,
            });
        } catch(err) {
            res.send(err);
        }
});

//new
router.get('/new', isLoggedIn, async (req, res) => {
    try {
        const allUsers = await User.find();

            res.render('contents/new.ejs', {
                users: allUsers,
                currentUser: req.session.userId,
                logged: req.session.logged
            });
    } catch(err) {
        res.send(err)
    }
});

//show
router.get('/:id', async (req, res) => {
    try {
        const foundUser = await foundUser.findOne({'contents': req.params.id})
                                         .populate(
                                             {
                                                path: 'contents',
                                                match: {_id: req.params.id}
                                             }
                                         )
                                         .exec()
            res.render('contents/show.ejs', {
                user: foundUser,
                content: foundUser.contents[0]
            });
    } catch(err) {
        res.send(err);
    }
});


//post
router.post('/', async (req, res) => {
    try {
        const findUser = await User.findById(req.session.userId);
        req.body.username = findUser.username
        const createContent = await Content.create(req.body);
        findUser.content.push(createContent);
        findUser.save()
        res.redirect('/home');
    } catch(err) {
        res.send(err)
    }
});

//delete
router.delete('/:id', async (req, res) => {
    try {
            const deleteContent = await Content.findByIdAndRemove(req.params.id);
            const findUser = await User.findOne({'username': deleteContent.username});
            let index = findUser.content.indexOf(deleteContent._id)
            findUser.content.splice(index, 1);
            findUser.save()

            res.redirect('/home');
        } catch(err){
            res.send(err);
        }
});

//put
router.put('/:id', async (req, res) => {
    try {
        const updatedContent = await Content.findByIdAndUpdate(req.params.id, req.body, {new: true});
        const foundUser = await User.findOne({'content': req.params.id});
        if(foundUser) {
                console.log(foundUser.content, '<---i')
                foundUser.content.remove(req.params.id);
                await foundUser.save();
                const newUser = await User.findById(req.body.userId);
                newUser.content.push(updatedContent);
    
                const savedNewUser = await newUser.save();
            

            res.redirect('/home');
            } else {
                res.redirect('/home');
            }
        } catch(err) {
            console.log(err);
        }
});






module.exports = router;