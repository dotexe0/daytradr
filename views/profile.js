$(document).ready( () => {
  let user = window.user.local.portfolio;
  // console.log("user ", user);
  // console.log("portfolio ", user);
  // console.log("funds ", user.funds);
  // console.log("stocks ", user.stocks);
  let stockBidPrice, stockAskPrice, stockSymbol;

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
       buyStock(user.funds, stockSymbol, stockBidPrice, units);
     });

     $('.sell-btn').on('click', (e) => {
       e.preventDefault();
       console.log('Sell button pressed.');
     });

  });




//   //update user in db
//     var ajax = $.ajax('/signup', {
//         type: 'PUT',
//         data: JSON.stringify(user),
//         dataType: 'json',
//         contentType: 'application/json'
//     }).done(function(data) {
//       console.log("User sent.");
//     }).fail(function(xhr, status, error) {
          // alert(error);
//     });
//   });


  // =================================
  //  EDIT USER
  // =================================

  // ==================================
  // GRAB EXTERNAL API DATA
  // ==================================
  function getCurrentStockAPIData(query) {
      const robinhoodURL = 'https://api.robinhood.com/quotes/?symbols='
      let stockQuote = $.getJSON(robinhoodURL + query , (data) => {
        console.log(data.results[0]);
        $('.stock-data').text(query + ': ' + parseInt(data.results[0].bid_price).toFixed(2));
        stockBidPrice = data.results[0].bid_price;
        stockAskPrice = data.results[0].ask_price;
        stockSymbol = data.results[0].symbol;
      });
    };

  let buyStock = (funds, stockSymbol, bidPrice, units) => {
    console.log("funds", funds);
    console.log("stockSymbol", stockSymbol);
    console.log("bidPrice", bidPrice);
    console.log("units", units); //string
    console.log('stocks', user.stocks);
    console.log(user);

    if (bidPrice * units > funds) {
      $('.well.2').prepend('<span><h4 class="error text-centered"> NOT ENOUGH FUNDS!</h4></span>');
      $('.error').toggle('slow');
    } else if (user.stocks[stockSymbol]){
        user.funds -= bidPrice * units;
        user.stocks[stockSymbol] += parseInt(units);
        console.log(user);
    } else {
        user.funds -= bidPrice * units;
        user.stocks[stockSymbol] = parseInt(units);
        console.log(user);
    }

  };

  function sellStock(funds, askPrice, units) {
    funds += askPrice * units;
  };

});
