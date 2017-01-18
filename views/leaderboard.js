$(document).ready(() => {
  console.log("users ", window.users);
  let users = window.users;
  for (let i = 0; i < users.length; i++) {
    $('.rank').append('<li>' + '<h6 class="username">' + users[i].local.email + ': <h6 class="number">$' + parseInt(users[i].local.portfolio.worth + users[i].local.portfolio.funds).toFixed(2) + '</h6></li>');
  }

  var options = {
    valueNames: ['number', 'username']
};
var myList = new List('my-list', options);
console.log(myList);
});
