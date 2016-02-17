var sys = require('sys');
var WebSocketClient = require('websocket').client;

var wsClient = new WebSocketClient(); 
wsClient.connect('wss://api.testnet.blinktrade.com/trade/');

wsClient.addListener('connect', function(ws) {
  ws.addListener('message', function(buf) {
    sys.debug('Got data: ' + sys.inspect(buf));
  });
  ws.onmessage = function(m) {
    sys.debug('Got message: ' + m);
  }
  ws.send('{"MsgType":"1", "TestReqID":0}');
});


