<template>
  <div ref="draggableContainer" id="email-container">
    <!-- WINDOW HEADER -->
    <div id="email-header" @mousedown="dragMouseDown">
      <div class="title">
        <img src="/images/Mail.png" alt="mail" />
        <span>E-mail</span>
      </div>
      <div class="close" @click="closeContact()">✕</div>
    </div>

    <!-- FORM -->
    <form @submit.prevent="handleSubmit()" id="emailForm">
      <!-- META -->
      <div id="emailMeta">
        <div id="metaContainer">
          <div class="metaDiv">
            <label for="name">To:</label>
            <input
              id="name"
              type="text"
              value="illenafnayr@gmail.com"
              disabled
            />
          </div>

          <div class="metaDiv">
            <label for="email">Cc:</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              v-model="form.email"
            />
          </div>

          <div class="metaDiv">
            <label for="subject">Subject:</label>
            <input
              id="subject"
              type="text"
              v-model="form.subject"
            />
          </div>
        </div>

        <!-- SEND BUTTON -->
        <button type="submit" id="send" :disabled="sending">
          <img src="/images/Letter.png" alt="send" />
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

      <!-- MESSAGE BODY -->
      <div id="emailBody">
        <textarea
          id="text"
          v-model="form.message"
          placeholder="Type your message here..."
        ></textarea>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Email',

  data() {
    return {
      positions: {
        clientX: null,
        clientY: null,
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
        this.$refs.draggableContainer.offsetTop - this.positions.movementY + 'px'
      this.$refs.draggableContainer.style.left =
        this.$refs.draggableContainer.offsetLeft - this.positions.movementX + 'px'
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
          this.sendingDots.length < 3 ? this.sendingDots + '.' : '.'
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
            Accept: 'application/json'
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

/* WINDOW */
#email-container {
  position: absolute;
  top: 21%;
  left: 30%;
  width: 520px;
  background-color: rgb(192, 192, 192);
  border: 2px solid;
  border-color: #ffffff #404040 #404040 #ffffff;
  box-shadow: 2px 2px 0 #000;
  font-family: 'VT323', monospace;
  display: none;
  z-index: 10;
}

/* CRT SCANLINES */
#email-container::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.04),
    rgba(0, 0, 0, 0.04) 1px,
    transparent 1px,
    transparent 2px
  );
}

/* HEADER */
#email-header {
  cursor: move;
  background: linear-gradient(90deg, rgb(0, 0, 128), rgb(0, 0, 64));
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 6px;
  font-size: 18px;
}

.title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.title img {
  width: 16px;
  height: 16px;
}

/* FORM */
#emailForm {
  padding: 8px;
}

/* META */
#emailMeta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

#metaContainer {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metaDiv {
  display: flex;
  gap: 6px;
  align-items: center;
}

/* INPUTS */
input,
textarea {
  background: white;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  font-family: 'VT323', monospace;
  font-size: 18px;
  padding: 4px;
}

input:focus,
textarea:focus {
  outline: none;
}

/* SEND BUTTON */
#send {
  width: 64px;
  height: 64px;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  background-color: rgb(192, 192, 192);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

#send:hover {
  background-color: rgb(200, 200, 200);
}

#send:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

#send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* STATUS BAR */
#status-bar {
  height: 24px;
  margin: 6px 0;
  display: flex;
  align-items: center;
  padding: 2px 6px;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
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

/* HOURGLASS */
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

/* MESSAGE BODY */
#emailBody {
  margin-top: 6px;
  display: flex;
}

#text {
  width: 100%;
  height: 220px;
  resize: none;
}

/* MOBILE */
@media only screen and (max-width: 740px) {
  #email-container {
    width: 95%;
    left: 2.5%;
  }

  #send {
    width: 48px;
    height: 48px;
  }
}
</style>
