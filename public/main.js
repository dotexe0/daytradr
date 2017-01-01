$(document).ready(function () {
  $('.btn-signup').click(function() {
    $('.signup-login-text').replaceWith('<h1 class="signup-login-text">Signup</h1>');
    $('.btn.submit').text('Sign up');
    $('.signup-login-container').removeClass('hidden');
  });

  $('.btn-login').click(function() {
    $('.signup-login-text').replaceWith('<h1 class="signup-login-text">Login</h1>');
    $('.btn.submit').text('Login');
    $('.signup-login-container').removeClass('hidden');
  });
});
