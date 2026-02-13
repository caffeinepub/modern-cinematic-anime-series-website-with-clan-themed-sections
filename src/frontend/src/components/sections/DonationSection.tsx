import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { DollarSign, Heart } from 'lucide-react';

export function DonationSection() {
  const { ref, isVisible } = useRevealOnScroll();

  return (
    <section
      id="donation"
      ref={ref}
      className={`py-24 px-4 bg-gradient-to-b from-background via-background/95 to-background relative overflow-hidden ${
        isVisible ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Donation
            </span>
          </h2>
        </div>

        {/* Donation Content Card */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12 shadow-glow-lg hover:shadow-glow-xl transition-all duration-500">
          <div className="text-center space-y-6">
            {/* Moon Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-4xl">🌙</span>
              </div>
            </div>

            {/* Main Heading */}
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Support Whispers Of The White Moon
            </h3>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Help bring the story, animation, and characters to life.
              <br />
              Every donation helps support development, voice acting, art, and future episodes.
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 py-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <Heart className="w-5 h-5 text-primary" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Cash App Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-xl font-semibold text-foreground">
                <span className="text-2xl">🔥</span>
                <span>Donate Via Cash App</span>
              </div>

              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <DollarSign className="w-5 h-5" />
                <span className="text-lg">Send support to:</span>
              </div>

              {/* Cash App Handle */}
              <div className="inline-block bg-primary/10 border border-primary/30 rounded-xl px-8 py-4 hover:bg-primary/20 transition-colors duration-300">
                <div className="text-3xl font-bold text-primary tracking-wide">
                  $WOTWM
                </div>
              </div>

              <p className="text-sm text-muted-foreground/80 mt-4">
                Thank you for your support! 💙
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
