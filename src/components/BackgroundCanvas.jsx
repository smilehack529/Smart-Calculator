import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas({ triggerEffect }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = [
      '#38bdf8', // Neon Cyan
      '#ec4899', // Cyber Pink
      '#818cf8', // Indigo Glow
      '#a855f7', // Electric Purple
      '#10b981', // Emerald Green
      '#f59e0b', // Amber Gold
      '#22d3ee', // Bright Turquoise
      '#f472b6', // Light Pink
    ];

    // Particle array - larger count, colorful, and higher speed
    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 12000), 70);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3.5 + 2.5, // Larger size: 2.5px - 6px
        vx: (Math.random() - 0.5) * 2.2,   // Faster velocity (x direction)
        vy: (Math.random() - 0.5) * 2.2,   // Faster velocity (y direction)
        alpha: Math.random() * 0.6 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2,
      });
    }

    // Dynamic colorful shockwave ripples on keypress
    const ripples = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render colorful fast floating particles with glow
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Size pulsation effect
        p.pulseAngle += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.pulseAngle) * 0.8;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        
        // Add neon ambient glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      });

      // Render shockwave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.025;

        if (r.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.shadowBlur = 15;
        ctx.shadowColor = r.color;
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Spawn vibrant shockwave ripple on button tap
    if (triggerEffect) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      ripples.push({
        x: width / 2 + (Math.random() - 0.5) * (width * 0.4),
        y: height / 2 + (Math.random() - 0.5) * (height * 0.4),
        radius: 8,
        speed: 6,
        alpha: 0.85,
        color: randomColor,
      });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [triggerEffect]);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}
