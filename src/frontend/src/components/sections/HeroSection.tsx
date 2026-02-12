import { Sparkles, Play } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useParallax } from '../../hooks/useParallax';
import { useEffect, useRef } from 'react';

export function HeroSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const parallaxRef = useParallax({ speed: 0.5, maxOffset: 100 });
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !particlesRef.current) return;

    const particles = particlesRef.current;
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full bg-primary/20 animate-particle-float';
      
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
      particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${6 + Math.random() * 4}s`;
      
      particles.appendChild(particle);
    }

    return () => {
      particles.innerHTML = '';
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden vignette"
    >
      {/* Animated particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      {/* Background Image with Parallax */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
          top: '-15%',
          height: '130%',
          filter: 'brightness(0.7) contrast(1.1)'
        }}
      />

      {/* Layered gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      
      {/* Radial glow effects */}
      <div className="absolute inset-0 gradient-radial opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <div className={`max-w-5xl mx-auto ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 bg-primary/15 border-2 border-primary/40 rounded-full mb-10 backdrop-blur-md ${!prefersReducedMotion ? 'shadow-glow animate-glow-pulse' : ''}`}>
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold tracking-wider uppercase text-primary">New Epic Series</span>
          </div>

          {/* Main Title */}
          <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.95] ${!prefersReducedMotion ? 'text-glow' : ''}`}>
            <span className="block bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent drop-shadow-2xl">
              Whispers Of The
            </span>
            <span className="block bg-gradient-to-r from-accent via-foreground to-primary bg-clip-text text-transparent drop-shadow-2xl mt-2">
              White Moon
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-3xl text-foreground/90 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
            Seven ancient clans. One destiny. When the balance of power shatters, only the chosen can restore harmony to the realm.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              className={`group relative px-10 py-5 bg-primary text-primary-foreground rounded-lg font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
                !prefersReducedMotion ? 'shadow-glow-lg hover:shadow-glow-xl animate-glow-pulse-strong' : ''
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play className="w-6 h-6 fill-current" />
                Watch Trailer
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${!prefersReducedMotion ? 'animate-shimmer' : ''}`} 
                   style={{ backgroundSize: '200% 100%' }} />
            </button>
            
            <button
              className={`group relative px-10 py-5 bg-accent text-accent-foreground rounded-lg font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
                !prefersReducedMotion ? 'shadow-glow-accent-lg hover:shadow-glow-accent-xl' : ''
              }`}
              onClick={() => {
                const element = document.getElementById('clans');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                Explore Clans
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent/80 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Scroll indicator */}
          <div className={`mt-20 ${!prefersReducedMotion ? 'animate-float' : ''}`}>
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full mx-auto relative">
              <div className={`w-1.5 h-3 bg-primary rounded-full absolute left-1/2 top-2 -translate-x-1/2 ${!prefersReducedMotion ? 'animate-bounce' : ''}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom dramatic fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
  );
}
