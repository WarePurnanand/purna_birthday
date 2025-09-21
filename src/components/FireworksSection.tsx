import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface FireworkType {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  angle: number;
  brightness: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
  update: (index: number) => void;
  draw: () => void;
}

interface ParticleType {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  hue: number;
  size: number;
  gravity: number;
  update: (index: number) => void;
  draw: () => void;
}

const FireworksSection: React.FC<FireworksSectionProps> = ({ user, onNext }) => {
  const [showFireworks, setShowFireworks] = useState(false);
  const [fireworksStarted, setFireworksStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (showFireworks && canvasRef.current) {
      startFireworks();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showFireworks]);

  const startFireworks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas once
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks: FireworkType[] = [];
    const particles: ParticleType[] = [];

    class Firework {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      speed: number;
      angle: number;
      brightness: number;
      trail: Array<{ x: number; y: number; alpha: number }>;

      constructor(sx: number, sy: number, tx: number, ty: number) {
        this.x = sx;
        this.y = sy;
        this.targetX = tx;
        this.targetY = ty;

        const distance = Math.hypot(tx - sx, ty - sy);
        this.speed = distance * 0.02; // slightly faster
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.brightness = Math.random() * 50 + 50;
        this.trail = [];
      }

      update(index: number) {
        // Add trail point
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > 6) this.trail.shift();

        // Move
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        const distance = Math.hypot(this.targetX - this.x, this.targetY - this.y);
        if (distance < this.speed) {
          fireworks.splice(index, 1);
          createParticles(this.targetX, this.targetY);
        }
      }

      draw() {
        // Draw trail
        this.trail.forEach((point, i) => {
          ctx!.globalAlpha = point.alpha * 0.5;
          ctx!.beginPath();
          ctx!.arc(point.x, point.y, i * 0.6, 0, Math.PI * 2);
          ctx!.fillStyle = `hsl(${Math.random() * 60 + 15}, 100%, 70%)`;
          ctx!.fill();
        });

        // Main dot
        ctx!.globalAlpha = 1;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `hsl(${Math.random() * 60 + 15}, 100%, ${this.brightness}%)`;
        ctx!.fill();
      }
    }

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      hue: number;
      size: number;
      gravity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8; // less velocity
        this.vy = (Math.random() - 0.5) * 8;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.hue = Math.random() * 360;
        this.size = Math.random() * 2 + 1;
        this.gravity = 0.05;
      }

      update(index: number) {
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vy += this.gravity;

        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;

        if (this.alpha <= 0) particles.splice(index, 1);
      }

      draw() {
        ctx!.globalAlpha = this.alpha;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx!.fill();
      }
    }

    const createParticles = (x: number, y: number) => {
      const particleCount = Math.random() * 25 + 25; // smaller burst
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y));
      }
    };

    const createFirework = () => {
      const startX = Math.random() * canvas.width;
      const startY = canvas.height;
      const targetX = Math.random() * canvas.width;
      const targetY = Math.random() * (canvas.height * 0.6) + 50;

      fireworks.push(new Firework(startX, startY, targetX, targetY));
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.2) createFirework();

      fireworks.forEach((fw, i) => {
        fw.update(i);
        fw.draw();
      });

      particles.forEach((p, i) => {
        p.update(i);
        p.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const shootFireworks = () => {
    setFireworksStarted(true);
    setShowFireworks(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black relative overflow-hidden">
      {showFireworks && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: "transparent" }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        {!fireworksStarted ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl md:text-7xl mb-6 animate-bounce">🎆</div>
            <h2 className="text-3xl md:text-6xl font-bold mb-6 text-white">
              Ready for Sky Magic?
            </h2>
            <button
              onClick={shootFireworks}
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-8 py-3 rounded-3xl text-lg font-semibold shadow-xl hover:scale-105 active:scale-95 transition"
            >
              🎇 Shoot Fireworks 🎇
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-yellow-300 mb-6 drop-shadow-xl">
              Happy Birthday {user.name}! 🎂🎉
            </h1>
            <button
              onClick={onNext}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-3xl text-lg font-semibold shadow-xl hover:scale-105 active:scale-95 transition mt-6"
            >
              Let’s Cut the Cake! 🍰
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FireworksSection;

