### algorithm-trading  ( DOCUMENTATION IS INCOMPLETE, TAKE A LOOK AT THE [EXAMPLES](https://github.com/blinktrade/algorithm-trading/tree/master/algorithms) )


This repository contains algorithm trading programs ( AKA trading strategies, trading bot ) which are compatible with all exchanges running the blinktrade platform. Those algorithms are executed in the users browser context and not in the servers.

### Pre-requisites to create your own algorithm trading 
- Basic knowledge of JavaScript 
- Curiosity 

### Is there a test environment to test my algorithms?
- Yes, [blinktrade tesnet exchange](https://testnet.blinktrade.com/)


### List of blinktrade approved algorithm trading strategies 
- [market_maker.algo ** incomplete **](https://github.com/blinktrade/algorithm-trading/blob/master/algorithms/market_maker.algo)


### Basic structure of an algorithm
```JavaScript
-----BEGIN ALGO DEFINITION-----
  {
    "id": "any_id_here",
    "description": "Description of what your algorithm does",
    "params": [
      {"name":"your_parameter_1", "label":"Your Parammeter #1", "type":"text", "value":"0", "validator":"required; validateNumber; validateMin 10; validateMax 1000;" },
      {"name":"your_parameter_2", "label":"Your Parammeter #2", "type":"text", "value":"5", "validator":"required; validateInteger; validateMin 1; validateMax 5;" }
    ],
    "creator": "name_of_the_function_which_the_exchange_will_invoke_to_create_an_instance_of_your_algo",
    "destructor": "name_of_the_functions_which_the_exchange_will_invoke_when_destroying_the_instance_of_your_algo",
    "permissions": ["notification", "balance", "execution_report", "new_order_limited", "cancel_order"]
  }
-----END ALGO DEFINITION-----
-----BEGIN ALGO-----
// define a class that implements the following interface [interface](https://github.com/blinktrade/algorithm-trading/blob/master/algorithm_interface.js)  here

function name_of_the_function_which_the_exchange_will_invoke_to_create_an_instance_of_your_algo() {
  return new MyAlgo();
}

function name_of_the_functions_which_the_exchange_will_invoke_when_destroying_the_instance_of_your_algo(instance_of_my_algo) {
  delete instance_of_my_algo;
}
-----END ALGO-----
```

### How does it work 
The exchange expects you to create a javascript class that implements the following [interface](https://github.com/blinktrade/algorithm-trading/blob/master/algorithm_interface.js) 

### Documentation ###
To see how to send or cancel orders or if you have any questions about the API, take a look at [Blinktrade docs](https://blinktrade.com/docs/). 

### List of exchanges running blinktrade platform 
- [chilebit](https://chilebit.net)
- [foxbit](https://foxbit.com.br)
- [VBTC](https://vbtc.vn)
- [surbitcoin](https://surbitcoin.com) 
- [urdubit](https://urdubit.com)
