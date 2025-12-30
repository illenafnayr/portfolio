<template>
  <div ref="draggableContainer" id="email-container">
    <div id="email-header" @mousedown="dragMouseDown">
      <span>E-mail</span>
      <div class="close" @click="closeContact()">X</div>
    </div>

    <br>

    <form @submit.prevent="handleSubmit()" id="emailForm">

      <div id="emailMeta">
        <div id="metaContainer">

          <div class="metaDiv">
            <label for="name">To: </label>
            <input id="name" type="text" value="illenafnayr@gmail.com" disabled>
          </div>

          <div class="metaDiv">
            <label for="email">Cc: </label>
            <input id="email" type="email" placeholder="Your E-mail address" v-model="form.email">
          </div>

          <div>
            <label for="subject">Subject: </label>
            <input id="subject" type="text" v-model="form.subject">
          </div>

        </div>

        <button type="submit" id="send" :disabled="sending">
          <img src="/images/Letter.png" alt="send">
          <span>Send</span>
        </button>
      </div>

      <!-- STATUS BAR -->
      <div id="status-bar" v-if="status !== 'idle'">
        <div v-if="status === 'sending'" class="status sending">
          <span class="hourglass"></span>
          Sending{{ sendingDots }}
        </div>

        <div v-if="status === 'success'" class="status success">
          ✔ Transmission complete. Message delivered successfully.
        </div>

        <div v-if="status === 'error'" class="status error">
          ✖ Transmission failed. Please retry.
        </div>
      </div>
      
      <div id="emailBody">
        <textarea id="text" v-model="form.message"></textarea>
      </div>
      <br>
      <br>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Email',

  data() {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      },

      form: {
        email: '',
        subject: '',
        message: ''
      },

      sending: false,
      status: 'idle', // idle | sending | success | error
      sendingDots: '.',
      dotInterval: null
    }
  },

  methods: {
    dragMouseDown(event) {
      event.preventDefault()
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
    },

    elementDrag(event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY

      this.$refs.draggableContainer.style.top =
        (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
      this.$refs.draggableContainer.style.left =
        (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
    },

    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
    },

    closeContact() {
      document.querySelector('#email-container').style.display = 'none'
    },

    startDots() {
      this.sendingDots = '.'
      this.dotInterval = setInterval(() => {
        this.sendingDots =
          this.sendingDots.length < 3
            ? this.sendingDots + '.'
            : '.'
      }, 500)
    },

    stopDots() {
      clearInterval(this.dotInterval)
      this.dotInterval = null
    },

    async handleSubmit() {
      if (this.sending) return

      if (!this.form.email || !this.form.subject || !this.form.message) {
        this.status = 'error'
        // setTimeout(() => {
        //   this.status = 'idle'
        // }, 5000)
        return
      }

      this.sending = true
      this.status = 'sending'
      this.startDots()

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: '105c2fae-8b7a-41a2-835c-c51ba39dd506',
            subject: this.form.subject,
            from_name: this.form.email,
            email: this.form.email,
            message: this.form.message,
            to_email: 'illenafnayr@gmail.com'
          })
        })

        const result = await response.json()

        if (result.success) {
          this.status = 'success'
          this.form.email = ''
          this.form.subject = ''
          this.form.message = ''
        } else {
          this.status = 'error'
        }
      } catch (err) {
        console.error(err)
        this.status = 'error'
      } finally {
        this.sending = false
        this.stopDots()
        setTimeout(() => {
          this.status = 'idle'
        }, 5000)
      }
    }
  }
}
</script>


<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

#email-container {
  position: absolute;
  z-index: 10;
  height: fit-content;
  width: 50%;
  background-color: rgb(192, 192, 192);
  border: 1px solid;
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  resize: both;
  font-family: 'VT323', monospace;
  text-align: center;
  display: none;
  top: 21%;
  left: 30%;
}

#email-header {
  cursor: move;
  border: 1px solid black;
  color: white;
  background-image: linear-gradient(90deg, rgb(0, 0, 123), black);
  display: flex;
  justify-content: space-between;
  padding: 2px 6px;
}

#emailForm {
  display: flex;
  flex-direction: column;
}

#emailMeta {
  display: flex;
  justify-content: center;
}

#metaContainer {
  display: flex;
  flex-direction: column;
}

.metaDiv {
  margin-left: 32px;
}

#send {
  border: 1px solid black;
  background-color: rgb(192, 192, 192);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  margin-left: 5px;
  border-color: #FFFFFF #808080 #808080 #FFFFFF;
  cursor: pointer;
}

#send:active {
  border-color: #808080 #FFFFFF #FFFFFF #808080;
}

#send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

#text {
  width: 350px;
  height: 200px;
}

/* STATUS BAR */
#status-bar {
  width: 90%;
  margin: 6px auto 6px auto;
  /* ← bottom margin added */
  padding: 4px;
  border: 1px solid black;
  background-color: rgb(192, 192, 192);
  border-color: #808080 #FFFFFF #FFFFFF #808080;
  text-align: left;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status.success {
  color: darkgreen;
}

.status.error {
  color: darkred;
}

/* Hourglass */

.hourglass {
  width: 12px;
  height: 12px;
  border: 2px solid black;
  border-top-color: transparent;
  animation: spin 1s steps(6) infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile */

@media only screen and (max-width: 740px) {
  #email-container {
    width: 95%;
    left: 2.5%;
  }

  input {
    width: 30%;
  }

  #send {
    width: 32px;
    height: 32px;
    border: none;
    margin-left: 0;
  }

  .metaDiv {
    margin: 0;
    width: 120%;
  }

  #text {
    height: 200px;
    width: 80%;
  }
}
</style>