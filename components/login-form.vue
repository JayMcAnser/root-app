<template>
<v-form v-model="valid" ref="form">
  <v-card>
    <v-card-text class="pt-4">
      <v-text-field
        label="Enter your e-mail address"
        v-model="email"
        :rules="emailRules"
        required
      ></v-text-field>            
      <v-text-field
        label="Enter your password"
        v-model="password"
        min="5"
        :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="() => (passwordVisible = !passwordVisible)"
        :type="passwordVisible ? 'password' : 'text'"
        :rules="passwordRules"
        counter
        required
      ></v-text-field>
      <v-layout justify-space-between>
      </v-layout>
    </v-card-text>    
    <v-card-actions>
      <v-btn @click="login" >Login</v-btn>
      <v-btn @click="cancel">Cancel</v-btn>
    </v-card-actions>    
    <v-card-text>    
       <a href="requestPassword()">Forgot Password</a>
    </v-card-text>
  </v-card>
  <v-alert 
    color="red"
    v-if="errorMessage">
    Could not login in. Error: {{errorMessage}}
  </v-alert>

  </v-form>
</template>

<script>
  import {error} from '../lib/logging'
  export default {
    name: 'login-form',
    data(){
      return {
        valid: false,
        errorMessage: false,
        passwordVisible: true,
        email : "info@toxus.nl",
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        password : "123456",
        passwordRules: [
          (v) => !!v || 'Password is required',
        ],
      }
    },
    methods: {
      login: function () {
        let email = this.email
        let password = this.password
        this.$store.dispatch('auth/login', { username: email, password: password })
          .then(() => {
           // this.$router.push('/') 
           console.log('Did login')
            }
          )
          .catch( (err) => {
            this.errorMessage = err.message
            // error(err.message, 'login')
          }
          )
      },
      cancel: function() {
        this.$router.push('/')
      },
      requestPassword() {
        alert('please send a message to us so we can help you')
      }
    }
  }
</script>