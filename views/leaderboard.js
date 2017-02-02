$(document).ready(() => {

  //Handle all floating number issues.
  function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }

  let users = window.users;
  // update user worth based on current market value
  for (let i = 0; i < users.length; i++) {
    for (let key in users[i].local.portfolio.stocks) {
      if (users[i].local.portfolio.stocks.hasOwnProperty(key) && key !== "") {
        const robinhoodURL = 'https://api.robinhood.com/quotes/?symbols='
        $.getJSON(robinhoodURL + key , (data) => {
        })
        .done((data) => {
            stockAskPrice = data.results[0].bid_price;
            users[i].local.portfolio.worth += (stockAskPrice * users[i].local.portfolio.stocks[key]);
        });
      }
    }
  }

  //set user object's worth = to true worth including funds.
  for (let i = 0; i < users.length; i++) {
    users[i].local.portfolio.worth = round((users[i].local.portfolio.worth + users[i].local.portfolio.funds), 2).toFixed(2);
  }

  let ranking = new Array();
  for (let i = 0; i < users.length; i++) {
    ranking.push({'username' : users[i].local.email, 'worth' : users[i].local.portfolio.worth});
  }
  // EXTRACT USER WORTH AND MAKE AN ARRAY OF OBJECTS WITH KEY "USER" VALUE "WORTH", THEN SORT.
  var sort_by = function(field, reverse, primer){

     var key = primer ?
         function(x) {return primer(x[field])} :
         function(x) {return x[field]};

     reverse = !reverse ? 1 : -1;

     return function (a, b) {
         return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
       }
  }

  ranking.sort(sort_by('worth', true, parseInt));


  for (let i = 0; i < ranking.length; i++) {
    $('.rank').append('<li class="list-group-item list-group-item-action list-group-item-success">' + '<h6 class="username">' + ranking[i].username + ': <h6 class="number">$' + ranking[i].worth + '</h6></li>');
  }

});
