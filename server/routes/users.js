

var users = {



  getAll: function(req, res) {
    var allData = [];
    db.createReadStream()
    .on('data', function (data) {
      allData.push(data);
      console.log(data.key, '=', data.value)
    })
    .on('error', function (err) {
      console.log('Oh my!', err)
    })
    .on('close', function () {
      console.log('Stream closed')
    })
    .on('end', function () {
      console.log('Stream closed')
    })


    res.json(allData);
  },

  getOne: function(req, res) {
    var id = req.params.id;
    var user;
    db.get(id, function(err, value){
      if(err) {
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        })
      }

      res.json(value);
    });

  },

  create: function(req, res) {
    var newuser = req.body;
    data.push(newuser); // Spoof a DB call
    res.json(newuser);
  },

  update: function(req, res) {
    var updateuser = req.body;
    var id = req.params.id;
    data[id] = updateuser // Spoof a DB call
    res.json(updateuser);
  },

  delete: function(req, res) {
    var id = req.params.id;
    data.splice(id, 1) // Spoof a DB call
    res.json(true);
  }
};

var data = [{
  name: 'user 1',
  id: '1'
}, {
  name: 'user 2',
  id: '2'
}, {
  name: 'user 3',
  id: '3'
}];

module.exports = users;
