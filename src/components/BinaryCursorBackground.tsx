"use client";

import { useEffect, useRef } from "react";

type Bit = { x: number; y: number; vx: number; vy: number; born: number; digit: string };

export default function BinaryCursorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let bits: Bit[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let lastSpawn = 0;
    let previous: { x: number; y: number } | null = null;

    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      bits = [];
      previous = null;
      context.clearRect(0, 0, width, height);
    };
    const resize = () => {
      clear();
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = (now: number) => {
      frame = 0;
      context.clearRect(0, 0, width, height);
      bits = bits.filter(bit => now - bit.born < 1100);
      context.font = "12px ui-monospace, monospace";
      context.textAlign = "center";
      for (const bit of bits) {
        const age = (now - bit.born) / 1100;
        const x = bit.x + bit.vx * age;
        const y = bit.y + bit.vy * age;
        context.fillStyle = `rgba(129, 140, 248, ${0.48 * (1 - age) ** 2})`;
        context.fillText(bit.digit, x, y);
      }
      if (bits.length) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (motion.matches || !pointer.matches || event.pointerType === "touch" || document.hidden) return;
      const now = performance.now();
      if (now - lastSpawn < 24) return;
      lastSpawn = now;
      const dx = previous ? event.clientX - previous.x : 0;
      const dy = previous ? event.clientY - previous.y : 0;
      previous = { x: event.clientX, y: event.clientY };
      for (let i = 0; i < 3; i++) {
        bits.push({
          x: event.clientX + (Math.random() - 0.5) * 56,
          y: event.clientY + (Math.random() - 0.5) * 48,
          vx: -Math.max(-25, Math.min(25, dx)) + (Math.random() - 0.5) * 30,
          vy: -Math.max(-25, Math.min(25, dy)) - 25 - Math.random() * 25,
          born: now,
          digit: Math.random() > 0.5 ? "1" : "0",
        });
      }
      bits = bits.slice(-120);
      if (!frame) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    motion.addEventListener("change", clear);
    pointer.addEventListener("change", clear);
    return () => {
      clear();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
      motion.removeEventListener("change", clear);
      pointer.removeEventListener("change", clear);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
