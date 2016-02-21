var jwt = require('jwt-simple');
var accounts = require('./accounts.js');



var auth = {



  login: function(req, res) {
    console.log('login in');
    var username = req.body.username || '';
    var password = req.body.password || '';
    console.log(username+' : '+password);

    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to the DB and check if the credentials are valid
    var dbUserObj = auth.validate(username, password, function(err, dbUserObj){

        if(err)
        {
          console.log(err);
          res.json({
            "status": 401,
            "message": "Invalid credentials"
          });
          return;
        }
        console.log("object from db ="+dbUserObj);


      if (!dbUserObj) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    if (dbUserObj) {

      // If authentication is success, we will generate a token
      // and dispatch it to the client

      res.json(genToken(dbUserObj));
    }
    });
  },

  validate: function(username, password, callback) {
    // spoofing the DB response for simplicity
    console.log('validating');
    accounts.verify(username,password,function(err,value){
          if(err) {
            callback(new Error('Oops, something went wrong!'));
            return;
          }

          callback(null,value);
        });

  },

  validateUser: function(username,callback) {
    // spoofing the DB response for simplicity
    var dbUserObj = accounts.getUser(username, function(err,value){
        if(err){
          callback(new Error('error while retreiving user'));
          return;
        }
        callback(null,value);
    });


  },
}

// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
