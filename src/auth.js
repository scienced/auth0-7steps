import auth0 from 'auth0-js'
import Vue from 'vue'

// exchange the object with your own from the setup step above.
let webAuth = new auth0.WebAuth({
  domain: 'forexly.eu.auth0.com',
    clientID: 'KLL2566XUwsqnwkN8o8CsNIDG0Fg8pWb',
  // make sure port is 8080
  redirectUri: 'http://localhost:8080/callback', 
  // we will use the api/v2/ to access the user information as payload
   audience: 'https://forexly.eu.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile offline_access'
})

let tokenRenewalTimeout = ''

let auth = new Vue({
  computed: {
    token: {
      get: function() {
        return localStorage.getItem('id_token')
      },
      set: function(id_token) {
        localStorage.setItem('id_token', id_token)
      }
    },
    accessToken: {
      get: function() {
        return localStorage.getItem('access_token')
      },
      set: function(accessToken) {
        localStorage.setItem('access_token', accessToken)
      }
    },
    expiresAt: {
      get: function() {
        return localStorage.getItem('expires_at')
      },
      set: function(expiresIn) {
        let expiresAt = JSON.stringify(expiresIn * 1000 + new Date().getTime())
        localStorage.setItem('expires_at', expiresAt)
      }
    },
    user: {
      get: function() {
        return JSON.parse(localStorage.getItem('user'))
      },
      set: function(user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
    },
    timeout: function() { return tokenRenewalTimeout},
    delay: function() { return delay}
  },
  methods: {
    login() {
      webAuth.authorize()
    },
    logout() {
      return new Promise((resolve, reject) => { 
        localStorage.removeItem('access_token')
        localStorage.removeItem('id_token')
        localStorage.removeItem('expires_at')
        localStorage.removeItem('user')
        webAuth.authorize()
      })
    },
    isAuthenticated() {
      return new Date().getTime() < this.expiresAt
    },
    handleAuthentication() {
      return new Promise((resolve, reject) => {  
        webAuth.parseHash((err, authResult) => {

          if (authResult && authResult.accessToken && authResult.idToken) {
            this.expiresAt = authResult.expiresIn
            this.accessToken = authResult.accessToken
            this.token = authResult.idToken
            this.user = authResult.idTokenPayload
            resolve()

          } else if (err) {
            this.logout()
            reject(err)
          }

        })
      })
    },

    renewToken() {
        webAuth.checkSession({}, (err, result) => {
            if (err) {
              console.log(err)
              console.log('checkSession gaat mis...')
            } else {
              
              if (result && result.accessToken && result.idToken) {
            this.expiresAt = result.expiresIn
            this.accessToken = result.accessToken
            this.token = result.idToken
            this.user = result.idTokenPayload
           

          } else {this.logout()}

            }
          }
        );
      },

      scheduleRenewal() {
        var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        var delay = expiresAt - Date.now() -4680000; //1,3 uur

        //calc 
        var hoelang = ((delay/1000)/60)/60
        console.log(hoelang+ ' uur')


        if (delay > 0) {
          tokenRenewalTimeout = setTimeout(function() {
            
            renewToken();
          }, delay)

        }
      },

      timeLeft() {
        var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        var delay = expiresAt - Date.now();
        var hoelang = ((delay/1000)/60)/60
        return (hoelang + ' uur')
      }



  }
})

export default {
  install: function(Vue) {
    Vue.prototype.$auth = auth
  }
}
