// var levelup = require('levelup');
//
// var db = {
//
//   validate : function (username,password){
//     levelup('../db/dronetools.db', function (err, db) {
//
//         db.get(username, function(err, value){
//             if(err) {
//               return false;
//             }
//             else if(value.body.password == password){
//               return value;
//             }
//             else {
//               return false;
//             }
//         })
//
//
//       })
//
//       return false;
//
//   }
//
//
// }
//
// var db = levelup('../db/dronetools');
