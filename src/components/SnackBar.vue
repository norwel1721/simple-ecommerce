<template>
    <div v-if="visible" class="snackbar" :class="type">
      <span>{{ message }}</span>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'info'
      },
      duration: {
        type: Number,
        default: 3000
      }
    },
    data() {
      return {
        visible: false
      };
    },
    methods: {
      show() {
        this.visible = true;
        setTimeout(this.close, this.duration);
      },
      close() {
        this.visible = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .snackbar {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 16px;
    border-radius: 4px;
    color: white;
    z-index: 99999;
  }
  .info {
    background-color: blue;
  }
  .success {
    background-color: green;
  }
  .error {
    background-color: red;
  }
  .warning {
    background-color: orange;
  }
  </style>
  