<template>
    <div id="navbar">
        <div @mouseleave="hideMenu">
            <StartMenu v-bind:style='{"display": (isActive? "FLEX" : "none")}' />
        </div>
        <div id="btnContainer">
            <div id="startbtn" v-on:click="showMenu()" v-bind:style='{"border-color": (isActive? "#808080 #FFFFFF #FFFFFF #808080" : "#FFFFFF #808080 #808080 #FFFFFF")}' >
                <img src="../assets/windows.png" alt="windows" id="windowslogo" >
                <span>START</span>
            </div>
        </div>
    
        <div id="clockContainer">
            <div id="clock">
                <span>{{ timestamp }}</span>
            </div>
        </div>
    </div>
    
    </template>
    
    <script>
    import StartMenu from '@/components/StartMenu.vue'
    
    export default {
      name: 'NavBar',
      components: {
          StartMenu
      },
      data() {
          return {
              timestamp: '',
              isActive: false
        }
      },
      mounted() {
          this.getTime()
          document.querySelector('#desktop').addEventListener('click', () => {
              if (document.querySelector('#startMenu').style.display === "flex") {
                  this.isActive = false
              }
          })
      },
      created() {
          setInterval(this.getTime, (1000*60))
      },
      methods: {
          getTime() {
              const today = new Date();
            //   const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
              this.timestamp = today.getHours() + ":" + (today.getMinutes()<10?'0':'') + today.getMinutes();
            //   const time = time;
            //   this.timestamp = time;
          },
          showMenu() {
            //   document.getElementById('startMenu').style.display = 'block'
            this.isActive = !this.isActive
          },
          hideMenu() {
              this.isActive = false
          }
      }
    }
    </script>
    
    <!-- Add "scoped" attribute to limit CSS to this component only -->
    <style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
    
    
    #navbar {
        position: absolute;
        bottom: 0%;
        height: 35px;
        width: 100vw;
        background-color: rgb(192,192,192);
        border-top: 1px solid black;
        border-width:2px;
        border-color: #ffffff;
        display: flex;
    }
    
    #btnContainer {
        height: 100%;
        display: flex;
        align-items: center;
    }
    
    #startbtn {
        font-family: 'VT323', monospace;
        height: 80%;
        left: 5px;
        border: .5px solid black;
        box-sizing: border-box;
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1px 2px 1px 2px;
        border-width:1px;
        border-color:#FFFFFF #808080 #808080 #FFFFFF;
        cursor: pointer;
    }
    
    /* #startbtn:active {
        border-color: #808080 #FFFFFF #FFFFFF #808080;
    } */
    
    #clockContainer {
        height: 100%;
        display: flex;
        align-items: center;
    }
    
    #clock {
        font-family: 'VT323', monospace;
        height: 80%;
        right: 5px;
        border: .5px solid black;
        box-sizing: border-box;
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1px 2px 1px 2px;
        border-width:1px;
        border-color: #808080 #FFFFFF #FFFFFF #808080 
    }
    
    #windowslogo {
        height: 98%;
    }
    
    </style>