<template>
  <div ref="draggableContainer" id="email-container">
    <div id="email-header" @mousedown="dragMouseDown">
      <span>E-mail</span>
      <div class="close" v-on:click="closeContact()">X</div>
    </div>
    <br>
    <form v-on:submit.prevent="handleSubmit()" encType="multipart/form-data" id="emailForm">
        <div id="emailMeta">
          <div id="metaContainer">
            <div class="metaDiv">
              <label for="name">To: </label>
              <input id="name" type="text" name="name" value="illenafnayr@gmail.com" disabled="disabled"><br>
            </div>

            <div class="metaDiv">
              <label for="email">Cc: </label>
              <input  id="email" type="email" name="email" placeholder="Your E-mail address" v-model="form.email"><br>
            </div>

            <div>
              <label for="subject">Subject: </label>
              <input type="text" name="subject" id="subject" v-model="form.subject"><br>
            </div>
          </div>
          <button type="submit" id="send">
            <img src="/images/Letter.png" alt="send">
            <span>Send</span>
          </button>
        </div>
        <br>
        <div id="emailBody">
          <textarea name="message" id="text" v-model="form.message" ></textarea><br>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Email',
  data: function () {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      },
      form: {
        email: '',
        subject: '',
        message: ''
      },
      sending: false
    }
  },
  methods: {
    dragMouseDown: function (event) {
      event.preventDefault()
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
    },
    elementDrag: function (event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      // set the element's new position:
      this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
      this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
    },
    closeDragElement () {
      document.onmouseup = null
      document.onmousemove = null
    },
    closeContact () {
      document.querySelector('#email-container').style.display = 'none'
    },
    async handleSubmit () {
      if (this.sending) return
      
      if (!this.form.email || !this.form.subject || !this.form.message) {
        alert('Please fill in all fields')
        return
      }
      
      this.sending = true
      
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: '105c2fae-8b7a-41a2-835c-c51ba39dd506', // Go ahead, steal it. It's my free key :)
            subject: this.form.subject,
            from_name: this.form.email,
            email: this.form.email,
            message: this.form.message,
            to_email: 'illenafnayr@gmail.com'
          })
        })
        
        const result = await response.json()
        
        if (result.success) {
          alert('Your message has been sent!')
          this.form.email = ''
          this.form.subject = ''
          this.form.message = ''
        } else {
          alert('Failed to send message. Please try again.')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to send message. Please try again.')
      } finally {
        this.sending = false
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
  height: 370px;
  width: 50%;
  border: 2px solid;
  background-color: rgb(192,192,192);
  border-width:1px;
  border-color:#FFFFFF #808080 #808080 #FFFFFF;
  resize: both;
  overflow: auto;
  font-family: 'VT323', monospace;
  text-align:center;
  display: none;
  top: 21%;
  left: 30%;
}
#email-header {
  cursor:move;
  z-index: 10;
  border: 1px solid black;
  color: white;
  background-image: linear-gradient(90deg, rgb(0,0,123), black);
  display: flex;
  justify-content: space-between;
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
  display: flex;
  background-color: rgb(192,192,192);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  margin-left: 5px;
  box-sizing: border-box;
  outline: none;
  border-color:#FFFFFF #808080 #808080 #FFFFFF;
  cursor: pointer;
}

#send:active {
  border-color: #808080  #FFFFFF  #FFFFFF #808080;
}

#text {
  width: 350px;
  height: 200px;
}

@media only screen and (max-width: 740px) {

  #email-container {
    width: 95%;
    left: 2.5%;
  }

   input{
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
     width:120%
   }

   #text {
     height: 200px;
     width:80%;
   }
}
</style>