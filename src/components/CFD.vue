<template>
    <div ref="container" id="cfd-container">
        <div id="cfd-header" @mousedown="dragMouseDown" @touchstart="dragMouseDown">
            <span>🌊 CFD Simulator</span>
            <div class="close" @click="closeCFD">X</div>
        </div>

        <div id="cfd-content">
            <canvas ref="canvas" id="cfd-canvas"></canvas>

            <div id="controls">
                <div class="control-row">
                    <div class="control-group">
                        <label>Flow Speed: {{ speed.toFixed(2) }}</label>
                        <input type="range" min="0.2" max="2.0" step="0.05" v-model.number="speed">
                    </div>
                    <div class="control-group">
                        <label>Turbulence: {{ turbulence.toFixed(2) }}</label>
                        <input type="range" min="0" max="2" step="0.05" v-model.number="turbulence">
                    </div>
                </div>

                <div class="control-row">
                    <div class="control-group">
                        <label>Obstacle</label>
                        <select v-model="obstacle">
                            <option value="cylinder">Cylinder</option>
                            <option value="square">Rounded Square</option>
                            <option value="airfoil">Airfoil</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "FakeCFDRealistic",
    data() {
        return {
            nx: 200,
            ny: 80,
            speed: 1.0,
            turbulence: 1.0,
            obstacle: "cylinder",
            time: 0,
            animationId: null,
            fieldU: null,
            fieldV: null,
            fieldWake: null,
            particles: [],
            particleCount: 2500,
            dragging: false,
            pos: { x: 0, y: 0 },
        };
    },
    mounted() {
        this.initField();
        this.initParticles();
        this.resizeCanvas();
        this.animate();
        window.addEventListener("resize", this.resizeCanvas);
    },
    beforeUnmount() {
        cancelAnimationFrame(this.animationId);
        window.removeEventListener("resize", this.resizeCanvas);
    },
    methods: {
        dragMouseDown(e) {
            const client = e.touches ? e.touches[0] : e;
            this.dragging = true;
            this.pos.x = client.clientX;
            this.pos.y = client.clientY;
            document.onmousemove = this.elementDrag;
            document.onmouseup = this.closeDrag;
            document.ontouchmove = this.elementDrag;
            document.ontouchend = this.closeDrag;
        },
        elementDrag(e) {
            if (!this.dragging) return;
            const dx = this.pos.x - e.clientX;
            const dy = this.pos.y - e.clientY;
            this.pos.x = e.clientX;
            this.pos.y = e.clientY;
            const el = this.$refs.container;
            el.style.top = el.offsetTop - dy + "px";
            el.style.left = el.offsetLeft - dx + "px";
        },
        closeDrag() {
            this.dragging = false;
            document.onmouseup = null;
            document.onmousemove = null;
        },
        closeCFD() {
            this.$refs.container.style.display = "none";
        },
        initField() {
            const size = this.nx * this.ny;
            this.fieldU = new Float32Array(size);
            this.fieldV = new Float32Array(size);
            this.fieldWake = new Float32Array(size);
        },
        initParticles() {
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.nx,
                    y: Math.random() * this.ny,
                    age: Math.random(),
                });
            }
        },
        resizeCanvas() {
            const c = this.$refs.canvas;
            c.width = this.nx;
            c.height = this.ny;
        },
        obstacleMask(x, y) {
            const cx = this.nx * 0.35;
            const cy = this.ny * 0.5;
            const dx = x - cx;
            const dy = y - cy;
            if (this.obstacle === "cylinder") return dx * dx + dy * dy < 100;
            if (this.obstacle === "square") return Math.abs(dx) < 10 && Math.abs(dy) < 10;
            if (this.obstacle === "airfoil") return dx > -15 && dx < 15 && Math.abs(dy - 5 * Math.sin((dx / 15) * Math.PI)) < 5;
            return false;
        },
        stepField() {
            const { nx, ny, fieldU, fieldV, fieldWake } = this;
            this.time += 0.016 * this.speed;

            for (let y = 0; y < ny; y++) {
                for (let x = 0; x < nx; x++) {
                    const i = x + y * nx;
                    const cx = nx * 0.35;
                    const cy = ny * 0.5;
                    const dx = x - cx;
                    const dy = y - cy;
                    const r2 = dx * dx + dy * dy;

                    if (this.obstacleMask(x, y)) {
                        fieldU[i] = 0;
                        fieldV[i] = 0;
                        fieldWake[i] = 1;
                        continue;
                    }

                    // Smooth continuous inlet flow
                    let u = this.speed;
                    let v = 0;

                    // Deflect flow around obstacle
                    const influence = Math.exp(-r2 / 200);
                    const angle = Math.atan2(dy, dx);
                    u += Math.cos(angle) * influence * -this.speed * 0.8;
                    v += Math.sin(angle) * influence * this.speed * 0.8;

                    // Wake vortices behind obstacle
                    if (dx > 0) {
                        const wake = Math.sin(5 * dx / nx - this.time * 3) * Math.exp(-dx / 40);
                        v += wake * this.turbulence * 0.5;
                        u += wake * this.turbulence * 0.2;
                    }

                    fieldU[i] = u;
                    fieldV[i] = v;
                    fieldWake[i] = Math.sqrt(u * u + v * v) / this.speed;
                }
            }
        },
        updateParticles() {
            const { nx, ny, fieldU, fieldV, speed } = this;

            for (let p of this.particles) {
                const xi = Math.floor(p.x);
                const yi = Math.floor(p.y);

                let u = 0, v = 0;
                if (xi >= 0 && xi < nx && yi >= 0 && yi < ny) {
                    const i = xi + yi * nx;
                    u = fieldU[i];
                    v = fieldV[i];
                }

                // Minimum advection so particles always move
                const minSpeed = 0.2;
                const factor = speed;
                const dx = (u + (u === 0 ? minSpeed : 0)) * factor;
                const dy = (v + (v === 0 ? minSpeed : 0)) * factor;

                p.x += dx;
                p.y += dy;

                // Reset particle when it leaves the right edge
                if (p.x >= nx) {
                    p.x = 0;                  // left edge
                    p.y = Math.random() * ny; // random vertical position
                }

                // Keep particle inside vertical bounds
                if (p.y < 0) p.y = 0;
                if (p.y >= ny) p.y = ny - 1;
            }
        },

        render() {
            const ctx = this.$refs.canvas.getContext("2d");
            const img = ctx.createImageData(this.nx, this.ny);
            const d = img.data;

            for (let i = 0; i < this.fieldU.length; i++) {
                let r = 0, g = 0, b = 0;
                const w = this.fieldWake[i];
                r = Math.floor(255 * w);
                g = Math.floor(150 * w);
                b = Math.floor(255 * (1 - w));

                d[i * 4] = r;
                d[i * 4 + 1] = g;
                d[i * 4 + 2] = b;
                d[i * 4 + 3] = 255;
            }
            ctx.putImageData(img, 0, 0);

            // draw particles
            ctx.fillStyle = "white";
            for (let p of this.particles) {
                ctx.fillRect(p.x, p.y, 1, 1);
            }
        },
        animate() {
            this.stepField();
            this.updateParticles();
            this.render();
            this.animationId = requestAnimationFrame(this.animate);
        }
    }
};
</script>

<style scoped>
#cfd-container {
    z-index: 10;
    position: absolute;
    top: 10%;
    left: 20%;
    background: rgb(192, 192, 192);
    border: 2px solid #fff;
    font-family: 'VT323', monospace;
    display: none;
}

#cfd-header {
    background: linear-gradient(90deg, #00007b, black);
    color: white;
    padding: 4px;
    cursor: move;
    display: flex;
    justify-content: space-between;
}

#cfd-canvas {
        width: 100%;
        max-width: 600px;
        aspect-ratio: 600 / 240;
        height: auto;
        image-rendering: pixelated;
        border: 2px inset #808080;
}

@media only screen and (max-width: 480px) {
    #cfd-container {
        left: 5%;
        top: 5%;
        width: 90%;
    }

    .control-row {
        flex-direction: column;
    }
}

#controls {
    padding: 8px;
}

.control-row {
    display: flex;
    gap: 10px;
}

.control-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>