<template>
  <div id="desktop">
    <span id="title">Studio Fanelli</span>
    <Icon
      name="cfd"
      title="CFD Simulator"
      filename="cfd-icon.png"
      :draggable="true"
      @dblclick="showCFD()"
      @touchend="showCFD()"
      @mousedown="startDrag($event)"
    @touchstart="startDrag($event)" />
    <CFD />
    <Icon
      name="airfoil"
      title="Airfoil Simulator"
      filename="airfoil-icon.png"
      :draggable="true"
      @dblclick="showAirfoil()"
      @touchend="showAirfoil()"
      @mousedown="startDrag($event)"
    @touchstart="startDrag($event)" />
    <Airfoil />
    <Icon
      name="cli"
      title="CMD PROMPT"
      filename="cli.png"
      :draggable="true"
      @dblclick="showCli()"
      @touchend="showCli()"
      @mousedown="startDrag($event)"
      @touchstart="startDrag($event)"/>
    <CLI @createDirectory="createDirectory" />

    <Icon
      name="email"
      title="Email"
      filename="Mail.png"
      :draggable="true"
      @dblclick="showEmail()"
      @touchend="showEmail()"
      @mousedown="startDrag($event)"
      @touchstart="startDrag($event)"/>
    <Email />

    <Icon
      name="resume"
      title="Resume"
      filename="Resume-Icon.png"
      :draggable="true"
      @dblclick="showResume()"
      @touchend="showResume()"
      @mousedown="startDrag($event)"
      @touchstart="startDrag($event)"/>
    <Resume v-bind:style="{ display: isActive ? 'block' : 'none' }" />

    <Icon
      name="portfolio"
      title="Portfolio"
      filename="DocumentsFolder.png"
      :draggable="true"
      @dblclick="showPortfolio()"
      @touchend="showPortfolio()"
      @mousedown="startDrag($event)"
      @touchstart="startDrag($event)"/>
    <Portfolio v-bind:style="{ display: isActive ? 'block' : 'none' }" />

    <Icon
      name="aboutme"
      title="README.txt"
      filename="Pin-sheet.png"
      :draggable="true"
      @dblclick="showAboutMe()"
      @touchend="showAboutMe()"
      @mousedown="startDrag($event)"
      @touchstart="startDrag($event)"/>
    <AboutMe v-bind:style="{ display: isActive ? 'block' : 'none' }" />

    <Icon
      name="game-selector"
      title="Games!"
      filename="DocumentsFolder.png"
      :draggable="true"
      v-on:dblclick="showGameSelector()"
      @touchend="showGameSelector()"
      @mousedown="startDrag($event)"
      @touchstart="startDrag($event)"/>
    <GameSelector v-bind:style="{ display: isActive ? 'block' : 'none' }" />

    <Icon
      name="chicken"
      title="Chicken Art"
      filename="chicken.png"
      :draggable="true"
      @dblclick="toggleChicken()"
      @touchend="toggleChicken()"
      @mousedown="startDrag($event)"
      @touchstart="startDrag($event)"/>
    <Chicken v-bind:style="{ display: activeChicken ? 'block' : 'none' }" />

    <div v-for="(directory, i) in directories" :key="i">
      <Icon
        :name=directory.name
        :title=directory.name
        filename="DocumentsFolder.png"
        :draggable="true"
        @dblclick="showDirectory(directory.id)"
        @touchend="showDirectory(directory.id)"
        @mousedown="startDrag($event)"
        @touchstart="startDrag($event)"/>
      <Directory :name="directory.name" :directories="directories" />
    </div>

  </div>
</template>

<script>

import CLI from '@/components/CLI.vue';
import Email from '@/components/Email.vue';
import Resume from '@/components/Resume.vue';
import Portfolio from '@/components/Portfolio.vue';
import AboutMe from '@/components/AboutMe.vue';
import GameSelector from './games/GameSelector.vue';
import Directory from './Directory.vue';
import Icon from './Icon.vue';
import Chicken from './chicken/Chicken.vue';
import Airfoil from '@/components/Airfoils.vue';
import CFD from '@/components/CFD.vue';

export default {
  name: 'Desktop',
  components: {
    Chicken,
    Icon,
    CLI,
    Email,
    Resume,
    Portfolio,
    AboutMe,
    GameSelector,
    Directory,
    Airfoil,
    CFD,
  },
  data() {
    return {
      isActive: false,
      activeChicken: false,
      directories: [],
    }
  },
  methods: {
    showAboutMe() {
      document.querySelector('#aboutme-container').style.display = "block";
    },
    showPortfolio() {
      document.querySelector('#portfolio-container').style.display = "block";
    },
    showResume() {
      document.querySelector('#resume-container').style.display = "block";
    },
    showEmail() {
      document.querySelector('#email-container').style.display = "block";
    },
    showAirfoil() {
      document.querySelector('#airfoil-container').style.display = "block";
    },
    showCFD() {
      document.querySelector('#cfd-container').style.display = "block";
    },
    toggleChicken() {
      this.activeChicken = !this.activeChicken;
    },
    showCli() {
      document.querySelector('#cli-container').style.display = "block";
      let input = document.querySelector('#command');
      input.focus();
      input.select();
    },
    showGameSelector() {
      if (document.querySelector('#game-selector-container').style.display === "none") {
        document.querySelector('#game-selector-container').style.display = "block";
      }
    },
    createDirectory(name) {
      this.directories.push(
        {
          id: name.split(' ').join(''),
          name: name
        }
      );
    },
    showDirectory(id) {
      if (document.querySelector(`#${id}-directory-container`).style.display === "none") {
        document.querySelector(`#${id}-directory-container`).style.display = "block";
      }
    },
    startDrag(event) {
      event.preventDefault();
      const icon = event.currentTarget;
      const desktop = document.getElementById('desktop');
      const desktopRect = desktop.getBoundingClientRect();
      
      let startX, startY, startLeft, startTop;

      if (event.type === 'touchstart') {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
      } else {
        startX = event.clientX;
        startY = event.clientY;
      }

      startLeft = icon.offsetLeft;
      startTop = icon.offsetTop;

      const move = (e) => {
        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        let newLeft = startLeft + (clientX - startX);
        let newTop = startTop + (clientY - startY);

        // constrain inside desktop
        newLeft = Math.max(0, Math.min(newLeft, desktopRect.width - icon.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, desktopRect.height - icon.offsetHeight));

        icon.style.position = 'absolute';
        icon.style.left = newLeft + 'px';
        icon.style.top = newTop + 'px';
      };

      const stop = () => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', stop);
        window.removeEventListener('touchmove', move);
        window.removeEventListener('touchend', stop);
      };

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', stop);
      window.addEventListener('touchmove', move);
      window.addEventListener('touchend', stop);
    }
  }
}
</script>

<style lang="scss">
@import '../styles/global.scss';
@import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");

#desktop {
  height: calc(100vh - 54px);
  width: 100vw;
  // background-color: $color-background;
}

#title {
  position: absolute;
  top: 35%;
  left: 25%;
  font-size: 4.7rem;
  font-family: "VT323", monospace;
  color: whitesmoke;
}
</style>
