<template>
  <div ref="draggableContainer" id="airfoil-container">
    <div id="airfoil-header" @mousedown="dragMouseDown">
      <span>Airfoil Physics Simulator</span>
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
              <span class="stat-label">Re:</span>
              <span class="stat-value reynolds">{{ reynoldsNumber }}M</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Lift:</span>
              <span class="stat-value" :class="{ negative: lift < 0 }">{{ lift.toFixed(1) }} N</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Drag:</span>
              <span class="stat-value drag">{{ drag.toFixed(1) }} N</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">L/D:</span>
              <span class="stat-value ld">{{ ldRatio }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Status:</span>
              <span class="stat-value" :class="{ stall: isStalled, warning: stallStatus === 'WARNING' }">{{ stallStatus }}</span>
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
      showVortices: true,
      showPressure: true,
      animationId: null,
      particles: [],
      vortices: []
    }
  },
  computed: {
    reynoldsNumber() {
      const chord = 1;
      const kinematicViscosity = 1.5e-5;
      const velocityMS = this.airspeed * 0.514444;
      const re = (velocityMS * chord) / kinematicViscosity;
      return (re / 1000000).toFixed(2);
    },
    lift() {
      const alpha = this.angleOfAttack;
      const velocity = this.airspeed * 0.514444;
      const chord = 1;
      const kinematicViscosity = 1.5e-5;
      const Re = (velocity * chord) / kinematicViscosity;
      
      const reEffect = Math.min(1, Re / 500000);
      const alphaZeroLift = -2 - (this.camber * 0.3);
      const effectiveAlpha = alpha - alphaZeroLift;
      
      let cl;
      if (effectiveAlpha < 12) {
        cl = (0.11 * effectiveAlpha * (1 + this.camber / 100)) * reEffect;
      } else if (effectiveAlpha < 18) {
        const clMax = 1.5 + (this.camber / 100) * 0.3;
        const stallProgress = (effectiveAlpha - 12) / 6;
        cl = clMax * (1 - Math.pow(stallProgress, 2)) * reEffect;
      } else {
        cl = (0.4 + 0.3 * Math.sin(effectiveAlpha * Math.PI / 180)) * reEffect;
      }
      
      const rho = 1.225;
      const area = 1;
      const dynamicPressure = 0.5 * rho * velocity * velocity * area;
      
      return cl * dynamicPressure;
    },
    drag() {
      const alpha = this.angleOfAttack;
      const velocity = this.airspeed * 0.514444;
      const chord = 1;
      const kinematicViscosity = 1.5e-5;
      const Re = (velocity * chord) / kinematicViscosity;
      
      const cf = 0.074 / Math.pow(Re, 0.2);
      const cd0 = cf * (1 + 2 * this.thickness / 100);
      
      const rho = 1.225;
      const area = 1;
      const dynamicPressure = 0.5 * rho * velocity * velocity * area;
      const cl = this.lift / dynamicPressure;
      
      const aspectRatio = 6;
      const oswaldEfficiency = 0.85;
      const cdi = (cl * cl) / (Math.PI * oswaldEfficiency * aspectRatio);
      
      let cdSep = 0;
      if (Math.abs(alpha) > 12) {
        cdSep = 0.15 * Math.pow((Math.abs(alpha) - 12) / 8, 2);
      }
      
      const cd = cd0 + cdi + cdSep;
      return cd * dynamicPressure;
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
      this.showVortices = true;
      this.showPressure = true;
    },
    initCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      
      canvas.width = 700;
      canvas.height = 300;
      
      this.particles = [];
      for (let i = 0; i < 800; i++) {
        this.particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseSpeed: 0.8 + Math.random() * 1.5,
          size: 1 + Math.random()
        });
      }
    },
    animate() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.fillStyle = '#001a33';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const speedMultiplier = this.airspeed / 100;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const velocity = this.airspeed * 0.514444;
      
      if (this.showPressure && this.airspeed > 0) {
        const gradient = ctx.createRadialGradient(
          centerX, centerY - 30, 20, 
          centerX, centerY, 120
        );
        if (this.lift > 0) {
          gradient.addColorStop(0, 'rgba(100, 150, 255, 0.15)');
          gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
          gradient.addColorStop(1, 'rgba(255, 100, 100, 0.1)');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      this.particles.forEach(p => {
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let flowSpeed = p.baseSpeed * speedMultiplier;
        let verticalVelocity = 0;
        
        const turbulence = (Math.random() - 0.5) * 0.15;
        
        if (Math.abs(dx) < 150 && Math.abs(dy) < 80) {
          const circulation = this.lift / (1.225 * velocity + 0.001);
          const influenceFactor = Math.exp(-distance / 100);
          
          if (dy < -5) {
            const speedup = 1 + (Math.abs(circulation) / 300) * Math.exp(-Math.abs(dy + 15) / 25) * influenceFactor;
            flowSpeed *= speedup;
            
            if (dx < -30) {
              const curveEffect = Math.exp(-Math.abs(dx + 30) / 30);
              verticalVelocity -= curveEffect * 0.5 * speedMultiplier;
            }
          } else if (dy > 5) {
            const slowdown = 1 - (Math.abs(circulation) / 500) * Math.exp(-Math.abs(dy - 15) / 25) * influenceFactor;
            flowSpeed *= Math.max(0.3, slowdown);
            
            if (dx < -30) {
              const curveEffect = Math.exp(-Math.abs(dx + 30) / 30);
              verticalVelocity += curveEffect * 0.5 * speedMultiplier;
            }
          }
          
          if (dx < -40 && dx > -140) {
            const upwashStrength = -(this.angleOfAttack * 0.25) * Math.exp(-Math.abs(dx + 70) / 50);
            const lateralFalloff = Math.exp(-Math.abs(dy) / 40);
            verticalVelocity += upwashStrength * speedMultiplier * lateralFalloff;
          }
          
          if (dx > 30) {
            const downwashStrength = (this.angleOfAttack * 0.4) * Math.exp(-Math.abs(dx - 50) / 70);
            const lateralFalloff = Math.exp(-Math.abs(dy) / 50);
            verticalVelocity += downwashStrength * speedMultiplier * lateralFalloff;
          }
          
          if (this.isStalled && dx > -50 && dx < 60 && dy < -20) {
            verticalVelocity += (Math.random() - 0.5) * 4;
            flowSpeed *= 0.5 + Math.random() * 0.5;
          }
        }
        
        p.x += flowSpeed + turbulence;
        p.y += verticalVelocity + turbulence;
        
        if (p.x > canvas.width) {
          p.x = 0;
          p.y = Math.random() * canvas.height;
        }
        if (p.y < 0) p.y = canvas.height - Math.random() * 20;
        if (p.y > canvas.height) p.y = Math.random() * 20;
        
        if (this.showPressure) {
          if (dy < -10 && Math.abs(dx) < 120) {
            ctx.fillStyle = `rgba(100, 200, 255, ${0.6 + Math.random() * 0.3})`;
          } else if (dy > 10 && Math.abs(dx) < 120) {
            ctx.fillStyle = `rgba(255, 150, 100, ${0.6 + Math.random() * 0.3})`;
          } else {
            ctx.fillStyle = `rgba(200, 220, 255, ${0.5 + Math.random() * 0.3})`;
          }
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.random() * 0.2})`;
        }
        
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      
      if (this.showVortices && velocity > 1) {
        if (Math.abs(this.lift) > 10 && Math.random() < 0.2) {
          this.vortices.push({
            x: centerX + 70,
            y: centerY + (Math.random() * 20 - 10),
            size: 5,
            alpha: 1,
            vx: 1.5 + Math.random() * 0.8,
            vy: this.angleOfAttack * 0.2,
            rotation: 0,
            strength: Math.min(Math.abs(this.lift) / 40, 2.5),
            isStallVortex: false
          });
        }
        
        if (this.isStalled && Math.random() < 0.25) {
          this.vortices.push({
            x: centerX + 20 + Math.random() * 40,
            y: centerY - 40 - Math.random() * 20,
            size: 8,
            alpha: 1,
            vx: 0.5 + Math.random() * 1.5,
            vy: -1.5 - Math.random() * 2,
            rotation: 0,
            strength: 2,
            isStallVortex: true
          });
        }
        
        this.vortices = this.vortices.filter(v => v.alpha > 0 && v.x < canvas.width + 50);
        this.vortices.forEach(v => {
          v.x += v.vx;
          v.y += v.vy;
          v.rotation += v.strength * 0.15;
          v.size += v.isStallVortex ? 0.4 : 0.2;
          v.alpha -= v.isStallVortex ? 0.012 : 0.018;
          v.vy += 0.03;
          
          ctx.save();
          ctx.translate(v.x, v.y);
          ctx.rotate(v.rotation);
          
          ctx.beginPath();
          const arms = 3;
          for (let i = 0; i < arms; i++) {
            const angle = (i / arms) * Math.PI * 2;
            const r = v.size * 1.5;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          
          const color = v.isStallVortex ? '255, 80, 80' : '255, 180, 80';
          ctx.strokeStyle = `rgba(${color}, ${v.alpha})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(0, 0, v.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${v.alpha * 0.6})`;
          ctx.fill();
          
          ctx.restore();
        });
      }
      
      const chord = 120;
      const thicknessPx = chord * (this.thickness / 100);
      const camberPx = chord * (this.camber / 100);
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((this.angleOfAttack * Math.PI) / 180);
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      
      ctx.fillStyle = '#d0d0d0';
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 2.5;
      
      ctx.beginPath();
      ctx.moveTo(-chord/2, 0);
      ctx.bezierCurveTo(
        -chord/4, -thicknessPx/2 - camberPx * 0.8,
        chord/4, -thicknessPx/3 - camberPx * 0.4,
        chord/2, -thicknessPx/6
      );
      ctx.lineTo(chord/2, thicknessPx/6);
      ctx.bezierCurveTo(
        chord/4, thicknessPx/3,
        -chord/4, thicknessPx/2,
        -chord/2, 0
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.shadowColor = 'transparent';
      
      ctx.beginPath();
      ctx.arc(-chord/2 + 5, -2, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
      
      // DYNAMIC VECTOR SCALING - no caps, fully proportional
      if (this.lift !== 0) {
        const liftAbs = Math.abs(this.lift);
        
        // Simple square root scaling for smooth response across all ranges
        // sqrt(3000) ≈ 55, sqrt(100) ≈ 10, sqrt(10) ≈ 3
        const liftLength = Math.sqrt(liftAbs) * 1.0;
        
        // Direction: positive lift = up, negative lift = down
        const liftDirection = this.lift > 0 ? -1 : 1;
        
        // Debug: log values when stalled
        if (this.isStalled && Math.random() < 0.01) {
          console.log(`Stalled - Lift: ${this.lift.toFixed(1)}N, Arrow: ${liftLength.toFixed(1)}px, Angle: ${this.angleOfAttack}°, CL: ${(this.lift / (0.5 * 1.225 * Math.pow(this.airspeed * 0.514444, 2))).toFixed(3)}`);
        }
        
        // Change color during stall to indicate reduced efficiency
        ctx.strokeStyle = this.isStalled ? '#ffaa00' : (this.lift > 0 ? '#00ff00' : '#ff4444');
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, liftDirection * liftLength);
        ctx.lineTo(-6, liftDirection * liftLength - liftDirection * 12);
        ctx.moveTo(0, liftDirection * liftLength);
        ctx.lineTo(6, liftDirection * liftLength - liftDirection * 12);
        ctx.stroke();
        
        ctx.fillStyle = this.isStalled ? '#ffaa00' : (this.lift > 0 ? '#00ff00' : '#ff4444');
        ctx.font = 'bold 14px monospace';
        ctx.fillText('L', -15, liftDirection * liftLength - liftDirection * 5);
      }
      
      if (this.drag > 0) {
        // Square root scaling for drag too - no caps
        const dragLength = Math.sqrt(this.drag) * 0.8;
        
        ctx.strokeStyle = '#ff8800';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(dragLength, 0);
        ctx.lineTo(dragLength - 10, -5);
        ctx.moveTo(dragLength, 0);
        ctx.lineTo(dragLength - 10, 5);
        ctx.stroke();
        
        ctx.fillStyle = '#ff8800';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('D', dragLength + 5, -8);
      }
      
      ctx.restore();
      
      this.animationId = requestAnimationFrame(this.animate);
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
  box-shadow: 4px 4px 10px rgba(0,0,0,0.5);
}

#airfoil-header {
  cursor: move;
  z-index: 10;
  border: 1px solid black;
  color: white;
  background-image: linear-gradient(90deg, rgb(0,0,123), rgb(0,0,60));
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  font-size: 16px;
  font-weight: bold;
}

#airfoil-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px;
}

#airfoil-canvas {
  width: 700px;
  height: 300px;
  border: 2px inset #808080;
  background: #001a33;
  margin-bottom: 12px;
  display: block;
}

#controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
    font-size: 14px;
    font-weight: bold;
    
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
  font-size: 13px;
}

.stat-value {
  color: #00aa00;
  font-size: 17px;
  font-weight: bold;
  
  &.negative {
    color: #FF0000;
  }
  
  &.reynolds {
    color: #9966cc;
  }
  
  &.drag {
    color: #ff8800;
  }
  
  &.ld {
    color: #0066cc;
  }
  
  &.warning {
    color: #ff8800;
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
  font-size: 16px;
  font-weight: bold;
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
    height: 250px;
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