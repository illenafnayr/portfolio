<template>
  <div ref="draggableContainer" id="resume-container">
    <!-- Header -->
    <div id="resume-header" @mousedown="dragMouseDown">
      <span>Resume</span>
      <div class="close" @click="closePortfolio">X</div>
    </div>

    <!-- Scrollable body -->
    <div id="resume-body">
      <!-- Header Info -->
      <div class="center">
        <img src="../assets/me.jpeg" alt="My Smiling Face" id="myFace" />
        <h2>Ryan Fanelli</h2>
        <div class="contact-line">
          +1-(802)-275-7764 ·
          <a href="mailto:ryan@gaiatechnologies.io">ryan@gaiatechnologies.io</a>
        </div>
        <div>U.S.A / Italia · <a href="https://www.RyanFanelli.com" target="_blank">www.RyanFanelli.com</a></div>
      </div>

      <hr />

      <!-- Summary -->
      <section>
        <p><b>My mission is to empower a better planet through innovation and sustainability.</b></p>
        <p>
          A dedicated engineer, aspiring pilot and entrepreneur passionate about sustainability and transforming ideas into
          meaningful, technology-driven solutions. With a background spanning software engineering, biological sciences,
          and a growing expertise in aerospace systems and a particular passion for sustainable aviation, I thrive at the
          intersection of innovation and practicality, driving progress through creativity, precision, and diverse ways of
          thinking.
        </p>
        <p>
          I combine analytical rigor with curiosity and empathy, inspiring confidence within teams and sparking collaboration
          that leads to real-world impact and a more sustainable future.
        </p>
      </section>

      <hr />

      <!-- EXPERIENCE -->
      <section>
        <h3 @click="toggleSection('experience')" class="section-header">
          Experience <span class="toggle-arrow">{{ sectionsOpen.experience ? '▲' : '▼' }}</span>
        </h3>
        <div class="section-content" :class="{ collapsed: !sectionsOpen.experience }">
          <div class="item" v-for="exp in experiences" :key="exp.title">
            <div class="item-title" @click="toggleItem('experiences', exp.title, $event)">
              {{ exp.title }}
              <img v-if="exp.icon" :src="exp.iconUrl" class="item-icon" />
              <span class="toggle-arrow">{{ itemOpen.experiences[exp.title] ? '▲' : '▼' }}</span>
            </div>
            <div class="item-content" :class="{ collapsed: !itemOpen.experiences[exp.title] }">
              <div class="item-meta">{{ exp.date }}</div>
              <div class="item-role">{{ exp.role }}</div>
              <p v-if="exp.description">{{ exp.description }}</p>
              <ul v-if="exp.points">
                <li v-for="(point, idx) in exp.points" :key="idx">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <hr />

      <!-- EDUCATION -->
      <section>
        <h3 @click="toggleSection('education')" class="section-header">
          Education <span class="toggle-arrow">{{ sectionsOpen.education ? '▲' : '▼' }}</span>
        </h3>
        <div class="section-content" :class="{ collapsed: !sectionsOpen.education }">
          <div class="item" v-for="edu in education" :key="edu.institution">
            <div class="item-title" @click="toggleItem('education', edu.institution, $event)">
              {{ edu.institution }}
              <img v-if="edu.icon" :src="edu.iconUrl" class="item-icon" :style="eduIconStyle(edu.institution)" />
              <span class="toggle-arrow">{{ itemOpen.education[edu.institution] ? '▲' : '▼' }}</span>
            </div>
            <div class="item-content" :class="{ collapsed: !itemOpen.education[edu.institution] }">
              <div class="item-meta">{{ edu.date }}</div>
              <p v-if="edu.degree">{{ edu.degree }}</p>
              <p v-if="edu.note">{{ edu.note }}</p>
              <ul v-if="edu.points">
                <li v-for="(point, idx) in edu.points" :key="idx">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <hr />

      <!-- CERTIFICATES -->
      <section>
        <h3 @click="toggleSection('certificates')" class="section-header">
          Certificates & Continuing Education <span class="toggle-arrow">{{ sectionsOpen.certificates ? '▲' : '▼' }}</span>
        </h3>
        <div class="section-content" :class="{ collapsed: !sectionsOpen.certificates }">
          <div class="item" v-for="cert in certificates" :key="cert.title">
            <div class="item-title" @click="toggleItem('certificates', cert.title, $event)">
              {{ cert.title }}
              <img v-if="cert.icon" :src="cert.iconUrl" class="item-icon" :style="certIconStyle(cert.title)" />
              <span class="toggle-arrow">{{ itemOpen.certificates[cert.title] ? '▲' : '▼' }}</span>
            </div>
            <div class="item-content" :class="{ collapsed: !itemOpen.certificates[cert.title] }">
              <div class="item-meta">{{ cert.date }}</div>
              <p v-if="cert.description">{{ cert.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <hr />

      <!-- TECHNICAL SKILLS -->
      <section>
        <h3 @click="toggleSection('skills')" class="section-header">
          Technical Skills <span class="toggle-arrow">{{ sectionsOpen.skills ? '▲' : '▼' }}</span>
        </h3>
        <div class="section-content" :class="{ collapsed: !sectionsOpen.skills }">
          <ul>
            <li><b>Engineering & Analysis:</b> MATLAB, Simulink, SolidWorks, Fusion 360 (Basic), Nastran/Patran, ANSYS Mechanical, ANSYS Fluent, XFOIL (learning)</li>
            <li><b>Instrumentation & Prototyping:</b> Arduino, Raspberry Pi, sensors, data acquisition systems</li>
            <li><b>Programming & Data Science:</b> Python, R, Java, JavaScript</li>
            <li><b>Libraries:</b> NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, TensorFlow, Keras</li>
            <li><b>Mathematics & Statistics:</b> Calculus, Real Analysis, Linear Algebra, Statistics</li>
            <li><b>Data Analysis & Visualization:</b> Data cleaning, exploratory data analysis, visualization, regression, classification, clustering, basic neural networks</li>
            <li><b>Scientific Computing:</b> Applying programming to simulation, modeling, and quantitative analysis</li>
          </ul>
        </div>
      </section>

      <hr />

      <!-- LANGUAGES -->
      <section>
        <h3 @click="toggleSection('languages')" class="section-header">
          Languages <span class="toggle-arrow">{{ sectionsOpen.languages ? '▲' : '▼' }}</span>
        </h3>
        <div class="section-content" :class="{ collapsed: !sectionsOpen.languages }">
          <ul>
            <li>English - Native</li>
            <li>Italiano - B1/B2</li>
            <li>Français - A2</li>
          </ul>
        </div>
      </section>

      <hr />

      <!-- SOFT SKILLS / OTHER -->
      <section>
        <h3 @click="toggleSection('softSkills')" class="section-header">
          Soft Skills / Other <span class="toggle-arrow">{{ sectionsOpen.softSkills ? '▲' : '▼' }}</span>
        </h3>
        <div class="section-content" :class="{ collapsed: !sectionsOpen.softSkills }">
          <ul>
            <li>Aviation Enthusiast</li>
            <li>Creative Thinking</li>
            <li>Analytical Thinking</li>
            <li>Leadership</li>
            <li>Teamwork & Collaboration</li>
            <li>Continuous Learning</li>
            <li>Adaptability</li>
            <li>Effective Communication</li>
            <li>Problem Solving & Innovation</li>
            <li>Entrepreneurship</li>
            <li>Project Management</li>
            <li>Agile Methodologies</li>
            <li>Reading & Writing Documentation</li>
            <li>LaTeX</li>
            <li>Time Management</li>
            <li>Organization</li>
            <li>Word / Excel</li>
            <li>Linux OS</li>
            <li>Double Bass</li>
            <li>Full Stack Development (TypeScript, Various Frameworks, Java/Spring, WordPress, System Design, DevOps, etc.)</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "Resume",
  data() {
    return {
      experiences: [
        {
          title: "H₂ EDGE",
          role: "Design and Manufacturing",
          date: "October 2025 - Present",
          icon: "h2edge-icon.jpeg",
          description: "H₂ Edge is a student-led research initiative at the Politecnico di Torino aimed at reducing the carbon footprint of the aviation industry through the development of a direct hydrogen combustion system for retrofitted civil aviation turbojet engines.",
          points: [
            "Contributing to the design and manufacturing of hydrogen-compatible fuel injectors and combustion chambers optimized for H₂.",
            "MATLAB to analyze and optimize certain design parameters.",
            "CAD modeling (SOLIDWORKS), learning and performing CFD (Ansys) simulations to analyze injector flow behavior for improved atomization and mixing.",
            "Support the manufacturing of prototype components and conduct cold-flow testing with helium.",
            "Apply sustainable propulsion engineering principles to advance hydrogen-based retrofitting solutions."
          ]
        },
        {
          title: "OSIRIS",
          role: "Head of Prototyping Section",
          date: "October 2025 - Present",
          icon: "osiris-icon.png",
          description: "OSIRIS is a student project in collaboration with Politecnico di Torino and Politecnico di Milano, dedicated to long-term space sustainability and the development of a circular space economy through Active Debris Removal (ADR) and in-orbit recycling of orbital waste.",
          points: [
            "Lead a 12-member interdisciplinary team organized into four sub-teams: Kinematics, Mechanics, Electronics & PCBs, and Software.",
            "Oversee systems-level design and concurrent engineering workflows for the development of an orbital debris capture manipulator.",
            "Conduct high-level systems engineering tasks, including requirements definition, interface management, and cross-team coordination using MBSE principles.",
            "Support low-level design and analysis efforts including materials selection, structural analysis, and prototype manufacturability."
          ]
        },
        {
          title: "Gaia Technologies",
          role: "Founder",
          date: "Jan 2023 - Present",
          icon: "gaia-icon.svg",
          description: "Mission to create an Intelligent Agricultural Digital Twin System integrating IoT sensors, edge/cloud computing, and data science to simulate, predict, and automate agricultural processes.",
          points: [
            "Optimize efficiency, reduce costs, and increase yields for agricultural clients.",
            "Funded by software consulting and development services for US and Italian small businesses."
          ]
        },
        {
          title: "Green Mountain Power",
          role: "Full Stack Software Engineer",
          date: "Apr 2021 - Apr 2024",
          icon: "green-mountain-power-icon.svg",
          points: [
            "Provided performance-driven software solutions across mobile app, website, and internal development.",
            "Mentored junior team members and facilitated knowledge-sharing sessions.",
            "Established and enforced software development best practices."
          ]
        },
        {
          title: "Woodhams Lab",
          role: "Research Assistant",
          date: "Jan 2019 - Jan 2020",
          icon: "woodhams-lab-icon.png",
          points: [
            "Conducted research on amphibian chytrid fungi (Batrachochytrium dendrobatidis and B. salamandrivorans).",
            "Analyzed field data using Python, Matplotlib, and R.",
            "Audited R programming course and conducted statistical data analysis."
          ]
        }
      ],
      education: [
        {
          institution: "Politecnico di Torino",
          date: "2025 - Present",
          degree: "Mechanical Engineering",
          note: "Plan to transfer to Ingegneria Aerospaziale (Aerospace Engineering) after receiving Italian language requirements.",
          points: ["Member of H₂ EDGE and OSIRIS student teams, both focused on sustainability in aerospace"],
          icon: "polito-icon.png"
        },
        {
          institution: "University of Massachusetts",
          date: "2018 - 2020",
          degree: "Biochemistry, 136 credits toward B.S.",
          points: ["Member of Beta Beta Beta Biology Honors Society", "Cum Laude Honors", "Participated in Research Immersion Project leading to Woodhams Lab"],
          icon: "umass-icon.png"
        },
        {
          institution: "Berklee College of Music",
          date: "2015 - 2017",
          degree: "Jazz Composition & Double Bass Performance, 94 credits toward Bachelor of Music",
          points: ["Dean's List", "Member of Berklee Contemporary Symphony Orchestra", "Toured with Professor Allen Levine's Stämbandet", "Andrew Alden Ensemble - Guitar/Synthesizer/Sound Design"],
          icon: "berklee-icon.png"
        }
      ],
      certificates: [
        {
          title: "EASA Private Pilot Licence (PPL) – In Progress",
          date: "Begins January 2026",
          description: "Scheduled 100-hour ground school course in January, working toward completion of the EASA Private Pilot Licence.",
          icon: "ppl-icon.png"
        },
        {
          title: "MIT Applied Data Science Program",
          date: "Mar 2024 - Jun 2024",
          description: "Focused on supervised/unsupervised learning, time-series analysis, recommendation systems, regression, deep learning. Capstone project: Using Convolutional Neural Networks to detect malaria infected blood cells.",
          icon: "mit-icon.png"
        },
        {
          title: "General Assembly Software Engineering Bootcamp",
          date: "Nov 2020 - Feb 2021",
          description: "500+ hour immersive program covering ReactJS, Node, MongoDB/Mongoose, Express, HTML, CSS, JavaScript, SQL, Python, Django.",
          icon: "ga-icon.png"
        }
      ],
      sectionsOpen: {
        experience: true,
        education: true,
        certificates: true,
        skills: true,
        languages: true,
        softSkills: true
      },
      itemOpen: {
        experiences: {},
        education: {},
        certificates: {}
      },
      positions: {}
    };
  },
  created() {
    const icons = import.meta.glob('@/assets/*', { eager: true, as: 'url' });
    const mapIcon = (iconName) => icons[`/src/assets/${iconName}`] || null;

    this.experiences.forEach(exp => {
      exp.iconUrl = mapIcon(exp.icon);
      this.itemOpen.experiences[exp.title] = true;
    });

    this.education.forEach(edu => {
      edu.iconUrl = mapIcon(edu.icon);
      this.itemOpen.education[edu.institution] = true;
    });

    this.certificates.forEach(cert => {
      cert.iconUrl = mapIcon(cert.icon);
      this.itemOpen.certificates[cert.title] = true;
    });
  },
  methods: {
    dragMouseDown(event) {
      event.preventDefault();
      this.positions = { clientX: event.clientX, clientY: event.clientY };
      document.onmousemove = this.elementDrag;
      document.onmouseup = this.closeDragElement;
    },
    elementDrag(event) {
      const movementX = this.positions.clientX - event.clientX;
      const movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      this.$refs.draggableContainer.style.top = this.$refs.draggableContainer.offsetTop - movementY + "px";
      this.$refs.draggableContainer.style.left = this.$refs.draggableContainer.offsetLeft - movementX + "px";
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    },
    closePortfolio() {
      this.$refs.draggableContainer.style.display = "none";
    },
    toggleSection(section) {
      this.sectionsOpen[section] = !this.sectionsOpen[section];
    },
    toggleItem(section, key, event) {
      if (event) event.stopPropagation();
      this.itemOpen[section][key] = !this.itemOpen[section][key];
    },
    eduIconStyle(institution) {
      if (institution === "Politecnico di Torino") return { maxHeight: "70px" };
      if (institution === "Berklee College of Music") return { maxHeight: "30px" };
      return { maxHeight: "50px" };
    },
    certIconStyle(title) {
      if (title.includes("MIT")) return { maxHeight: "110px" };
      return { maxHeight: "50px" };
    }
  }
};
</script>

<style scoped>
#resume-container {
  position: absolute;
  width: 60%;
  height: 80%;
  resize: both;
  overflow: hidden;
  background: #c0c0c0;
  border: 2px solid black;
  font-family: monospace;
  z-index: 10;
  display: none;
}

#myFace {
  height: 175px;
  width: auto;
  border: 2px solid black;
  border-radius: 50%;
  margin-top: 3%;
}

#resume-header {
  height: 32px;
  background: linear-gradient(90deg, navy, black);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  cursor: move;
}

#resume-body {
  min-height: 100px;
  height: calc(100% - 32px);
  overflow-y: auto;
  padding: 1rem;
  box-sizing: border-box;
}

.center {
  text-align: center;
}

.contact-line {
  margin-bottom: 0.25rem;
}

.section-header {
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-arrow {
  margin-left: 0.5rem;
  font-size: 0.8em;
}

.section-content {
  max-height: 5000px;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.section-content.collapsed {
  max-height: 0;
}

.item {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-direction: column;
}

.item-icon {
  margin-left: 1rem;
  max-height: 50px;
  width: auto;
  height: auto;
}

.item-content {
  max-height: 5000px;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding-left: 1rem;
}

.item-content.collapsed {
  max-height: 0;
}

.item-title {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.item-meta {
  font-style: italic;
  font-size: 0.9em;
}

.item-role {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

ul {
  margin-left: 1rem;
}
</style>