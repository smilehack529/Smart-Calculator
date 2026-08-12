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

    // Particle array
    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 50);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Dynamic ripples on button press
    const ripples = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha})`;
        ctx.fill();
      });

      // Render ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.02;

        if (r.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${r.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Trigger ripple on canvas when user presses keys
    if (triggerEffect) {
      ripples.push({
        x: width / 2 + (Math.random() - 0.5) * 200,
        y: height / 2 + (Math.random() - 0.5) * 100,
        radius: 10,
        speed: 4,
        alpha: 0.7,
      });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [triggerEffect]);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}
