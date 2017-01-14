$(document).ready( () => {

  let stockBidPrice, stockAskPrice, stockSymbol;

  $('.portfolio-funds').replaceWith('<strong class="portfolio-funds">Portfolio Funds: $</strong>' + window.user.local.portfolio.funds + '<br>');
    for (var key in window.user.local.portfolio.stocks){
      if (window.user.local.portfolio.stocks.hasOwnProperty(key)) {
         console.log("Key is " + key + ", value is " + window.user.local.portfolio.stocks[key]);
         $('.portfolio-stocks').html('<strong class="portfolio-stocks">Portfolio Stocks: </strong>' + key + " : " + window.user.local.portfolio.stocks[key] + '</br>');
      }
    }

  console.log(window.user);
  $('#search').on('click', (e) => {
     e.preventDefault();
     let query = $('#search-value').val().toUpperCase();
     $('.buy-btn').removeAttr('disabled');
     $('.sell-btn').removeAttr('disabled');
     getCurrentStockAPIData(query);

     $('.buy-btn').on('click', (e) => {
       e.preventDefault();
       console.log('Buy button pressed.');
       let units = $('#shares').val();
       buyStock(window.user.local.portfolio.funds, stockSymbol, stockBidPrice, units);
     });

     $('.sell-btn').on('click', (e) => {
       e.preventDefault();
       let units = $('#shares').val();
       sellStock(window.user.local.portfolio.funds, stockSymbol, stockAskPrice, units);
       console.log('Sell button pressed.');
     });
  });

  // ==================================
  // GRAB EXTERNAL API DATA
  // ==================================
  let getCurrentStockAPIData = (query) => {
      const robinhoodURL = 'https://api.robinhood.com/quotes/?symbols='
      let stockQuote = $.getJSON(robinhoodURL + query , (data) => {
        console.log(data.results[0]);
        $('.stock-data').text(query + ': ' + parseInt(data.results[0].bid_price).toFixed(2));
        stockBidPrice = data.results[0].bid_price;
        stockAskPrice = data.results[0].ask_price;
        stockSymbol = data.results[0].symbol;
      });
    };

  // =================================
  //  BUY STOCKS
  // =================================
  let buyStock = (funds, stockSymbol, bidPrice, units) => {
    if (bidPrice * units > funds) {
      $('.well.2').prepend('<span><h4 class="error text-centered"> NOT ENOUGH FUNDS!</h4></span>');
      $('.error').hide(6000);
    } else if (window.user.local.portfolio.stocks[stockSymbol]){
        window.user.local.portfolio.funds -= bidPrice * units;
        window.user.local.portfolio.stocks[stockSymbol] += parseInt(units);
        console.log(window.user);
        updateUser(window.user);
    } else {
        window.user.local.portfolio.funds -= bidPrice * units;
        window.user.local.portfolio.stocks[stockSymbol] = parseInt(units);
        console.log(window.user);
        updateUser(window.user);
    }
  };

  // =================================
  //  SELL STOCKS
  // =================================
  let sellStock = (funds, stockSymbol, askPrice, units) => {
    if (window.user.local.portfolio.stocks[stockSymbol] > 0 && window.user.local.portfolio.stocks[stockSymbol] > parseInt(units)) {
      window.user.local.portfolio.funds += askPrice * units;
      window.user.local.portfolio.stocks[stockSymbol] -= parseInt(units);
      console.log(window.user);
      updateUser(window.user);
    } else if (!window.user.local.portfolio.stocks[stockSymbol]) { // user doesn't hold stock in portfolio
      $('.well.2').prepend('<span><h4 class="error text-centered"> YOU DONT OWN THIS STOCK!</h4></span>');
      $('.error').hide(6000);
      console.log(window.user);
    } else if (window.user.local.portfolio.stocks[stockSymbol] < parseInt(units)) {
      $('.well.2').prepend('<span><h4 class="error text-centered"> YOU DONT HAVE ENOUGH SHARES</h4></span>');
      $('.error').hide(6000);
      console.log(window.user);
    }
  };

  // =================================
  //  UPDATE USER
  // =================================
  let updateUser = (user) => {
    $.ajax({
      url: '/user',
      type: 'PUT',
      data: JSON.stringify(user),
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        $('.portfolio-funds').html('<strong class="portfolio-funds">Portfolio Funds: $</strong>' + data.local.portfolio.funds + '<br>');
        $('.portfolio-stocks').replaceWith('<strong class="portfolio-stocks">Portfolio Stocks: </strong>');

        console.log(Object.keys(data.local.portfolio.stocks).length);
        for (var key in data.local.portfolio.stocks){
            if (data.local.portfolio.stocks.hasOwnProperty(key)) {
               console.log("Key is " + key + ", value is " + data.local.portfolio.stocks[key]);
               $('.portfolio-stocks').append(key + " : " + data.local.portfolio.stocks[key] + '</br>');
            }
        }
      },
      fail: function(xhr, status, error) {
        alert(error);
      }
    });
  };

});
