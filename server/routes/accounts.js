// Import modules
var levelup = require('levelup');
var accountdown = require('accountdown');

// open a data store
var db = levelup('./test.db');


var accounts = {


  createUser : function (uid,pass,roletype, callback) {

      var users = accountdown(db,
        {
          login: { basic: require('accountdown-basic') }
        });

    var user =
    {
      login: { basic: { username: uid, password: pass } },
      value: { username : uid, role: roletype}
    };

    var idStream = users.list();
    var newKey = 0;
    var accounts = [];

    console.log('current keyValues :\n')
    idStream.on('data', function(data){
      accounts.push(data);
    })
    .on('end', function(){
        accounts.forEach(function (account){
            if(account.key > newKey) newKey = account.key;
            console.log(account.key);
            })
        newKey++;
        console.log('Next entry should have key nr:\n'+newKey);
        create();
    });



    function create() {
      users.create(newKey, user, function (err) {
      if (err) {
        callback(new Error(err));
        return;
          }
        else {
        callback(null,'created successfully!');
        return;
      }
      });
    }



  },

  verify : function (uid,pass,callback) {
    var users = accountdown(db,
      {
        login: { basic: require('accountdown-basic') }
      });

    var creds =
      {
        username : uid, password : pass
      };

    users.verify('basic', creds, function (err, ok, id)
      {
        if (err){
          console.log('verification went bad');
          callback(new Error('verification went bad'));
          return;
        }
        console.log('ok=', ok);
        console.log('id=', id);
        if(ok != true){
          console.log('bad credentials!');
          callback(new Error('bad credentials!'));
          return;
        }


        users.get(id,function(err,row){

            if(err)
            {
              callback(new Error(err));
              return;
            }
            console.log(row.username);
            var json = "{\"username\": \""+row.username+"\",\"role\":\""+row.role+"\"}";
            var returnValue = JSON.parse(json);
            console.log(returnValue);



            callback(null,returnValue);
          });


      });
    },
    getUser : function (uid,callback)
    {
      console.log('uid into getuser = ' + uid );
      var users = accountdown(db,
        {
          login: { basic: require('accountdown-basic') }
        });
          var userkey = null;
          var idStream = users.list();
          idStream.on('data', function(data){

              if(data.value.username = uid){
                userkey = data.key;
                console.log('assigned key is'+ userkey);
              }

          })
          .on('end', function(){
            if(userkey == null){
              callback(new Error('no user found'));
            }
            console.log('stream parsing completed, found key: '+userkey);

            users.get(userkey, function(err,row){
            if(err)
            {
              console.log('got error while getting user');
              callback(new Error(err));
              return;
            }
            var json = "{\"username\": \""+row.username+"\",\"role\":\""+row.role+"\"}";
            var returnValue = JSON.parse(json);
            console.log(returnValue);

            callback(null,returnValue);
          });

          });


    }



};
module.exports = accounts;
