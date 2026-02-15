import { Swords, Shield, Zap } from 'lucide-react';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { GlowingGlassPanel } from '../common/GlowingGlassPanel';

export function AboutSection() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();
  const { ref: cardsRef, isVisible: cardsVisible } = useRevealOnScroll({ threshold: 0.2 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const features = [
    {
      icon: Swords,
      title: 'Epic Battles',
      description: 'Witness breathtaking combat sequences as clans clash in spectacular elemental warfare.'
    },
    {
      icon: Shield,
      title: 'Ancient Lore',
      description: 'Uncover centuries of hidden history and the secrets that bind the seven clans together.'
    },
    {
      icon: Zap,
      title: 'Elemental Powers',
      description: 'Experience the raw force of nature as warriors harness fire, water, lightning, and more.'
    }
  ];

  return (
    <section id="about" className="relative py-32 md:py-40 layered-bg overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={sectionRef}
          className={`max-w-4xl mx-auto text-center mb-20 transition-all duration-800 ${
            !prefersReducedMotion && isVisible ? 'animate-fade-in-up' : isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className={`text-5xl md:text-7xl font-black mb-8 ${!prefersReducedMotion ? 'text-glow' : ''}`}>
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Story
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
            In a world where elemental powers shape destiny, seven ancient clans have maintained balance for millennia. But when a dark force threatens to consume all realms, warriors from each clan must unite or watch their world fall into eternal darkness.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlowingGlassPanel
                key={feature.title}
                className={`group p-10 transition-all duration-500 ${
                  !prefersReducedMotion && cardsVisible ? 'animate-fade-scale' : cardsVisible ? 'opacity-100' : 'opacity-0'
                } ${!prefersReducedMotion ? 'hover:shadow-glow-lg hover:scale-105' : ''}`}
                style={{
                  animationDelay: !prefersReducedMotion ? `${index * 0.2}s` : '0s'
                }}
              >
                {/* Inner glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-8 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-500 ${!prefersReducedMotion ? 'group-hover:scale-110 shadow-inner-glow' : ''}`}>
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ${!prefersReducedMotion ? 'group-hover:h-2' : ''}`} />
              </GlowingGlassPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
}
