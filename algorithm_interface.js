
/**
 * @param {Application} application
 * @param {string} symbol
 * @constructor
 */
var AlgorithmTradingInterface = function(application, symbol){};

/**
 * @enum {string} Balance Types
 */
AlgorithmTradingInterface.BalanceType = {
  DEPOSIT : 'deposit',
  LOCKED:  'locked',
  AVAILABLE: 'available'
};

/**
 * Invoked when your algorithm is ready to run.
 * Don't try to send orders before the start method.
 * @param {Object.<string,*>} params
 */
AlgorithmTradingInterface.prototype.start = function(params) { };

/**
 * Invoked before the system stops your algo. Do your cleanup here
 */
AlgorithmTradingInterface.prototype.stop = function() { };


/**
 * Invoked whenever your balance change
 * @param {string} currency
 * @param {number} balance
 * @param {AlgorithmTradingInterface.BalanceType} balance_type
 */
AlgorithmTradingInterface.prototype.onBalanceUpdate = function(currency, balance, balance_type) { };


/**
 * Invoked when you update your parameters.
 * @param {Object.<string,*>} params
 */
AlgorithmTradingInterface.prototype.onUpdateParams = function(params) { };


/**
 * Invoked to report the arrival of a new order, and executions on it.
 * @param {Object.<string,string|number>} msg
 * @see {http://btobits.com/fixopaedia/fixdic44/message_Execution_Report_8_.html}
 */
AlgorithmTradingInterface.prototype.onExecutionReport = function(msg) { };


/**
 * Invoked when there was a change in the order book
 * @param {Array.<Array.<number>>} order_book
 */
AlgorithmTradingInterface.prototype.onOrderBookChange = function(order_book) { };


/**
 * Invoked when there is a change in the ticker
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onTicker = function(msg) { };


/**
 * Invoked when a new order arrives in the order book
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onOrderBookNewOrder = function(msg) { };


/**
 * Invoked when an order gets updated in the order book
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onOrderBookUpdateOrder = function(msg) { };


/**
 * Invoked when an order gets deleted from the order book
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onOrderBookDeleteOrder = function(msg) { };


/**
 * Invoked when one or more orders gets deleted from the order book
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onOrderBookDeleteOrdersThru = function(msg) { };


/**
 * Invoked when there is a new trade in the exchange
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onTrade = function(msg) { };