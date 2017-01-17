$(document).ready(() => {

//Handle all floating number issues.
function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

  //Create variables
  let stockBidPrice, stockAskPrice, stockSymbol;
  let units = parseInt($('#shares').val());
  let query = $('#search-value').val().toUpperCase();
  // console.log(window.user);
  updateUser(window.user);

  //Search for stock ticker on enter
  $('.form-control').keypress((e) => {
    if(e.which == 13) {
      e.preventDefault();
      query = $('#search-value').val().toUpperCase();
      $('.buy-btn').removeAttr('disabled');
      $('.sell-btn').removeAttr('disabled');
      getCurrentStockAPIData(query);
      query = "";
      $('#search-value').val("");
      $('#shares').val(0);
    }
  });

  //Search for stock ticker on click
  $('#search').on('click', (e) => {
     e.preventDefault();
     query = $('#search-value').val().toUpperCase();
     $('.buy-btn').removeAttr('disabled');
     $('.sell-btn').removeAttr('disabled');
     getCurrentStockAPIData(query);
     query = "";
     $('#search-value').val("");
     $('#shares').val(0);
   });

     //Attempt to buy shares
     $('.buy-btn').on('click', (e) => {
       e.preventDefault();
       units = parseInt($('#shares').val());
       buyStock(window.user.local.portfolio.funds, stockSymbol, stockBidPrice, units);
     });

     //Attempt to sell shares
     $('.sell-btn').on('click', (e) => {
       e.preventDefault();
       units = parseInt($('#shares').val());
       sellStock(window.user.local.portfolio.funds, stockSymbol, stockAskPrice, units);
     });

  // ==================================
  // GRAB EXTERNAL API DATA
  // ==================================
  function getCurrentStockAPIData(query) {
      const robinhoodURL = 'https://api.robinhood.com/quotes/?symbols='
      $.getJSON(robinhoodURL + query , (data) => {
        $('.stock-data').text(query + ': $' + round(data.results[0].bid_price, 2));
        stockBidPrice = data.results[0].bid_price;
        console.log(stockBidPrice);
        stockAskPrice = data.results[0].ask_price;
        stockSymbol = data.results[0].symbol;
      });
    };

  // =================================
  //  BUY STOCKS
  // =================================
  let buyStock = (funds, stockSymbol, bidPrice, units) => {
    console.log("buy stocks ", units);
    if (units == NaN || units == null || units == 0 ) {
        $('.well.2').prepend('<h5 class="error text-centered"> Enter a number greater than 0!</h5>');
        setTimeout(function() {
          $('.error').remove();
        }, 2000);
      } else if (bidPrice * units > funds) {
          $('.well.2').prepend('<h5 class="error text-centered"> Insufficient funds!</h5>');
          setTimeout(function() {
            $('.error').remove();
          }, 2000);
      } else if (window.user.local.portfolio.stocks[stockSymbol]) {
          window.user.local.portfolio.funds -= round(bidPrice * units, 2);
          window.user.local.portfolio.stocks[stockSymbol] += parseInt(units);
          $('.well.2').prepend('<span><h4 class="success text-centered"> Order filled.</h4></span>');
          setTimeout(function() {
            $('.success').remove();
          }, 2000);
          $('#shares').val(0);
          updateUser(window.user);
    } else {
          window.user.local.portfolio.funds -= round(bidPrice * units, 2);
          window.user.local.portfolio.stocks[stockSymbol] = parseInt(units);
          $('.well.2').prepend('<span><h4 class="success text-centered"> Order filled.</h4></span>');
          setTimeout(function() {
            $('.success').remove();
          }, 2000);
          $('#shares').val(0);
          updateUser(window.user);
    }
  };

  // =================================
  //  SELL STOCKS
  // =================================
  let sellStock = (funds, stockSymbol, askPrice, units) => {

    if (units == 0) {
      $('.well.2').prepend('<span><h5 class="error text-centered"> You cannot sell 0 shares!</h5></span>');
      console.log("don't own this stock, ", window.user);
      setTimeout(function() {
        $('.error').remove();
      }, 2000);

    } else if (units == window.user.local.portfolio.stocks[stockSymbol]){
        window.user.local.portfolio.funds += round(askPrice * units, 2);
        delete window.user.local.portfolio.stocks[stockSymbol];
        updateUser(window.user);
        console.log("del ", window.user.local);
        $('.well.2').prepend('<span><h5 class="success text-centered"> Order filled.</h5></span>');
        setTimeout(function() {
          $('.success').remove();
        }, 2000);

    } else if (window.user.local.portfolio.stocks[stockSymbol] > 0 && window.user.local.portfolio.stocks[stockSymbol] > parseInt(units)) {
        window.user.local.portfolio.funds += round(askPrice * units, 2);
        window.user.local.portfolio.stocks[stockSymbol] -= parseInt(units);
        $('#shares').val(0);
        $('.well.2').prepend('<span><h5 class="success text-centered"> Order filled.</h5></span>');
        setTimeout(function() {
          $('.success').remove();
        }, 2000);
        updateUser(window.user);

    // user doesn't hold stock in portfolio
    } else if (!window.user.local.portfolio.stocks[stockSymbol]) {
        $('.well.2').prepend('<span><h5 class="error text-centered"> You cannot sell shares of stock you do not own.</h5></span>');
        setTimeout(function() {
          $('.error').remove();
        }, 2000);
        // user doesn't have enough shares
    } else if (window.user.local.portfolio.stocks[stockSymbol] < parseInt(units)) {
      console.log("Not enough shares, ", window.user);
        $('.well.2').prepend('<span><h5 class="error text-centered"> Not enough shares.</h5></span>');
        setTimeout(function() {
          $('.error').remove();
        }, 2000);
    }
  };

  // =================================
  //  UPDATE USER STOCK HOLDINGS
  // =================================
  function updateUser(user) {
    $.ajax({
      url: '/user',
      type: 'PUT',
      data: JSON.stringify(user),
      dataType: 'json',
      contentType: 'application/json',
      success: (data) => {
        $('.portfolio-funds').html('<strong class="portfolio-funds">Purchasing Power: $</strong>' + round(data.local.portfolio.funds, 2) + '<br>');
        $('.portfolio-stocks').replaceWith('<strong class="portfolio-stocks">Portfolio Stocks: </strong><br>');

        for (let key in data.local.portfolio.stocks) {
            if (data.local.portfolio.stocks.hasOwnProperty(key) && key !== "") {
               $('.portfolio-stocks').append('<li class="list-group-item list-group-item-success">' + key + " : " + data.local.portfolio.stocks[key] + ' shares</li><br>');
            }
        }
        updatePortfolioWorth(data);
      },
      fail: (xhr, status, error) => {
        alert(error);
      }
    });
  };

  // =================================
  //  UPDATE USER STOCK HOLDINGS
  // =================================
  function updatePortfolioWorth(user) {
    var portfolioWorth = 0;
    let appreciation;
    for (let key in user.local.portfolio.stocks) {
      if (user.local.portfolio.stocks.hasOwnProperty(key) && key !== "") {
        const robinhoodURL = 'https://api.robinhood.com/quotes/?symbols='
        $.getJSON(robinhoodURL + key , (data) => {
        }).done((data) => {
            stockAskPrice = data.results[0].ask_price;
            portfolioWorth += (stockAskPrice * user.local.portfolio.stocks[key]);

            console.log("key " + key + ", stocks " + user.local.portfolio.stocks[key]);

            appreciation = round((portfolioWorth + user.local.portfolio.funds - 10000), 2);

            $('.portfolio-worth').html('<strong class="portfolio-worth">Portfolio Value: $</strong>' + round(portfolioWorth + user.local.portfolio.funds, 2) + ' (' + appreciation + ')' + '<br>');
          });
      }
    }
  };

});
