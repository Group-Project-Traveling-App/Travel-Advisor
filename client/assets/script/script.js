const baseUrl = "http://localhost:3000"

$('#btn-home').click(function () {
  hotelPage()
})

$('#btn-hotels').click(function() {
  hotelPage()
})

$('#btn-restaurants').click(function() {
  restaurantPage()
})

$('.btn-register').click(function() {
  registerPage()
})

$('.btn-login').click(function() {
  loginPage()
})

function checkLogin() {
  if (localStorage.getItem('access_token')) {
    mainPage()
  } else {
    registerPage()
  }
}

function hideAll() {
  $('.btn-register').hide()
  $('.btn-login').hide()
  $('.btn-logout').hide()
  $('#btn-hotels').hide()
  $('#btn-restaurants').hide()
  $('#home').hide()
  $('#register').hide()
  $('#login').hide()
  $('#hotels').hide()
  $('#restaurants').hide()
}

function registerPage() {
  hideAll()
  $('.btn-login').show()
  $('#home').show()
  $('#register').show()

  $('#form-register').on('submit', function (event) {
    event.preventDefault()
    data = {
      email: $('#email').val(),
      username: $('#username').val(),
      password: $('#password').val()
    }
    $.ajax({
        method: 'POST',
        url: `${baseUrl}/register`,
        data
      })
      .done(res => {
        console.log(res, 'res register');
        loginPage()
      })
      .fail((xhr, status) => {
        console.log(xhr, status);
      })
      .always(() => {
        $('#password').val('')
      })
  })
}

function loginPage() {
  hideAll()
  $('.btn-register').show()
  $('#home').show()
  $('#login').show()

  $('#form-login').on('submit', function (event) {
    event.preventDefault()
    data = {
      email: $('#email-login').val(),
      password: $('#password-login').val()
    }
    $.ajax({
        method: 'POST',
        url: `${baseUrl}/login`,
        data
      })
      .done(res => {
        console.log(res, 'login');
        localStorage.setItem('access_token', res.access_token)
        checkLogin()
      })
      .fail(err => {
        console.log(err, 'err login');
      })
      .always(() => {
        $('#password-login').val('')
      })
  })
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
      method: 'POST',
      url: `${baseUrl}/google-login`,
      data: {
        id_token
      }
    })
    .done(res => {
      console.log(res);
      localStorage.setItem('access_token', res.access_token)
      checkLogin()
    })
    .fail(err => {
      console.log(err);
    })
}

function logout() {
  localStorage.clear()
  const auth2 = gapi.auth2.getAuthInstance()
  auth2.signOut().then(function () {
    console.log('User signed out.')
  });
  registerPage()
}

function hotelPage() {
  hideAll()
  $('#btn-hotels').show()
  $('#btn-restaurants').show()
  $('.btn-logout').show()
  $('#hotels').show()

  $('#form-hotel').on('submit', function (e) {
    e.preventDefault()
    let city = $('#search-hotel').val()
    $.ajax({
      method: 'POST',
      url: `${baseUrl}/hotels`,
      data: city,
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
    .done(res => {
      // HTML
    })
    .fail(err => {
      console.log(err);
    })
  })
}

function restaurantPage() {
  hideAll()
  $('#btn-hotels').show()
  $('#btn-restaurants').show()
  $('.btn-logout').show()
  $('#restaurants').show()

  $('#form-restaurant').on('submit', function (e) {
    e.preventDefault()
    let city = $('#search-restaurant').val()
    $.ajax({
      method: 'POST',
      url: `${baseUrl}/hotels`,
      data: city,
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
    .done(res => {
      // HTML
    })
    .fail(err => {
      console.log(err);
    })
  })
}

$(document).ready(function () {
  checkLogin()
})
