const baseUrl = "http://localhost:3000"

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

$('.btn-logout').click(function() {
  logout()
})

function checkLogin() {
  if (localStorage.getItem('access_token')) {
    hotelPage()
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
      name: $('#username').val(),
      password: $('#password').val()
    }
    console.log('data');
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
        Swal.fire({
          title: 'Something Error!',
          text: xhr.responseJSON.message[0],
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      })
      .always(() => {
        $('#form-resgister').trigger('reset')
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
      .fail((xhr) => {
        console.log(xhr);
        Swal.fire({
          title: 'Something Error!',
          text: xhr.responseJSON.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      })
      .always(() => {
        $('#form-login').trigger('reset')
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
    .fail((xhr, status)=> {
      console.log(xhr, status);
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
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
      Swal.fire({
        title: 'Something Error!',
        text: xhr.responseJSON.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
    .always(() => {
      $('#search-hotel').val('')
    })
  })
}

function restaurantPage() {
  hideAll()
  $('#btn-hotels').show()
  $('#btn-restaurants').show()
  $('.btn-logout').show()
  getRestorant('jakarta')
  $('#restaurants').show()


  $('#form-restaurant').on('submit', function (e) {
    e.preventDefault()
    let city = $('#search-restaurant').val()
    getRestorant(city)
    // $.ajax({
    //   method: 'POST',
    //   url: `${baseUrl}/restaurants`,
    //   data: {
    //     city
    //   },
    //   headers: {
    //     access_token: localStorage.getItem('access_token')
    //   }
    // })
    // .done(res => {
    //   // console.log(res);
    //   // weather
    //   const city = res.weather.name
    //   const desc = res.weather.weather[0].description
    //   const icon = res.weather.weather[0].icon
    //   const imgIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    //   $('#restaurant-weather').empty()
    //   $('#restaurant-weather').append(
    //     `
    //       <img src="${imgIcon}" clstyle="width: 2rem;height: 2rem; "alt="">
    //       <div>
    //         <span>${city}</span>
    //         <small>${desc}</small>
    //       </div>
    //     `
    //   )

    //   //restaurant
    //   $('#restaurants-body').empty()
    //   res.restaurant.forEach( el => {
    //     $('#restaurants-body').append(
    //       `
    //       <div class="card mb-5 shadow" style="width: 18rem;">
    //       <img src="${el.restaurant.featured_image}" class="card-img-top" style="height: 12rem;object-fit: cover;" alt="...">
    //       <div class="card-body">
    //         <a href="${el.restaurant.url}" style="text-decoration: none;">
    //           <h5 class="card-title">${el.restaurant.name}</h5>
    //         </a>
    //         <small class="mb-1 text-muted">${el.restaurant.location.locality}, ${el.restaurant.location.city}</small>
    //         <p>Rating: ${el.restaurant.user_rating.aggregate_rating} <small>(${el.restaurant.user_rating.votes})</small></p>            
    //       </div>
    //       </div>
    //       `
    //     )
    //   })
    // })
    // .fail((xhr, status)=> {
    //   console.log(xhr, status);
    //   Swal.fire({
    //     title: 'Something Error!',
    //     text: xhr.responseJSON.message,
    //     icon: 'error',
    //     confirmButtonText: 'Ok'
    //   })
    // })
    // .always(() => {
    //   $('#search-restaurant').val('')
    // })
  })
}

function getRestorant(city){
  $.ajax({
    method: 'POST',
    url: `${baseUrl}/restaurants`,
    data: {
      city
    },
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(res => {
    // console.log(res);
    // weather
    const city = res.weather.city
    const desc = res.weather.description
    const icon = res.weather.icon
    const imgIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    $('#restaurant-weather').empty()
    $('#restaurant-weather').append(
      `
        <img src="${imgIcon}" clstyle="width: 2rem;height: 2rem; "alt="">
        <div>
          <span>${city}</span>
          <small>${desc}</small>
        </div>
      `
    )

    //restaurant
    $('#restaurants-body').empty()
    res.restaurant.forEach( el => {
      $('#restaurants-body').append(
        `
        <div class="card mb-5 shadow" style="width: 18rem;">
        <img src="${el.imgUrl}" class="card-img-top" style="height: 12rem;object-fit: cover;" alt="...">
        <div class="card-body">
          <a href="${el.url}" style="text-decoration: none;">
            <h5 class="card-title">${el.name}</h5>
          </a>
          <small class="mb-1 text-muted">${el.locality}, ${el.city}</small>
          <p>Rating: ${el.rating} <small>(${el.votes})</small></p>            
        </div>
        </div>
        `
      )
    })
  })
  .fail((xhr, status)=> {
    console.log(xhr, status);
    Swal.fire({
      title: 'Something Error!',
      text: xhr.responseJSON.message,
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  })
  .always(() => {
    $('#search-restaurant').val('')
  })
}

$(document).ready(function () {
  checkLogin()
})
