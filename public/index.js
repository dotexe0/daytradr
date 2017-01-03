$(document).ready(function () {
  //change style from login to signup form
  $('.btn-signup').click(function() {
    $('.signup-login-text').replaceWith('<h1 class="signup-login-text">Signup</h1>');
    $('.btn.submit').text('Sign up');
    $('.signup-login-container').removeClass('hidden');
    $('.existing-account-text').show();
  });

  //change style from signup to login form
  $('.btn-login').click(function() {
    $('.signup-login-text').replaceWith('<h1 class="signup-login-text">Login</h1>');
    $('.btn.submit').text('Login');
    $('.signup-login-container').removeClass('hidden');
    $('.existing-account-text').hide();
  });

  $('.existing-account-text').click(function() {
    $('.signup-login-text').replaceWith('<h1 class="signup-login-text">Login</h1>');
    $('.btn.submit').text('Login');
    $('.signup-login-container').removeClass('hidden');
    $('.existing-account-text').hide();
  });

  $('.signup-login-form').submit(function() {
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
