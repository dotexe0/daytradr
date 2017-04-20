$(document).ready(() => {

//Handle all floating number issues.
function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

  //Create variables
  let stockBidPrice, stockAskPrice, stockSymbol;
  let units = parseInt($('#shares').val());
  let query = $('#search-value').val().toUpperCase();
  updateUser(window.user);
  updatePortfolioWorth(window.user);

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
        $('.stock-data').text(query + ': $' + round(data.results[0].bid_price, 2).toFixed(2));
        stockBidPrice = data.results[0].bid_price;
        stockAskPrice = data.results[0].ask_price;
        stockSymbol = data.results[0].symbol;
      })
      .error(() => {
        $('.portfolio-data').prepend('<div class="alert alert-danger">' + '<strong>Error!</strong> That stock ticker does not exist!' + '</div>');
        setTimeout( () => {
          $('.alert').remove();
        }, 2000)
      });
    };

  // =================================
  //  BUY STOCKS
  // =================================
  let buyStock = (funds, stockSymbol, bidPrice, units) => {
    // error handling with no input or 0 value.
    if (units == NaN || units == null || units == 0 ) {
        $('.well.2').prepend('<div class="alert alert-danger"> Enter a number greater than 0!</div>');
        setTimeout(function() {
          $('.alert').remove();
        }, 2000);
        // error handling when user does not have enough funds.
      } else if (bidPrice * units > funds) {
          $('.well.2').prepend('<div class="alert alert-danger"> Insufficient funds!</div>');
          setTimeout(function() {
            $('.alert').remove();
          }, 2000);
       // Successful buy order on stock that user already owns.
      } else if (window.user.local.portfolio.stocks[stockSymbol]) {
          window.user.local.portfolio.funds -= round(bidPrice * units, 2);
          window.user.local.portfolio.stocks[stockSymbol] += parseInt(units);
          $('.well.2').prepend('<div class="alert alert-success"> Order filled.</div>');
          setTimeout(function() {
            $('.alert').remove();
          }, 2000);
          $('#shares').val(0);
          updatePortfolioWorth(window.user);
          // Successful buy order on stock that user does not own.
    } else {
          window.user.local.portfolio.funds -= round(bidPrice * units, 2);
          window.user.local.portfolio.stocks[stockSymbol] = parseInt(units);
          $('.well.2').prepend('<div class="alert alert-success"> Order filled.</div>');
          setTimeout(function() {
            $('.alert').remove();
          }, 2000);
          $('#shares').val(0);
          updatePortfolioWorth(window.user);
    }
  };

  // =================================
  //  SELL STOCKS
  // =================================
  let sellStock = (funds, stockSymbol, askPrice, units) => {
    // error handling when trying to sell 0 shares.
    if (units == 0) {
      $('.well.2').prepend('<div class="alert alert-danger"> You cannot sell 0 shares!</div>');
      console.log("don't own this stock, ", window.user);
      setTimeout(function() {
        $('.alert').remove();
      }, 2000);
    // Successful order placed when user wants to sell entire holdings of stock.
    } else if (units == window.user.local.portfolio.stocks[stockSymbol]){
        window.user.local.portfolio.funds += round(askPrice * units, 2);
        delete window.user.local.portfolio.stocks[stockSymbol];
        updatePortfolioWorth(window.user);
        // updateUser(window.user);
        console.log("del ", window.user.local);
        $('.well.2').prepend('<div class="alert alert-success"> Order filled.</div>');
        setTimeout(function() {
          $('.alert').remove();
        }, 2000);
    // Successful order to sell stock.
    } else if (window.user.local.portfolio.stocks[stockSymbol] > 0 && window.user.local.portfolio.stocks[stockSymbol] > parseInt(units)) {
        window.user.local.portfolio.funds += round(askPrice * units, 2);
        window.user.local.portfolio.stocks[stockSymbol] -= parseInt(units);
        $('#shares').val(0);
        $('.well.2').prepend('<div class="alert alert-success"> Order filled.</div>');
        setTimeout(function() {
          $('.alert').remove();
        }, 2000);
        updatePortfolioWorth(window.user);
        // updateUser(window.user);

    // error handling when user doesn't hold stock in portfolio.
    } else if (!window.user.local.portfolio.stocks[stockSymbol]) {
        $('.well.2').prepend('<div class="alert alert-danger"> You cannot sell shares of stock you do not own.</div>');
        setTimeout(function() {
          $('.alert').remove();
        }, 2000);
        // error handling when user doesn't have enough shares.
    } else if (window.user.local.portfolio.stocks[stockSymbol] < parseInt(units)) {
      console.log("Not enough shares, ", window.user);
        $('.well.2').prepend('<div class="alert alert-danger"> Not enough shares.</div>');
        setTimeout(function() {
          $('.alert').remove();
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
        $('.portfolio-funds').html('<strong class="portfolio-funds">Purchasing Power: $</strong>' + round(data.local.portfolio.funds, 2).toFixed(2) + '<br>');
        $('.portfolio-stocks').replaceWith('<strong class="portfolio-stocks">Portfolio Stocks: </strong>');

        for (let key in data.local.portfolio.stocks) {
            if (data.local.portfolio.stocks.hasOwnProperty(key) && key !== "") {
               $('.portfolio-stocks').append('<li class="list-group-item list-group-item-success">' + key + " : " + data.local.portfolio.stocks[key] + ' shares</li>');
            }
        }
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
    let appreciation;
    for (let key in user.local.portfolio.stocks) {
      if (user.local.portfolio.stocks.hasOwnProperty(key) && key !== "") {
        const robinhoodURL = 'https://api.robinhood.com/quotes/?symbols='
        $.getJSON(robinhoodURL + key , (data) => {
        })
        .done((data) => {
            stockAskPrice = data.results[0].bid_price;
            user.local.portfolio.worth += (stockAskPrice * user.local.portfolio.stocks[key]);
            appreciation = round((user.local.portfolio.worth + user.local.portfolio.funds - 10000.00), 2).toFixed(2);
            $('.portfolio-worth').html('<strong class="portfolio-worth">Portfolio Value: $</strong>' + round(user.local.portfolio.worth + user.local.portfolio.funds, 2).toFixed(2) + ' (' + round(appreciation, 2).toFixed(2) + ')' + '<br>');
            updateUser(user);
        })
        .error(() => {
          $('.well.2').prepend('<h5 class="alert alert-danger"> Ticker does not exist.</h5>');
          setTimeout(function() {
            $('.alert').remove();
          }, 2000);
        });
        // If user has no stocks, set worth to funds.
      } else if (Object.keys(user.local.portfolio.stocks).length == 1){
        user.local.portfolio.worth = user.local.portfolio.funds;
        appreciation = round((user.local.portfolio.worth - 10000.00), 2).toFixed(2);
        $('.portfolio-worth').html('<strong class="portfolio-worth">Portfolio Value: $</strong>' + round(user.local.portfolio.worth, 2).toFixed(2) + ' (' + round(appreciation, 2).toFixed(2) + ')' + '<br>');
      }
    }
    // Reset users worth back to zero to recalculate with updated bid prices.
    user.local.portfolio.worth = 0;

  };

});
