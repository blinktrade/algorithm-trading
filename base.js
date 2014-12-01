// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name default.js
// @use_closure_library true
// @externs_url https://raw.githubusercontent.com/blinktrade/algorithm-trading/master/algorithm_interface.js
// ==/ClosureCompiler==

goog.require('goog.array');




/**
 * @param {string} instance_id
 * @param {string} websocket_url
 * @param {string} symbol
 * @param {Object.<number,Object.<string, number|string>>} open_orders
 * @param {Object.<string,string|number|Object>} algorithm_definition
 * @param {function(Application,string): AlgorithmTradingInterface} fn_creator
 * @constructor
 */
var Application = function( instance_id, websocket_url, symbol, open_orders, algorithm_definition, fn_creator ) {
  this.websocket_url_ = websocket_url;
  this.instance_id_ = instance_id;
  this.selected_symbol_ = symbol;
  this.open_orders_ = open_orders;
  this.algorithm_definition_ = algorithm_definition;
  this.params_ = null;

  this.status_ws_open_ = false;
  this.status_received_full_refresh_ = false;
  this.status_received_security_status_ = false;
  this.status_started_ = false;
  this.trade_history_ = [];
  this.order_book_ = {};

  this.ws_ = new WebSocket(this.websocket_url_);

  /** @type {AlgorithmTradingInterface} */
  this.instance_ = fn_creator( this, symbol );
  this.ws_.onopen =  goog.bind(this.onWebSocketOpen_, this);
  this.ws_.onmessage = goog.bind(this.onWebSocketMessage_, this);
  this.ws_.onerror = goog.bind(this.onWebSocketError_, this);
};

/**
 * @type {AlgorithmTradingInterface}
 */
Application.prototype.instance_;


/**
 * Returns an object with all bids and asks
 * @return {Object.<string, Array.<Array.<number>>>}
 *   The returned Object structure is:
 *     {
 *        'bids' : [  [price, qty], [price, qty],  ... [price, qty]  ],
 *        'asks' : [  [price, qty], [price, qty],  ... [price, qty]  ]
 *     }
 */
Application.prototype.getOrderBook = function() {
  return this.order_book_[this.selected_symbol_];
};

/**
 * Return an array containing all trades that occurred in the past 24 hours
 * @return {Array.<Object>}
 *   The returned Object structure is:
 *      MDEntryBuyerID: 90800013.   => The buyer account id
 *      MDEntryDate: "2014-11-30"   => Date of the Trade represented in UTC, Format: YYYY-MM-DD
 *      MDEntryTime: "09:32:05"     => Time of the Trade represented in UTC, Format: HH:MM:SS
 *      MDEntryPx: 50100000000      => Price per share
 *      MDEntrySellerID: 90000002   => The seller account id
 *      MDEntrySize: 1000000        => Volume of the trade
 *      MDEntryType: "2"            => Type Market Data entry.  Always 2 - Trade
 *      OrderID: 392                => Unique identifier for Order as assigned by the exchange
 *      SecondaryOrderID: 384       => Counter party OrderID
 *      Side: "1"                   => Side of the execution. 1-Buy, 2-Sell
 *      Symbol: "BTCUSD"            => Ticker symbol
 *      Timestamp: [native Object]  => Javascript Date object representation of MDEntryDate+MDEntryTime
 *      TradeID: 183                => Trade identification
 */
Application.prototype.getTrades = function() {
  return this.trade_history_;
};

/**
 * Return the parameters previously set.
 * @return {Object}
 */
Application.prototype.getParameters = function() {
  return this.params_;
};

/**
 * Returns all open orders.
 *   The returned Object structure is:
 *     Key:  OrderID.
 *     Value: Another key/value object with all order fields and its values. Example:
 *        AvgPx: 39000000000   => Calculated average price of all fills on this order.
 *        ClOrdID: "2414949"   => Unique identifier for Order as assigned by you during the order creation.
 *        CumQty: 96300000     => Total number of shares filled.
 *        CxlQty: 0            => Total number of shares canceled for this order.
 *        LeavesQty: 403700000 => Amount of shares open for further execution.
 *        OrdStatus: "1"       => Identifies current status of order. 0-New, 1-Partially filled, 2-Filled, 4-Canceled
 *        OrdType: "2"         => Order type. 1-Market, 2-Limited, 3-Stop, 4-Stop Limit
 *        OrderDate: "2014-11-29 21:06:04" => Time/date combination represented in UTC, Format: YYYY-MM-DD HH:MM:SS
 *        OrderID: 100         => Unique identifier for Order as assigned by the exchange
 *        OrderQty: 500000000  => Quantity ordered
 *        Price: 39000000000   => Price per unit of quantity
 *        Side: "2"            => Side of order,  1-Buy, 2-Sell
 *        Symbol: "BTCUSD"     => Ticker symbol
 *        TimeInForce: "1"     => Specifies how long the order remains in effect. 0-Day, 1-Good Till Cancel(GTC)
 *        Volume: 37557000000  => Total volume traded. CumQty * AvgPx
 * @return {Object}.
 */
