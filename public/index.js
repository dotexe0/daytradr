$(document).ready(function (e) {
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
  $('.signup-form').submit(function(e) {
    e.preventDefault();
    var usernameVal = $('#username').val();
    var passwordVal = $('#password').val();
    var user = {
      username: usernameVal,
      password: passwordVal
    };
    console.log("created ", user);
    console.log(JSON.stringify(user));

    var ajax = $.ajax('/users', {
        type: 'POST',
        data: JSON.stringify(user),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(data) {
      console.log("Sign me up.");
      console.log(data);
      window.location.href="/dashboard";
    }).fail(function(xhr, status, error) {
      $('.signup-login-text').append('<h6 class="error-handling"> Username already taken</h6>')
      $('.error-handling').hide('5000', function() {});
    })
  });

  //login using existing account
  $('.login-form').submit(function(e) {
    e.preventDefault();
    console.log("DID login WORK");
    var usernameVal = $('#usernameLogin').val();
    var passwordVal = $('#passwordLogin').val();
    var user = {
      username: usernameVal,
      password: passwordVal
    };
    var ajax = $.ajax('/login', {
        type: 'POST',
        data: JSON.stringify(user),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function(data) {
      console.log("Log me in.");
      window.location.href="/dashboard";
    });
  });
});
