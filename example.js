example = {};

example.MyBlinkTradeAlgorithm = function(app, symbol, params){
  console.log('example.MyBlinkTradeAlgorithm');
  console.log(symbol);
  console.log(params);
};

example.MyBlinkTradeAlgorithm.prototoype.run = function(params) {
  console.log('run');
  console.log(params);

};

example.MyBlinkTradeAlgorithm.prototoype.stop = function() {
  console.log('stop');
};

example.MyBlinkTradeAlgorithm.prototoype.onUpdateParams = function(params) {
  console.log('onUpdateParams');
  console.log(params);
};

example.MyBlinkTradeAlgorithm.prototoype.onOrderBookChange = function(order_book) {
  console.log('onOrderBookChange');
  console.log(order_book);
};

example.MyBlinkTradeAlgorithm.prototoype.onExecutionReport = function(report) {
  console.log('onExecutionReport');
  console.log(report);
};

example.MyBlinkTradeAlgorithm.prototoype.onTrade = function(trade) {
  console.log('onTrade');
  console.log(trade);
};

example.MyBlinkTradeAlgorithm.prototoype.onBalanceUpdate = function(balance) {
  console.log('onBalanceUpdate');
  console.log(trade);
};