Application.prototype.getOpenOrders = function() {
  return this.open_orders_;
};


/**
 * @return {string}. Returns the market in which the algorithm will send its orders.
 */
Application.prototype.getMarket = function() {
  return this.selected_symbol_;
};

/**
 * @return {string}. Returns the algorithm GUID instance id.
 */
Application.prototype.getInstanceID = function() {
  return this.instance_id_;
};

/**
 * Show a notification to the user
 * @param {string} title
 * @param {string} description
 * @param {string=} opt_type Defaults to "info". It can be one of the following values "info", "success", "error"
 */
Application.prototype.showNotification = function(title, description, opt_type) {
  var notification_type = opt_type | "info";
  postMessage({'rep':'notification',
                'instance':this.instance_id_,
                'type': notification_type,
                'title': title,
                'description': description  });
};

/**
 * Terminates the algorithm.
 * @param {string=} opt_error_message An error notification will be shown in filled.
 */
Application.prototype.stop = function(opt_error_message) {
  try {
    if (this.status_started_) {
      this.instance_.stop();
      this.status_started_ = false;
    }
  } catch(e) {}

  if (opt_error_message == null){
    postMessage({'rep':'stop', 'instance':this.instance_id_ });
  } else {
    postMessage({'rep':'stop', 'instance':this.instance_id_, 'error':opt_error_message });
  }
};





Application.prototype.onWebSocketOpen_ = function(e) {
  this.status_ws_open_ = true;
  postMessage({'rep':'create', 'instance':this.instance_id_, 'status':'ws_open' });

  var mdRequestId = parseInt( 1e7 * Math.random() , 10 );

  var instruments = [this.selected_symbol_];

  var msgSubscribeMarketData = {
    'MsgType': 'V',
    'MDReqID': mdRequestId,
    'SubscriptionRequestType': '1',
    'MarketDepth': 0,
    'MDUpdateType': '1',
    'MDEntryTypes': ['0', '1', '2'],
    'Instruments': instruments
  };
  this.ws_.send(JSON.stringify(msgSubscribeMarketData));

  var msgSubscribeSecurityStatus = {
    'MsgType': 'e',
    'SecurityStatusReqID': parseInt( 1e7 * Math.random() , 10 ),
    'SubscriptionRequestType': '1',
    'Instruments': instruments
  };
  this.ws_.send(JSON.stringify(msgSubscribeSecurityStatus));

  setTimeout( goog$bind(this.sendTestRequest_, this), 30000);
};

Application.prototype.sendTestRequest_ = function() {
  var msgTestRequest = {
    'MsgType': '1',
    'TestReqID': parseInt( 1e7 * Math.random() , 10 ),
    'SendTime': new Date().getTime()
  };
  this.ws_.send(JSON.stringify(msgTestRequest));
};

Application.prototype.start_ = function(params) {
  if ( this.status_started_ ) {
    return;
  }

  try {
    this.instance_.start(params);
    this.status_started_ = true;
  } catch(e) {}

  postMessage({'rep':'start', 'instance':this.instance_id_});
};

/**
 * @param {string=} error_message
 */
Application.prototype.terminate_ = function(error_message) {
  try {
    if (this.status_started_) {
      this.instance_.stop();
      this.status_started_ = false;
    }
  } catch(e) {}

  if (error_message == null){
    postMessage({'rep':'terminate', 'instance':this.instance_id_ });
  } else {
    postMessage({'rep':'terminate', 'instance':this.instance_id_, 'error':error_message });
  }
};

/**
 * @param {Object} msg
 */
Application.prototype.processBalanceMsg_ = function(msg) {
  try {
    this.instance_.onBalanceUpdate(msg);
  } catch(e) {}
  postMessage({'rep':'balance', 'instance':this.instance_id_});
};


