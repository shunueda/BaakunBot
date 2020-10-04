<template>
  <section class="wrapper">
    <br><br><br><br>
    <section class="container">
      <h1 class="title">
        Welcome, {{ user.displayName }}! (@{{ user.username }})
      </h1>
    </section>
    <div>
      <br><br>
      <img v-bind:src="
        (user.photos !== undefined) ? user.photos[0].value.replace(`normal`, `400x400`) : `` " alt="Missing Image"
           width="150px" height="auto"
           style="border-radius: 150px;"
           class="koton"
      />
      <br><br>
    </div>
    <a href="http://localhost:3000/server/logout"><h5 class="subtitle">Click here to logout</h5></a>
    <br><br>


    <label>
      <textarea
        class="textarea"
        id="txa"
        @input="mixin_autoResize_resize"
        style="font-family: sans-serif "
      ></textarea>
    </label>

    <div class="links">
      <p class="button--grey" @click="updateMessage()">Update Message</p>
      <br><br><br>
      <p class="button--grey" @click="toggle()" id="toggle"></p>
    </div>

  </section>
</template>

<script>
import axios from "axios";
import mixinAutoResize from "../components/autoResize.js";

export default {
  name: "ResizeByMixin",
  mixins: [mixinAutoResize],
  computed: {
  },
  data() {
    return {
      user: {},
      isRunning: {},
      error: null
    };
  },
  mounted() {
    axios.get("http://localhost:3000/server/auth/twitter/callback", { params: this.$route.query }).then(res => { this.user = res.data.user })
    axios
      .get("http://localhost:3000/server/getTextboxMessage")
      .then(res => { document.getElementById('txa').value = (res.data === undefined || res.data === "") ? "Format: text1, text2, text3, ..." : res.data })
    axios
      .get("http://localhost:3000/server/isRunning")
      .then(res => {
        this.isRunning = res.data
        document.getElementById("toggle").innerHTML = (res.data === true) ? "Auto Tweet is Running!" : "Auto Tweet is NOT Running..."
      })
  },
  methods: {
    toggle() {
      axios.get("http://localhost:3000/server/toggle").then(res => {
        this.isRunning = res.data
        document.getElementById("toggle").innerHTML = (this.isRunning === true) ? "Auto Tweet is Running!" : "Auto Tweet is NOT Running..."
      })
    },
    updateMessage() {
      axios.get("http://localhost:3000/server/updateTextboxMessage", {
        params: {
          text: document.getElementById(`txa`).value
        }
      })
      axios.get("http://localhost:3000/server/updateUserInfo", {
        params: {
          access_token: this.user.access_token,
          token_secret: this.user.token_secret
        }
      })
    }
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  text-align: center;
}
.container {
  display: flex;
  justify-content: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
  "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 18px;
  color: #526488;
  letter-spacing: 1px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
.koton{
  opacity: 0;
  animation:koton 0.5s 1.5s 1 forwards;
  -webkit-animation:koton 0.5s 1.5s 1 forwards;
  -moz-animation:koton 0.5s 1.5s 1 forwards;
}
@keyframes koton{
  0%   { transform:translate(0%, -100%);  opacity: 0;}
  20% { transform:translate(0%, 0%);}
  30% { transform:translate(0%, -10%);}
  50% { transform:translate(0%, 0%);}
  60% { transform:translate(0%, -3%); opacity: 1;}
  80% { transform:translate(0%, 0%);}
  90% { transform:translate(0%, -1%);}
  100% { transform:translate(0%, 0%); opacity: 1;}
}
@-webkit-keyframes koton{
  0%   { -webkit-transform:translate(0%, -100%);  opacity: 0;}
  20% { -webkit-transform:translate(0%, 0%);}
  30% { -webkit-transform:translate(0%, -10%);}
  50% { -webkit-transform:translate(0%, 0%);}
  60% { -webkit-transform:translate(0%, -3%); opacity: 1;}
  80% { -webkit-transform:translate(0%, 0%);}
  90% { -webkit-transform:translate(0%, -1%);}
  100% { -webkit-transform:translate(0%, 0%); opacity: 1;}
}
@-moz-keyframes koton{
  0%   { -moz-transform:translate(0%, -100%);  opacity: 0;}
  20% { -moz-transform:translate(0%, 0%);}
  30% { -moz-transform:translate(0%, -10%);}
  50% { -moz-transform:translate(0%, 0%);}
  60% { -moz-transform:translate(0%, -3%); opacity: 1;}
  80% { -moz-transform:translate(0%, 0%);}
  90% { -moz-transform:translate(0%, -1%);}
  100% { -moz-transform:translate(0%, 0%); opacity: 1;}
}
</style>
