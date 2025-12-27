<template>
    <div ref="draggableContainer" id="airfoil-container">
      <div id="airfoil-header" @mousedown="dragMouseDown">
        <span>✈️ Airfoil Physics Simulator</span>
        <div class="close" @click="closeAirfoil">X</div>
      </div>
      
      <div id="airfoil-content">
        <canvas ref="canvas" id="airfoil-canvas"></canvas>
        
        <div id="controls">
          <div class="control-row">
            <div class="control-group">
              <label>Angle of Attack: {{ angleOfAttack }}°</label>
              <input 
                type="range" 
                min="-20" 
                max="20" 
                v-model.number="angleOfAttack"
                class="slider"
              >
            </div>
            
            <div class="control-group">
              <label>Airspeed: {{ airspeed }} kt</label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                v-model.number="airspeed"
                class="slider"
              >
            </div>
          </div>
  
          <div class="control-row">
            <div class="control-group">
              <label>Camber: {{ camber }}%</label>
              <input 
                type="range" 
                min="0" 
                max="15" 
                v-model.number="camber"
                class="slider"
              >
            </div>
            
            <div class="control-group">
              <label>Thickness: {{ thickness }}%</label>
              <input 
                type="range" 
                min="5" 
                max="20" 
                v-model.number="thickness"
                class="slider"
              >
            </div>
          </div>
  
          <div class="control-row">
            <div class="control-group">
              <label>
                <input type="checkbox" v-model="showVortices"> Show Vortices
              </label>
            </div>
            
            <div class="control-group">
              <label>
                <input type="checkbox" v-model="showPressure"> Show Pressure
              </label>
            </div>
          </div>
          
          <div class="bottom-row">
            <div class="stats">
              <div class="stat-item">
                <span class="stat-label">Lift:</span>
                <span class="stat-value" :class="{ negative: lift < 0 }">{{ lift.toFixed(1) }} N</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Drag:</span>
                <span class="stat-value">{{ drag.toFixed(1) }} N</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">L/D:</span>
                <span class="stat-value">{{ ldRatio }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Status:</span>
                <span class="stat-value" :class="{ stall: isStalled }">{{ stallStatus }}</span>
              </div>
            </div>
            
            <button @click="resetControls" class="reset-btn">Reset</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Airfoil',
    data() {
      return {
        positions: {
          clientX: undefined,
          clientY: undefined,
          movementX: 0,
          movementY: 0,
        },
        angleOfAttack: 5,
        airspeed: 100,
        camber: 4,
        thickness: 12,
        showVortices: false,
        showPressure: true,
        animationId: null,
        particles: [],
        vortices: []
      }
    },
    computed: {
      lift() {
        const camberEffect = 1 + (this.camber / 100);
        const liftCoefficient = 0.1 * this.angleOfAttack * camberEffect;
        const velocity = this.airspeed / 10;
        return liftCoefficient * velocity * velocity * 2;
      },
      drag() {
        const thicknessEffect = 1 + (this.thickness / 100);
        const dragCoefficient = 0.02 + Math.abs(this.angleOfAttack) * 0.005;
        const velocity = this.airspeed / 10;
        return dragCoefficient * velocity * velocity * 2 * thicknessEffect;
      },
      ldRatio() {
        if (this.drag === 0) return '∞';
        return (this.lift / this.drag).toFixed(2);
      },
      isStalled() {
        return Math.abs(this.angleOfAttack) > 15;
      },
      stallStatus() {
        if (this.isStalled) return 'STALL';
        if (Math.abs(this.angleOfAttack) > 12) return 'WARNING';
        return 'NORMAL';
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initCanvas();
        this.animate();
      });
    },
    beforeUnmount() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    },
    methods: {
      dragMouseDown(event) {
        event.preventDefault();
        this.positions.clientX = event.clientX;
        this.positions.clientY = event.clientY;
        document.onmousemove = this.elementDrag;
        document.onmouseup = this.closeDragElement;
      },
      elementDrag(event) {
        event.preventDefault();
        this.positions.movementX = this.positions.clientX - event.clientX;
        this.positions.movementY = this.positions.clientY - event.clientY;
        this.positions.clientX = event.clientX;
        this.positions.clientY = event.clientY;
        this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px';
        this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px';
      },
      closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      },
      closeAirfoil() {
        this.$refs.draggableContainer.style.display = 'none';
      },
      resetControls() {
        this.angleOfAttack = 5;
        this.airspeed = 100;
        this.camber = 4;
        this.thickness = 12;
        this.showVortices = false;
        this.showPressure = true;
      },
      initCanvas() {
        const canvas = this.$refs.canvas;
        if (!canvas) return;
        
        canvas.width = 580;
        canvas.height = 250;
        
        this.particles = [];
        for (let i = 0; i < 60; i++) {
          this.particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseSpeed: 1 + Math.random() * 2
          });
        }
      },
      animate() {
        const canvas = this.$refs.canvas;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.fillStyle = '#000080';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const speedMultiplier = this.airspeed / 100;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw pressure field
        if (this.showPressure && this.airspeed > 0) {
          const gradient = ctx.createRadialGradient(centerX, centerY - 20, 10, centerX, centerY, 100);
          if (this.lift > 0) {
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 0, 255, 0.1)');
          }
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw particles with flow effects
        this.particles.forEach(p => {
          const distanceFromCenter = Math.abs(p.y - centerY);
          const maxDistance = canvas.height / 2;
          const flowEffect = 1 - (distanceFromCenter / maxDistance) * 0.5;
          
          // Deflection based on airfoil angle
          const dx = p.x - centerX;
          if (Math.abs(dx) < 100 && Math.abs(p.y - centerY) < 50) {
            const deflection = this.angleOfAttack * 0.3;
            p.y += deflection * speedMultiplier;
          }
          
          p.x += p.baseSpeed * speedMultiplier * flowEffect;
          
          if (p.x > canvas.width) {
            p.x = 0;
            p.y = Math.random() * canvas.height;
          }
          
          // Color particles based on position (pressure visualization)
          if (this.showPressure && p.y < centerY) {
            ctx.fillStyle = 'rgba(255, 100, 100, 0.8)'; // High pressure below
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          }
          ctx.fillRect(p.x, p.y, 3, 3);
        });
        
        // Draw vortices if stalled
        if (this.showVortices && this.isStalled) {
          this.updateVortices(centerX, centerY);
          this.vortices.forEach(v => {
            ctx.beginPath();
            ctx.arc(v.x, v.y, v.size, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 0, 0, ${v.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          });
        }
        
        // Draw airfoil
        const length = 80;
        const thicknessPixels = length * (this.thickness / 100);
        const camberPixels = length * (this.camber / 100);
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((this.angleOfAttack * Math.PI) / 180);
        
        ctx.fillStyle = '#C0C0C0';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(-length/2, 0);
        ctx.quadraticCurveTo(0, -thicknessPixels/2 - camberPixels, length/2, -thicknessPixels/4);
        ctx.lineTo(length/2, thicknessPixels/4);
        ctx.quadraticCurveTo(0, thicknessPixels/2, -length/2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw lift arrow
        if (this.lift > 0 && !this.isStalled) {
          const arrowLength = Math.min(Math.abs(this.lift) / 2, 60);
          ctx.strokeStyle = this.lift > 0 ? '#00FF00' : '#FF0000';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -arrowLength);
          ctx.lineTo(-5, -arrowLength + 10);
          ctx.moveTo(0, -arrowLength);
          ctx.lineTo(5, -arrowLength + 10);
          ctx.stroke();
        }
        
        // Draw drag arrow
        if (this.drag > 5) {
          const dragLength = Math.min(this.drag / 3, 40);
          ctx.strokeStyle = '#FFA500';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(dragLength, 0);
          ctx.lineTo(dragLength - 8, -4);
          ctx.moveTo(dragLength, 0);
          ctx.lineTo(dragLength - 8, 4);
          ctx.stroke();
        }
        
        ctx.restore();
        
        this.animationId = requestAnimationFrame(this.animate);
      },
      updateVortices(centerX, centerY) {
        if (Math.random() < 0.1) {
          this.vortices.push({
            x: centerX + 40,
            y: centerY - 30,
            size: 5,
            alpha: 1,
            vx: 2,
            vy: -1
          });
        }
        
        this.vortices = this.vortices.filter(v => v.alpha > 0);
        this.vortices.forEach(v => {
          v.x += v.vx;
          v.y += v.vy;
          v.size += 0.5;
          v.alpha -= 0.02;
        });
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  #airfoil-container {
    position: absolute;
    z-index: 10;
    width: fit-content;
    height: fit-content;
    border: 2px solid;
    background-color: rgb(192,192,192);
    border-width: 1px;
    border-color: #FFFFFF #808080 #808080 #FFFFFF;
    font-family: 'VT323', monospace;
    display: none;
    top: 15%;
    left: 25%;
  }
  
  #airfoil-header {
    cursor: move;
    z-index: 10;
    border: 1px solid black;
    color: white;
    background-image: linear-gradient(90deg, rgb(0,0,123), black);
    display: flex;
    justify-content: space-between;
    padding: 2px 4px;
    font-size: 18px;
  }
  
  .close {
    border: 1px solid;
    border-width: 1px;
    border-color: #FFFFFF #808080 #808080 #FFFFFF;
    background-color: rgb(192,192,192);
    padding: 0 8px;
    cursor: pointer;
    user-select: none;
  }
  
  .close:active {
    border-color: #808080 #FFFFFF #FFFFFF #808080;
  }
  
  #airfoil-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
  }
  
  #airfoil-canvas {
    width: 580px;
    height: 250px;
    border: 2px inset #808080;
    background: #000080;
    margin-bottom: 10px;
    display: block;
  }
  
  #controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .control-row {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  
  .control-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    
    label {
      font-size: 16px;
      
      input[type="checkbox"] {
        margin-right: 5px;
      }
    }
  }
  
  .slider {
    width: 100%;
    height: 20px;
  }
  
  .bottom-row {
    display: flex;
    gap: 10px;
    align-items: stretch;
    margin-top: 5px;
  }
  
  .stats {
    background-color: white;
    border: 2px inset #808080;
    padding: 10px;
    display: flex;
    justify-content: space-around;
    font-size: 16px;
    flex: 1;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }
  
  .stat-label {
    font-weight: bold;
    font-size: 14px;
  }
  
  .stat-value {
    color: #00FF00;
    font-size: 18px;
    
    &.negative {
      color: #FF0000;
    }
    
    &.stall {
      color: #FF0000;
      animation: blink 0.5s infinite;
    }
  }
  
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0.3; }
  }
  
  .reset-btn {
    border: 2px solid;
    border-color: #FFFFFF #808080 #808080 #FFFFFF;
    background-color: rgb(192,192,192);
    padding: 8px 20px;
    font-family: 'VT323', monospace;
    font-size: 18px;
    cursor: pointer;
    white-space: nowrap;
    
    &:active {
      border-color: #808080 #FFFFFF #FFFFFF #808080;
    }
  }
  
  @media only screen and (max-width: 740px) {
    #airfoil-container {
      width: 95%;
      left: 2.5%;
      height: auto;
    }
    
    #airfoil-canvas {
      width: 100%;
      height: 200px;
    }
    
    .control-row {
      flex-direction: column;
      gap: 8px;
    }
    
    .bottom-row {
      flex-direction: column;
    }
    
    .stats {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
  </style>