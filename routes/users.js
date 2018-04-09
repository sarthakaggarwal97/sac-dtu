const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User ({
    
    name: req.body.name,
    email:req.body.email,
    username:req.body.username,
    batch:req.body.batch,
    branch:req.body.branch,
    sex:req.body.sex,
    phone:req.body.phone,
    linkedin:req.body.linkedin,
    higherDegree:req.body.higherDegree,
    currCity:req.body.currCity,
    currState: req.body.currState,
    country: req.body.country,
    status: req.body.status,
    collegeMasters:req.body.collegeMasters,
    company: req.body.company,
    jobDesig: req.body.jobDesig,
    pastCompany: req.body.pastCompany,
    pastDesig: req.body.pastDesig,
    password: req.body.password,
    otherInfo:req.body.otherInfo
    
  });

  User.addUser(newUser, (err, user) => {
    if(err) {
      res.json({success: false, msg: 'Failed to register user'});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            email:user.email,
            username:user.username,
            batch:user.batch,
            branch:user.branch,
            sex:user.sex,
            phone:user.phone,
            linkedin:user.linkedin,
            higherDegree:user.higherDegree,
            currCity:user.currCity,
            currState: user.currState,
            country: user.country,
            status: user.status,
            collegeMasters:user.collegeMasters,
            company: user.company,
            jobDesig: user.jobDesig,
            pastCompany: user.pastCompany,
            pastDesig: user.pastDesig,
            password: user.password,
            otherInfo:user.otherInfo
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

router.put('/editProfile:_id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	var id = req.params._id;
	var user = req.body;
	User.updateUser(id, user, {}, (err, user) => {
		if(err){
			throw err;
		}
		res.json(user);
	});
});

module.exports = router;