/**
 * @param {Object} msg
 */
Application.prototype.processParamsMsg_ = function(msg) {
  this.params_ = msg;
  try {
    this.instance_.onUpdateParams(msg);
  } catch(e) {}
  postMessage({'rep':'params', 'instance':this.instance_id_});
};

/**
 * @param {Object} msg
 */
Application.prototype.processExecutionReportMsg_ = function(msg) {
  if (msg['OrdStatus'] == '2' || msg['OrdStatus'] == '4' ) {
    delete this.open_orders_[msg['OrderID'] ];
  } else {
    this.open_orders_[msg['OrderID'] ] = msg;
  }

  try {
    this.instance_.onExecutionReport(msg);
  } catch(e) {}

  postMessage({'rep':'execution_report', 'instance':this.instance_id_});
};


Application.prototype.onWebSocketError_ = function (e) {
  this.terminate_(e.data);
};

Application.prototype.onTicker_ = function(msg) {
  if (!this.status_started_) {
    return;
  }

  try {
    this.instance_.onTicker(msg);
  } catch(e) {}
};

Application.prototype.onMDNewOrder_ = function(msg) {
  var symbol    = msg['Symbol'];
  var side      = msg['MDEntryType'];
  var index     = msg['MDEntryPositionNo'] - 1;
  var price     = msg['MDEntryPx'];
  var qty       = msg['MDEntrySize'];

  if ( this.order_book_[symbol] == null ) {
    this.order_book_[symbol] = {'bids': [], 'asks':[] };
  }

  if (side == '0') {
    goog.array.insertAt(this.order_book_[symbol]['bids'], [price, qty], index);
  } else if (side == '1') {
    goog.array.insertAt(this.order_book_[symbol]['asks'], [price, qty], index);
  }

  if (!this.status_started_) {
    return;
  }

  try {
    this.instance_.onOrderBookNewOrder(entry);
  } catch(e) {}

  try {
    this.instance_.onOrderBookChange(this.order_book_[symbol]);
  } catch(e) {}
};

Application.prototype.onMDUpdateOrder_ = function(msg) {
  var symbol    = msg['Symbol'];
  var side      = msg['MDEntryType'];
  var index     = msg['MDEntryPositionNo'] - 1;
  var qty       = msg['MDEntrySize'];

  if (side == '0') {
    this.order_book_[symbol]['bids'][index] = [this.order_book_[symbol]['bids'][index][0], qty];
  } else if (side == '1') {
    this.order_book_[symbol]['asks'][index] = [this.order_book_[symbol]['asks'][index][0], qty];
  }

  if (!this.status_started_) {
    return;
  }

  try {
    this.instance_.onOrderBookUpdateOrder(msg);
  } catch(e) {}

  try {
    this.instance_.onOrderBookChange(this.order_book_[symbol]);
  } catch(e) {}
};

Application.prototype.onMDDeleteOrder_ = function(msg) {
  var symbol = msg['Symbol'];
  var index  = msg['MDEntryPositionNo'] - 1;
  var side   = msg['MDEntryType'];

  if (side == '0') {
    this.order_book_[symbol]['bids'].splice(index,1);
  } else if (side == '1') {
    this.order_book_[symbol]['asks'].splice(index,1);
  }

  if (!this.status_started_) {
    return;
  }

  try {
    this.instance_.onOrderBookDeleteOrder(msg);
  } catch(e) {}

  try {
    this.instance_.onOrderBookChange(this.order_book_[symbol]);
  } catch(e) {}
};

Application.prototype.onMDDeleteOrderThru_ = function(msg) {
  var symbol = msg['Symbol'];
  var index  = msg['MDEntryPositionNo'];
  var side   = msg['MDEntryType'];

  if (side == '0') {
    this.order_book_[symbol]['bids'].splice(0, index);
  } else if (side == '1') {
    this.order_book_[symbol]['asks'].splice(0, index);
  }

  if (!this.status_started_) {
    return;
  }

  try {
    this.instance_.onOrderBookDeleteOrdersThru(msg);
  } catch(e) {}

  try {
    this.instance_.onOrderBookChange(this.order_book_[symbol]);
  } catch(e) {}
};

