$(document).ready(function () {
  //change style from login to signup form
  $('.btn-signup').click(function() {
    $('.signup-container').removeClass('hidden');
    $('.login-container').addClass('hidden');
  });

  //change style from signup to login form
  $('.btn-login').click(function() {
    $('.login-container').removeClass('hidden');
    $('.signup-container').addClass('hidden');
  });

  $('.existing-account-text').click(function() {
    $('.login-container').removeClass('hidden');
    $('.signup-container').addClass('hidden');
  });

  //sign up a new user
  $('.signup-form').submit(function() {
    console.log("DID THIS WORK");
    var usernameVal = $('#email').val();
    var passwordVal = $('#password').val();
    var user = {
      username: usernameVal,
      password: passwordVal
    };
    var ajax = $.ajax('/users', {
        type: 'POST',
        data: JSON.stringify(user),
        dataType: 'json',
        contentType: 'application/json'
    });
    console.log("LOG ME IN PLEASE");
    ajax.done();
  });
});
