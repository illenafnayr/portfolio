<template>
  <div id="startMenu">
    <div id="sidebar">
      <span id="startMenuTitle">Ryan Fanelli</span>
    </div>

    <div id="appList">
      <div class="block" v-on:click="showAirfoil()">
        <img src="../assets/airfoil-icon.png" alt="Airfoil Simulator" class="icon no-invert" />
        <span>Airfoil Simulator</span>
      </div>
      <div class="block" v-on:click="showCFD()">
        <img src="../assets/cfd-icon.png" alt="CFD SImulator" class="icon no-invert" />
        <span>CFD Simulator</span>
      </div>
      <div class="block" v-on:click="showCLI()">
        <img src="../assets/cli.png" alt="CMD Prompt" class="icon no-invert" />
        <span>CMD Prompt</span>
      </div>
      <div class="block" v-on:click="showEmail()">
        <img src="../assets/Mail.png" alt="Email" class="icon no-invert" />
        <span>Email</span>
      </div>

      <div class="block">
        <a class="container block" href="https://github.com/illenafnayr" target="_blank">
          <img src="../assets/github-logo.png" alt="Git Hub" class="icon" />
          <span>Git Hub</span>
        </a>
      </div>

      <div class="block">
        <a class="container block" href="https://www.linkedin.com/in/ryan-fanelli/" target="_blank">
        <img src="../assets/linkedin-logo.png" alt="Git Hub" class="icon" />
        <span>LinkedIn</span>
        </a>
      </div>

      <div class="block" v-on:click="showPortfolio()">
        <img src="../assets/DocumentsFolder.png" alt="Portfolio" class="icon no-invert" />
        <span>Portfolio</span>
      </div>
      <hr />
      <!-- Suspend -->
      <div class="block">
        <img src="../assets/Starfield.png" alt="Portfolio" class="icon no-invert" />
        <span>Suspend</span>
      </div>

      <!-- Shut Down -->
      <a href="https://www.google.com" class="block">
        <div class="container block">
          <img src="../assets/Power-down.png" alt="Portfolio" class="icon no-invert" />
          <span>Shut Down</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "StartMenu",
  methods: {
    showPortfolio() {
      if (
        document.querySelector("#portfolio-container").style.display === "none"
      ) {
        document.querySelector("#portfolio-container").style.display = "block";
      }
    },
    showEmail() {
      document.querySelector("#email-container").style.display = "block";
    },
    showCLI() {
      document.querySelector("#cli-container").style.display = "block";
      let input = document.querySelector("#command");
      input.focus();
      input.select();
    },
    showCFD() {
      document.querySelector('#cfd-container').style.display = "block";
    },
    showAirfoil() {
      document.querySelector('#airfoil-container').style.display = "block";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
@import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");

#startMenu {
  position: absolute;
  left: 1.5px;
  bottom: 38px;
  width: 200px;
  height: 310px;
  background-color: rgb(191, 191, 191);
  border: 1px solid black;
  border-color: #ffffff #808080 #808080 #ffffff;
  display: flex;
  font-family: "VT323", monospace;
  z-index: 999;
}

#sidebar {
  height: 100%;
  width: 12.5%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  background-image: linear-gradient(180deg, black, rgb(0, 0, 123));
}

#appList {
  height: 100%;
  width: 90%;
  display: flex;
  flex-direction: column;
}

#startMenuTitle {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  color: #ffffff;
  margin-bottom: 40%;
  padding: 1.5%;
  font-size: 0.925rem;
}

hr {
  width: 98%;
  margin: 0;
}

.block {
  height: 3rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  color: black;
}

.block:hover {
  cursor: pointer;
  background-color: rgb(0, 0, 123);
  color: #ffffff;
}

.block:hover .icon {
  filter: invert(100%);
}

.block:link {
  text-decoration: none;
  color: inherit;
}

.container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* Standardized icon styling */
.icon {
  width: 30px;
  height: 3opx;
  object-fit: contain;
  margin-left: 5%;
  margin-right: 4%;
}

/* Prevent inversion for specific icons */
.block:hover .icon.no-invert {
  filter: none;
}
</style>