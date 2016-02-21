// var serialPort = require('serialport');
//
// var SerialPort = serialPort.SerialPort;
//
// var dronePort = new SerialPort("/dev/tty.wchusbserial1410", {
//   baudrate: 9600
// },false);

var engineTools = require('./EngineTools.js');

var interval = null;

var serialRequests = [];
var isSending = false;
var gotSerial = false;
var dronetools = {

  getGpios : function( req, res){

    console.log('getting gpios');
    res.json({

          "message": "getting gpios"
        });

  },

  setGpio : function( req, res)
  {


  //   pinNumber = req.params.id;
  //   value     = req.params.value;
  //   if(value != 'on' || value != 'off' )
  //   {
  //       res.send('error in value parameter, aborting...');
  //       return;
  //   }
  //   else if(!isNumber(pinNumber)){
  //       res.send('invalid pinNumber value, aborting...')
  //       return;
  //   }
  //   var gpio = require('onoff').Gpio,
  //   var pin = new Gpio(pinNumber,'out');
  //
  //   if(value == 'on'){
  //     pin.writesync(1);
  //   }
  //   else if(value == 'off'){
  //     pin.writesync(0);
  //   }
  // res.send('turning '+ value +' pin Nr: '+pinNumber);
},
setEngine: function( req, res){



   engineTools.setSpeed(req.params.value);
   res.json({
     "message": "requested engine thrust of:  "+req.params.value
   });
   if(engineTools.isSending() == false){
     console.log('Serial is not sending');

     engineTools.ignite();
   }
   else if(engineTools.isSending == true){
      console.log('Serial is sending');
     engineTools.kill();
     setTimeout( function(){
       engineTools.ignite();
     }, 500);
   }

  // var open = dronePort.isOpen();
  // if(open == true){
  //   dronePort.close(function(err){
  //     if(err) console.log(err);
  //   })
  // }
  //
  // if(interval != null){
  //     clearInterval(interval);
  // }
  //
  // var engineValue = req.params.value;
  //
  //
  // console.log(req.params.value);
  // // serialRequests.push(req.params.value);
  // console.log('engine function called');
  // res.json({
  //   "message": "requested engine thrust of:  "+req.params.value
  // });
  // console.log("just before opening Serial");
  //
  // try {
  //   dronePort.open( function(error){
  //     if(error){
  //       console.log("error when opening port");
  //     }
  //     console.log('port Open');
  //     if(gotSerial == true){
  //       gotSerial = false;
  //       console.log('set gotSerial to false');
  //     }
  //     dronePort.on("data",function(data)
  //     {
  //
  //       console.log('recieved value: '+data);
  //       if(gotSerial == false){
  //         gotSerial = true;
  //       }
  //      });
  //
  //     interval = setInterval(function(value)
  //     {
  //
  //       console.log('value is: '+value);
  //       if(gotSerial){
  //         console.log('writing'+value.toString()+'to serial');
  //         dronePort.write(value.toString()+'\n',function(err, res){
  //           if(err) console.log(err);
  //           console.log('Wrote: '+res.toString()+' To Serial');
  //         });
  //       }
  //       else{
  //         console.log('did nothing');
  //       }
  //     },500,engineValue);
  //
  //
  //
  //
  //
  //
  //   });
  // } catch (e) {
  //   console.log(e);
  // } finally {
  //
  // }








    // interval = setInterval(function(value)
    // {
    //   console.log(value);
    //
    //
    //   dronePort.write(value.toString(),function(err, res){
    //     if(err) console.log(err);
    //     console.log('Wrote: '+res+' To Serial');
    //   });
    //
    // },500,req.params.value);
  //   dronePort.on('data', function(data){
  //
  //       console.log(data);
  //
  //   });
  // });

}



};

  function isNumber(n)
    {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  function sendEngineValue(value){



  }


module.exports = dronetools;
