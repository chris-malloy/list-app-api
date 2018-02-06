var express = require('express');
var router = express.Router();
var config = require('../config/config')
var mysql = require('mysql')
var bcrypt = require('bcrypt-nodejs')
var connection = mysql.createConnection(config);
connection.connect();

router.post('/register', (req, res, next) => {
  console.log('register')
  var name = req.body.name
  var email = req.body.email
  var password = req.body.password
  var hash = bcrypt.hashSync(password)
  const token = randToken.uid(60);
  var selectQuery = `SELECT * from users WHERE email = ?;`;
  connection.query(selectQuery, [email], (error, results) => {
    if (error) {
      throw error;
    } else if (results.length > 0) {
      res.json({
        msg: "emailTaken"
      })
    } else {
      var insertQuery = `INSERT INTO users (name,email,password,token) VALUES (?,?,?,?);`;
      connection.query(insertQuery, [name, email, hash, token], (error, results) => {
        if (error) {
          throw error
        } else {
          res.json({
            token: token,
            name: name,
            email: email,
            msg: "loginSuccess"
          })
        }
      })
    }
  })
})

router.post('/login', (req, res, next) => {
  console.log('login')
  var email = req.body.email
  // case for when password is undefined
  if (req.body.password !== undefined) {
    var password = req.body.password;
  } else {
    var password = '';
  }
  var selectQuery = 'SELECT * FROM users WHERE email = ?;';
  connection.query(selectQuery, [email], (error, results) => {
    if (error) {
      throw error
    } else {
      // handle user does not exist
      if (results.length == 0) {
        // send user to signup
        res.json({
          msg: 'userDoesNotExist',
        })
      } else {
        var passwordMatch = bcrypt.compareSync(password, results[0].password)
        console.log(passwordMatch)
        // handle password match
        if (passwordMatch) {
          // session?
          // send them map
          res.json({
            msg: 'userFound',
            userInfo: results[0]
          })
          // handle password does not match
        } else {
          // tell user password does not match
          res.json({
            msg: 'wrongPassword',
          })
        }
      }
    }
  })
});

module.exports = router;
