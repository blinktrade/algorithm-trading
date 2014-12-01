
/** @constructor */
var AlgorithmTradingInterface = function(){};



/**
 * @param {Object.<string,*>} params
 */
AlgorithmTradingInterface.prototype.start = function(params) { };


AlgorithmTradingInterface.prototype.stop = function() { };


/**
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onBalanceUpdate = function(msg) { };


/**
 * @param {Object.<string,*>} params
 */
AlgorithmTradingInterface.prototype.onUpdateParams = function(params) { };


/**
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onExecutionReport = function(msg) { };

/**
 * @param {Array.<Array.<number>>} order_book
 */
AlgorithmTradingInterface.prototype.onOrderBookChange = function(order_book) { };


/**
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onTicker = function(msg) { };


/**
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onOrderBookNewOrder = function(msg) { };


/**
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onOrderBookUpdateOrder = function(msg) { };


/**
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onOrderBookDeleteOrder = function(msg) { };


/**
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onOrderBookDeleteOrdersThru = function(msg) { };


/**
 * @param {Object.<string,string|number>} msg
 */
AlgorithmTradingInterface.prototype.onTrade = function(msg) { };