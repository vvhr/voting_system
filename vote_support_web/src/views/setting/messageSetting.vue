<template>
  <div class="app-container">
    <h1>I Am {{name}} !</h1>
    <button @click="clickMe()">点我</button>
  </div>
</template>

<script>
import { getDeviceByImei } from '@/api/device'

export default {
  data() {
    return {
      name: 'Tony'
    }
  },
  methods: {
    clickMe() {
      getDeviceByImei().then(function(response) {
        console.log('res', response)
      })
    }
  }
}
</script>
