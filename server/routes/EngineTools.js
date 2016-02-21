var serialPort = require('serialport');

var SerialPort = serialPort.SerialPort;

var dronePort = new SerialPort("/dev/tty.wchusbserial1410", {
  baudrate: 9600
},false);
// var dronePort = new SerialPort("/dev/tty.wchusbserial1410", {
//   baudrate: 9600,
//   dataBits : 8,
//   parity : 'none',
//   stopBits : 1,
//   flowControl : false
// },false);

var gotSerial = false;
var engineSpeed = 0;
var interval = null;

var engineTools = {

  setSpeed : function(speed)
  {
      if(engineSpeed !== speed){
        engineSpeed = speed;
        console.log('speed set to:' + engineSpeed);
        clearInterval(interval);
        sendSerial(engineSpeed);
      }

  },
  ignite : function()
  {
    console.log('igniting...')
    dronePort.open(function(err){
      if(interval == null){
        setTimeout( function(){
          sendSerial(engineSpeed);
        }, 500);
      }


      dronePort.on("data",function(data)
      {
        if(gotSerial !== true){
          gotSerial = true;
        }
        console.log('recieved value: '+data);
       });



    });
  },
  kill : function()
  {
    if(interval != null){
        clearInterval(interval);
    }
    var open = dronePort.isOpen();
    if(open == true){
      dronePort.close(function(err){
        if(err) console.log(err);
      })
    }
  },
  isSending : function()
  {
      return dronePort.isOpen();
   }
}

 function sendSerial(speedValue){

   interval = setInterval( function(value){

     if(true){
       sendValue = String(value);
       console.log('writing'+sendValue+'to serial');
       dronePort.write(sendValue+'\n',function(err, res){
         if(err) console.log(err);
         console.log('Wrote: '+res.toString()+' To Serial');
       });
     }
     else {
       console.log('did nothing');
     }
   },500,speedValue.toString());

 }



module.exports = engineTools;