Application.prototype.onMDTrade_ = function(msg) {
  var timestamp = new Date();
  var create_date_parts = msg['MDEntryDate'].split('-');
  var create_time_parts = msg['MDEntryTime'].split(':');
  timestamp.setUTCFullYear(create_date_parts[0]);
  timestamp.setUTCMonth(create_date_parts[1]);
  timestamp.setUTCDate(create_date_parts[2]);
  timestamp.setUTCHours(create_time_parts[0]);
  timestamp.setUTCMinutes(create_time_parts[1]);
  timestamp.setUTCSeconds(create_time_parts[2]);
  msg["Timestamp"] = timestamp;

  this.trade_history_.push( msg );

  if (!this.status_started_) {
    return;
  }

  try {
    this.instance_.onTrade(msg);
  } catch(e) {}
};

Application.prototype.onWebSocketMessage_ = function (e) {
  var msg = JSON.parse(e.data);

  var msg_type = msg['MsgType'];
  delete msg['MsgType'];

  switch( msg_type ) {
    case 'f':
      this.onTicker_(msg);
      if (!this.status_received_security_status_) {
        postMessage({'rep':'create', 'instance':this.instance_id_, 'status':'received_security_status' });
      }
      this.status_received_security_status_ = true;
      break;
    case 'W':
      for ( var x in msg['MDFullGrp']) {
        var entry = msg['MDFullGrp'][x];
        entry['MDReqID'] = msg['MDReqID'];
        switch (entry['MDEntryType']) {
          case '0': // Bid
          case '1': // Offer
            entry['Symbol'] = msg['Symbol'];
            this.onMDNewOrder_(entry);
            break;
          case '2': // Trade
            this.onMDTrade_(entry);
            break;
        }
      }
      if (!this.status_received_full_refresh_) {
        postMessage({'rep':'create', 'instance':this.instance_id_, 'status':'received_full_refresh' });
      }
      this.status_received_full_refresh_ = true;
      break;
    case 'X':
      for ( var y in msg['MDIncGrp']) {
        var xentry = msg['MDIncGrp'][y];
        xentry['MDReqID'] = msg['MDReqID'];
        switch (xentry['MDEntryType']) {
          case '0': // Bid
          case '1': // Offer
            switch( xentry['MDUpdateAction'] ) {
              case '0':
                this.onMDNewOrder_(xentry);
                break;
              case '1':
                this.onMDUpdateOrder_(xentry);
                break;
              case '2':
                this.onMDDeleteOrder_(xentry);
                break;
              case '3':
                this.onMDDeleteOrderThru_(xentry);
                break;
            }
            break;
          case '2': // Trade
            this.onMDTrade_(xentry);
            break;
        }
      }
      break;
  }
};

var _app;
addEventListener('message', function(e) {
  try {
    var data = e.data;
    switch (data['req']) {
      case 'create':
        /**
         * @type {function(Application,string): AlgorithmTradingInterface}
         */
        var creator_fn = /** @type {function(Application,string): AlgorithmTradingInterface} */ (eval(context["algo_definition"]['creator']));

        _app = new Application(context["algo_instance_id"],
                               context["wss_url"],
                               context["symbol"],
                               context["open_orders"],
                               context["algo_definition"],
                               creator_fn);
        break;
      case 'start':
        _app.start_(data['params']);
        break;
      case 'params':
        _app.processParamsMsg_( data['params'] );
        break;
      case 'execution_report':
        _app.processExecutionReportMsg_( data['execution_report'] );
        break;
      case 'stop':
        _app.stop();
        self.close();
        break;
      case 'balance':
        _app.processBalanceMsg_( data['balances'] );
        break;
    }
  } catch (error) {
    if (_app != null) {
      _app.terminate_(error.message);
    }
    self.close();
  }
}, false);


goog.exportSymbol('Application', Application);
goog.exportProperty(Application.prototype, 'getOrderBook', Application.prototype.getOrderBook);
goog.exportProperty(Application.prototype, 'getTrades', Application.prototype.getTrades);
goog.exportProperty(Application.prototype, 'getParameters', Application.prototype.getParameters);
goog.exportProperty(Application.prototype, 'getOpenOrders', Application.prototype.getOpenOrders);
goog.exportProperty(Application.prototype, 'getMarket', Application.prototype.getMarket);
goog.exportProperty(Application.prototype, 'getInstanceID', Application.prototype.getInstanceID);
goog.exportProperty(Application.prototype, 'showNotification', Application.prototype.showNotification);
goog.exportProperty(Application.prototype, 'stop', Application.prototype.stop);


