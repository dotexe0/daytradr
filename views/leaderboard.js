$(document).ready(() => {

  //Handle all floating number issues.
  function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }

  let users = window.users;


  for (let i = 0; i < users.length; i++) {
    users[i].local.portfolio.worth = round((users[i].local.portfolio.worth + users[i].local.portfolio.funds), 2).toFixed(2);
  }


  EXTRACT USER WORTH AND MAKE AN ARRAY OF OBJECTS WITH KEY "USER" VALUE "WORTH", THEN SORT.
//   var sort_by = function(field, reverse, primer){
//
//      var key = primer ?
//          function(x) {return primer(x[field])} :
//          function(x) {return x[field]};
//
//      reverse = !reverse ? 1 : -1;
//
//      return function (a, b) {
//          return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
//        }
//   }
//
//   users.sort(sort_by('local.portfolio.worth', true, parseInt));
// console.log(users);



  // var worth;
  for (let i = 0; i < users.length; i++) {
    // worth = users[i].local.portfolio.worth;
    $('.rank').append('<li>' + '<h6 class="username">' + users[i].local.email + ': <h6 class="number">$' + users[i].local.portfolio.worth + '</h6></li>');
    // worth = 0;
  }

  var options = {
    valueNames: ['number']
};
var myList = new List('my-list', options);
console.log(myList);
});
