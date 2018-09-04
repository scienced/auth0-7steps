<template>
  <div class="dashboard">
    <nav class="navbar navbar-dark bg-dark">
      <a class="navbar-brand" href="#">
        <img src="https://a.storyblok.com/f/39898/1024x1024/dea4e1b62d/vue-js_logo-svg.png" width="40" height="40">
      </a>
      <div>
        <img :src="$auth.user.picture" width="30" height="30">
        <span class="text-muted font-weight-light px-2">{{$auth.user.name}}</span>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="$auth.logout()">Logout</button>
      </div>
    </nav>
  
    <div class="jumbotron">
      <div class="container">
        <h1 class="display-4">Hello, {{$auth.user.name}}!</h1>
        
        <hr class="my-4">
        
        nick name: {{$auth.user.nickname}}<br>
        Access Token expires at: {{new Date($auth.expiresAt*1)}} -- {{$auth.expiresAt/1000}} <br>
        is autheticated: {{$auth.isAuthenticated()}}<br>

        <hr>

        Id token issue time: {{new Date($auth.user.iat*1000)}} -  {{$auth.user.iat}}<br>
        Id token expiriation time: {{new Date($auth.user.exp*1000)}} -  {{$auth.user.exp }}<br>

        <hr>

        Postgres role: {{getPostgresRol}}<br>
        
        refresh tokens <button type="button" @click="$auth.renewToken()"> refresh</button> (werkt alleen als Ghostery uit staat)<br>
        <hr>

        <strong>todo:</strong>
        <br>
        Extra rollen:<br>
        axios interseptor: <br>
        refresh timer: <button type="button" @click="$auth.scheduleRenewal()"> refresh</button> {{$auth.timeLeft()}}<br>

        
        

      </div>
    </div>

    <div class="container">
      <div class="card-columns">

        <a class="card" :href="getStoryLink(story)" target="_blank" v-for="story in stories">
          <img class="card-img-top" :src="story.content.image" :alt="story.content.image_alt">
          <div class="card-body">
            <h5 class="card-title">{{story.content.title}}</h5>
            <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          </div>
        </a>
        
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      stories: [],
      authetie: {},
      
    }
  },
  computed: {
    getPostgresRol() {
      var dom = 'https\u003A\u002F\u002Fforexly.io\u002Froles'
      return this.$auth.user[dom]
    },
    
  },
  mounted() {
    axios.get('https://api.storyblok.com/v1/cdn/stories?starts_with=tp&excluding_fields=body&excluding_ids=48471,48547,60491&token=dtONJHwmxhdJOwKxyjlqAgtt').then((res) => {
      this.stories = res.data.stories
    })
    this.authetie = this.$auth
  },
  methods: {
    getStoryLink(story) {
      return `https://www.storyblok.com/${story.full_slug}`
    },
  }
}
</script>

<style scoped>
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css');

.btn-primary {
  background: #468f65;
  border: 1px solid #468f65;
}
.card {
  text-decoration: none;
  color: #000;
}
</style>
