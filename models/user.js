import { currentId } from 'async_hooks';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema ({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  linkedin: {
    type: String
  },
  higherDegree: {
    type: String
  },
  collegeMasters: {
    type: String
  },
  currCity: {
    type: String
  },
  currState: {
    type: String
  },
  country: {
    type: String
  },
  company: {
    type: String
  },
  jobDesig: {
    type: String
  },
  pastCompany: {
    type: String
  },
  pastDesig: {
    type: String
  },
  otherInfo: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

// Update User
module.exports.updateUser = (id, user, options, callback) => {
	var query = {_id: id};
	var update = {
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
	User.findOneAndUpdate(query, update, options, callback);
}


module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
