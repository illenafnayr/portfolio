<template>
  <div ref="draggableContainer" id="resume-container">
    <div id="resume-header" @mousedown="dragMouseDown">
      <span>Resume</span>
      <div class="close" v-on:click="closePortfolio()">X</div>
    </div>
    <!-- <iframe src="https://drive.google.com/file/d/1KP3j4HTnb6PT7QXT_49KP7CdftAgPvc7/preview" width="640" height="480"></iframe> -->
    <div id="resumeBody">
      <span><a href="https://docs.google.com/document/d/1HC395Lwld-MCwlSDf75lkga1hZoJFETzk1aOZK7pJr0/edit" target="_blank">(click for a more formal .pdf version)</a></span>
      <img src="../assets/me.jpeg" alt="My Smiling Face" id="myFace">
      <h3>Ryan Fanelli</h3>
      <span class="bold">Full-Stack Software Engineer</span>
      <div>
        <span class="contact"><a href="https://www.linkedin.com/in/ryan-fanelli/" target="_blank">LinkedIn</a></span>
        <span class="contact"><a href = "mailto: illenafnayr@gmail.com">illenafnayr@gmail.com</a></span>
        <span class="contact"><a href="https://github.com/RyanFanelli" target="_blank">GitHub</a></span>
      </div>
      <div id="stack">
        <img class="tech-logo" src="../assets/react.png" alt="react">
        <img class="tech-logo" src="../assets/vue.png" alt="vue">
        <img class="tech-logo" src="../assets/node.png" alt="node">
        <img class="tech-logo" src="../assets/mysql.png" alt="mysql">
        <img class="tech-logo" src="../assets/express.png" alt="express">
        <img class="tech-logo" src="../assets/mongodb.png" alt="mongodb">
        <img class="tech-logo" src="../assets/rubyonrails.png" alt="ruby on rails">
        <img class="tech-logo" src="../assets/postgresql.png" alt="postgresql">
      </div>
      <hr style="width: 95%">
      <div id="skills">
        <span class="bold">Skills</span>
        <div id="frontend"><span class="bold">Frontend: </span>React, Vue,  Angular, NextJS, React Native, ThreeJs, Wordpress, Headless WP,  PHP, JQuery, E JS, Sass, CSS, HTML, TypeScript, JavaScript, Design Systems.</div>
        <div id="backend"><span class="bold">Backend: </span>Java, Spring/SpringBoot, Docker, Firebase, Nginx, NodeJS, ExpressJS, NoSql, PostgreSQL, MySQL, Ruby on Rails, Maven, Oracle</div>
        <div id="technologies"><span class="bold">Other: </span>R programming language, Python, Tensorflow, PyTorch, Git/GitHub. Agile development practices. Always thirsty for knowledge.</div>
      </div>
      <hr style="width: 95%">
      <div>
        <span class="bold">Experience</span>
        <div>
          <div class="project" id="experience">
            <span class="bold">Software Engineer - Green Mountain Power // April '21 to Present</span>
            <ul>
              <li>Full stack engineer</li>
              <li><a href="https:/www.greenmountainpower.com" target="_blank">www.greenmountainpower.com</a></li>
            </ul>
          </div>
        </div>
        <hr style="width: 95%">
        <div>
          <div class="project" id="experience">
            <span class="bold">I.T. Consultant - G.T.DESIGN // December '22 to March '22'</span>
            <ul>
              <li>Freelance I.T.  consultant.</li>
              <li>Reorganization and coordination of internal team and external resources used by the company.</li>
              <li>Project management for development and implementation of services and information technology.</li>
              <li><a href="https://www.gtdesign.it/" target="_blank">www.gtdesign.it/</a></li>
            </ul>
          </div>
        </div>
      </div>
      <hr style="width: 95%">
      <div>
        <span class="bold">Other Experience</span>
        <div>
          <div class="project" id="experience">
            <span class="bold">Research Assistant - Woodhams Lab // January ‘19 to January ‘20</span>
            <ul>
              <li>Conducted experiments, statistically analyzed field data to help cure global amphibian pathogens.</li>
              <li>Audited a course in R programming language.</li>
              <li>Data analysis with Python Pandas, Matplotlib, and R.</li>
            </ul>
          </div>
        </div>
        <div class="project" id="experience">
          <span class="bold">Guitar/Synthesizer/Sound Design - Andrew Alden Ensemble // 2014 - 2016</span>
          <ul>
            <li>Circuit-bent synthesizers and digitally manipulated audio data to create unique sounds.</li>
            <li>Produced textual scores for film and performs them in front of a live audience to transform the picture with new sounds and experiences.</li>
          </ul>
        </div>
        <div class="project" id="experience">
          <span class="bold">Production Intern - Z2 Productions // 2012</span>
          <ul>
            <li>Front and back of house audio engineer intern at Fox Theatre and Boulder Theatre.</li>
            <li>Worked with live recording software such as Pro Tools and logic.</li>
          </ul>
        </div>
      </div>
      <hr style="width: 95%">
      <div id="projects">
        <span class="bold">Projects</span>
        <div class="project">
          <span class="bold"><a href="https://github.com/SustainableCities" target="_blank">Sustainable Cities hackathon</a></span>
          <ul>
            <li>Three day hackathon with a data scientist, UX/UI designers and a development team.</li>
            <li>React application, with an express server. Maps a CSV file (created from an array public data resources, handed over from data scientist) to usable REST API using Sequelize</li>
          </ul>
        </div>
      </div>
      <hr style="width: 95%">
      <div id="education">
        <span class="bold">Education</span>
        <div class="project">
          <span class="bold">General Assembly - Software Engineering Immersive Course</span>
          <ul>
            <li>Full-time, 500+ hour Software Engineering Immersive program covering HTML, CSS, JavaScript, ReactJS, Node, MongoDB/Mongoose, Express, SQL, Ruby on Rails</li>
            <li>Completed coursework and projects using front-end development, full-stack development, front-end frameworks, and APIs.</li>
          </ul>
        </div>
        <div class="project">
          <span class="bold">University of Massachusetts Boston - Biochemistry</span>
          <ul>
            <li>136 credits toward Bachelor of Science</li>
          </ul>
        </div>
        <div class="project">
          <span class="bold">Berklee College of Music - Jazz Composition</span>
          <ul>
            <li>94 credits toward Bachelor of Music</li>
          </ul>
        </div>        
      </div>
      <hr style="width: 95%">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Resume',
  data: function () {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      }
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
    closePortfolio () {
      document.querySelector('#resume-container').style.display = 'none'
    }
  }
}
</script>

