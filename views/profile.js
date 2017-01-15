$(document).ready(() => {

  //Create variables
  let stockBidPrice, stockAskPrice, stockSymbol;
  let units = parseInt($('#shares').val());
  let query = $('#search-value').val().toUpperCase();
  updateUser(window.user);

  //Search for stock ticker
  $('#search').on('click', (e) => {
     e.preventDefault();
     query = $('#search-value').val().toUpperCase();
     $('.buy-btn').removeAttr('disabled');
     $('.sell-btn').removeAttr('disabled');
     getCurrentStockAPIData(query);
     query = "";
     $('#search-value').val("");
     $('#shares').val(0);

     //Attempt to buy shares
     $('.buy-btn').on('click', (e) => {
       e.preventDefault();
       units = parseInt($('#shares').val());
       console.log("units ", units);
       buyStock(window.user.local.portfolio.funds, stockSymbol, stockBidPrice, units);
     });

     //Attempt to sell shares
     $('.sell-btn').on('click', (e) => {
       e.preventDefault();
       units = parseInt($('#shares').val());
       sellStock(window.user.local.portfolio.funds, stockSymbol, stockAskPrice, units);
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
  function buyStock(funds, stockSymbol, bidPrice, units) {
    console.log("buy stocks ", units);
    if (units == NaN || units == null || units == 0 ) {
        $('.well.2').prepend('<h4 class="error text-centered"> Number of shares cannot be 0!</h4>');
        setTimeout(function() {
          $('.error').remove();
        }, 2000);
      } else if (bidPrice * units > funds) {
          $('.well.2').prepend('<h4 class="error text-centered"> Number of shares cannot be 0!</h4>');
          setTimeout(function() {
            $('.error').remove();
          }, 2000);
      } else if (window.user.local.portfolio.stocks[stockSymbol]) {
          window.user.local.portfolio.funds -= bidPrice * units;
          window.user.local.portfolio.stocks[stockSymbol] += parseInt(units);
          console.log("bought more stocks, ", window.user);
          $('#shares').val(0);
          updateUser(window.user);
    } else {
          window.user.local.portfolio.funds -= bidPrice * units;
          window.user.local.portfolio.stocks[stockSymbol] = parseInt(units);
          console.log("bought new stock, ", window.user);
          $('#shares').val(0);
          updateUser(window.user);
    }
  };

  // =================================
  //  SELL STOCKS
  // =================================
  function sellStock(funds, stockSymbol, askPrice, units) {
    if (window.user.local.portfolio.stocks[stockSymbol] > 0 && window.user.local.portfolio.stocks[stockSymbol] > parseInt(units)) {
        window.user.local.portfolio.funds += askPrice * units;
        window.user.local.portfolio.stocks[stockSymbol] -= parseInt(units);
        console.log("stock sold ", window.user);
        $('#shares').val(0);
        updateUser(window.user);
    } else if (!window.user.local.portfolio.stocks[stockSymbol]) { // user doesn't hold stock in portfolio
        $('.well.2').prepend('<span><h4 class="error text-centered"> YOU DONT OWN THIS STOCK!</h4></span>');
        setTimeout(function() {
          $('.error').remove();
        }, 2000);
    } else if (window.user.local.portfolio.stocks[stockSymbol] < parseInt(units)) {
        $('.well.2').prepend('<span><h4 class="error text-centered"> YOU DONT HAVE ENOUGH SHARES</h4></span>');
        setTimeout(function() {
          $('.error').remove();
        }, 2000);
    }
  };

  // =================================
  //  UPDATE USER
  // =================================
  function updateUser(user) {
    $.ajax({
      url: '/user',
      type: 'PUT',
      data: JSON.stringify(user),
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        $('.portfolio-funds').html('<strong class="portfolio-funds">Portfolio Purchasing Power: $</strong>' + parseInt(data.local.portfolio.funds).toFixed(2) + '<br>');
        $('.portfolio-stocks').empty();
        $('.portfolio-stocks').replaceWith('<strong class="portfolio-stocks">Portfolio Stocks: </strong>');

        // console.log(Object.keys(data.local.portfolio.stocks).length);
        for (var key in data.local.portfolio.stocks) {
            if (data.local.portfolio.stocks.hasOwnProperty(key)) {
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
