<template>
  <div id="startMenu">
    <div id="sidebar">
      <span id="startMenuTitle">Ryan Fanelli</span>
    </div>

    <div id="appList">
      <div class="block" v-on:click="showCLI()">
        <img src="../assets/cli.png" alt="Portfolio" id="resumeIcon" />
        <span>CMD Prompt</span>
      </div>
      <div class="block" v-on:click="showEmail()">
        <img src="../assets/Mail.png" alt="Portfolio" id="mailboxPhone" />
        <span>Email</span>
      </div>
      <a class="block" href="https://github.com/illenafnayr" target="_blank">
        <div class="container block">
          <img src="../assets/github-logo.png" alt="Git Hub" />
          <span>Git Hub</span>
        </div>
      </a>
      <a
        class="block"
        href="https://www.linkedin.com/in/ryan-fanelli/"
        target="_blank"
      >
        <div class="container block">
          <img src="../assets/linkedin-logo.png" alt="Git Hub" />
          <span>LinkedIn</span>
        </div>
      </a>
      <div class="block" v-on:click="showPortfolio()">
        <img
          src="../assets/DocumentsFolder.png"
          alt="Portfolio"
          id="documentsFolder"
        />
        <span>Portfolio</span>
      </div>
      <hr />
      <!-- Suspend -->
      <div class="block">
        <img src="../assets/Starfield.png" alt="Portfolio" id="suspend" />
        <span>Suspend</span>
      </div>

      <!-- Shut Down -->
      <a href="https://www.google.com" class="block">
        <div class="container block">
          <img src="../assets/Power-down.png" alt="Portfolio" id="powerDown" />
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
  width: 175px;
  height: 275px;
  background-color: rgb(191, 191, 191);
  border: 1px solid black;
  /* border-width:1px; */
  border-color: #ffffff #808080 #808080 #ffffff;
  display: flex;
  font-family: "VT323", monospace;
  z-index: 999;
}

#sidebar {
  height: 100%;
  width: 12.5%;
  /* background-color: rgb(0,0,123); */
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
  width: "98%";
  margin: 0;
}

.block {
  height: 14.2857142857%;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  color: black;
  /* border: 1px solid gold; */
}

.block:hover {
  cursor: pointer;
  background-color: rgb(0, 0, 123);
  color: #ffffff;
}

.block:hover img {
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

img {
  width: 10%;
  margin: 0% 3% 0% 5%;
}

.block:hover #documentsFolder,
.block:hover #mailboxPhone,
.block:hover #resumeIcon,
.block:hover #suspend,
.block:hover #powerDown {
  filter: none;
}

#documentsFolder {
  height: 65%;
  margin-left: 1.5%;
  margin-right: 1%;
  width: auto;
}

#mailboxPhone {
  height: 45%;
  width: auto;
  margin-left: 3%;
  margin-right: 3.5%;
}

#resumeIcon {
  height: 40%;
  width: auto;
  margin-right: 3%;
}

#suspend {
  height: 52.5%;
  width: auto;
  margin-left: 3.5%;
  margin-right: 2.5%;
}

#powerDown {
  height: 60%;
  width: auto;
  margin-left: 2.5%;
  margin-right: 1.75%;
}
</style>