<style lang="scss">
@import '../styles/global.scss';
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');


#resume-container {
  position: absolute;
  z-index: 10;
  height: 55%;
  width: 50%;
  border: 2px solid;
  background-color: rgb(192,192,192);
  border-width:1px;
  border-color:#FFFFFF #808080 #808080 #FFFFFF;
  resize: both;
  overflow: hidden;
  font-family: 'VT323', monospace;
  text-align:center;
  display: none;
  top: 21%;
  left: 30%;
}
#resume-header {
  cursor:move;
  z-index: 10;
  border: 1px solid black;
  color: white;
  background-image: linear-gradient(90deg, rgb(0,0,123), black);
  display: flex;
  justify-content: space-between;
}

.close {
  border: 1px solid;
  border-width:1px;
  border-color:#FFFFFF #808080 #808080 #FFFFFF;
  background-color: rgb(192,192,192);
  width: 3%;
}

.close:active{
    border-color: #808080  #FFFFFF  #FFFFFF #808080;
}



#resumeBody {
  height: 95%;
  width: 100%;
  /* border: 1px solid gold; */
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  /* justify-content: center; */
}

#myFace {
  height: 175px;
  width: auto;
  border: 2px solid black;
  border-radius: 50%;
  margin-top: 3%;
}

.contact {
  margin: 2%;
}

#stack{
  display: flex;
  /* margin: 2.5%; */
}

.tech-logo {
  height: 25px;
}

.bold {
  font-weight: 600;
}

.project {
  text-align: left;
}

#experience {
  margin-top: 2.5%;
}
</style>