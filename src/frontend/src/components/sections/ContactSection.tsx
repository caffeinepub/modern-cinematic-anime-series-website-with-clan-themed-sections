import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { Mail, User, Link as LinkIcon, Clock, Users, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FanMailForm } from './FanMailForm';

export function ContactSection() {
  const { ref, isVisible } = useRevealOnScroll();

  return (
    <section
      id="contact"
      ref={ref}
      className={`py-24 px-4 relative overflow-hidden ${
        isVisible ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Contact
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with the Whispers Of The White Moon team
          </p>
        </div>

        <div className="space-y-12">
          {/* Fan Mail Section */}
          <FanMailForm />

          {/* Contact Information */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-10 shadow-glow hover:shadow-glow-lg transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Contact Information</h3>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">Name</div>
                  <div className="text-lg text-foreground">Your Name</div>
                </div>
              </div>

              {/* Email Field */}
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">Email</div>
                  <div className="text-lg text-foreground">your.email@example.com</div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="flex items-start gap-4">
                <LinkIcon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">
                    Optional Social Media Links
                  </div>
                  <div className="text-lg text-foreground">
                    Twitter, Instagram, Discord, etc.
                  </div>
                </div>
              </div>

              {/* Response Time Note */}
              <div className="flex items-start gap-3 mt-6 pt-6 border-t border-border">
                <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-accent">Response Time:</span> Replies may take 24–72 hours
                </p>
              </div>
            </div>
          </div>

          {/* Collaboration Section */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-10 shadow-glow hover:shadow-glow-lg transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Collaboration</h3>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-foreground leading-relaxed">
                We're looking for talented individuals to join the Whispers Of The White Moon project!
              </p>

              <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
                <p className="text-base text-foreground/90 mb-4">
                  <span className="font-semibold text-accent">We're inviting:</span>
                </p>
                <ul className="space-y-2 text-foreground/85">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><span className="font-semibold">Voice Actors</span> – Bring characters to life</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><span className="font-semibold">Artists</span> – Create stunning visuals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><span className="font-semibold">Animators</span> – Animate epic scenes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><span className="font-semibold">Musicians</span> – Compose memorable soundtracks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span><span className="font-semibold">Writers</span> – Craft compelling stories</span>
                  </li>
                </ul>
              </div>

              <Alert className="bg-primary/10 border-primary/30">
                <AlertDescription className="text-foreground/90">
                  <span className="font-semibold">Please include:</span> Your experience and skills when messaging us. Share your portfolio, previous work, or relevant background to help us understand how you can contribute to the project.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Supporter Help Section */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-10 shadow-glow hover:shadow-glow-lg transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Supporter Help</h3>
            </div>

            <div className="space-y-4">
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="font-semibold">
                  This section is ONLY for supporters who donated and didn't receive their reward.
                </AlertDescription>
              </Alert>

              <p className="text-base text-foreground/90 leading-relaxed">
                If you've donated and haven't received your supporter rewards, please contact us with the following information:
              </p>

              <div className="bg-muted/30 border border-border rounded-xl p-6">
                <ul className="space-y-3 text-foreground/85">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">1.</span>
                    <div>
                      <span className="font-semibold text-foreground">Username</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your Cash App username or the name you used when donating
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">2.</span>
                    <div>
                      <span className="font-semibold text-foreground">Donation or Supporter Tier</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        The amount you donated and which tier you qualify for
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">3.</span>
                    <div>
                      <span className="font-semibold text-foreground">Reward Questions or Requests</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Specific details about the reward you're missing or any questions
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                We'll work to resolve your issue as quickly as possible. Thank you for your patience and support!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
