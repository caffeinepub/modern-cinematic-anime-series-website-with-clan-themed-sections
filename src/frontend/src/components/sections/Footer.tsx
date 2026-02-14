import { SiX, SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';
import { Heart } from 'lucide-react';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'whispers-of-the-white-moon';
  const { ref: footerRef, isVisible } = useRevealOnScroll({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <footer
      ref={footerRef}
      className={`relative bg-card border-t border-border py-12 transition-all duration-600 ${
        !prefersReducedMotion && isVisible ? 'animate-fade-in-up' : isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Whispers Of The White Moon
            </h3>
            <p className="text-muted-foreground text-sm">
              Experience the epic tale of seven clans united by destiny, divided by power.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('hero');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-primary transition-colors duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('about');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-primary transition-colors duration-300"
                >
                  Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('clans');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-primary transition-colors duration-300"
                >
                  Clans
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('quiz');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-primary transition-colors duration-300"
                >
                  Clan Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('powers');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-primary transition-colors duration-300"
                >
                  Power System
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className={`w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 ${
                  !prefersReducedMotion ? 'hover:shadow-glow' : ''
                }`}
                aria-label="X (Twitter)"
              >
                <SiX size={18} />
              </a>
              <a
                href="#"
                className={`w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 ${
                  !prefersReducedMotion ? 'hover:shadow-glow' : ''
                }`}
                aria-label="Facebook"
              >
                <SiFacebook size={18} />
              </a>
              <a
                href="#"
                className={`w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 ${
                  !prefersReducedMotion ? 'hover:shadow-glow' : ''
                }`}
                aria-label="Instagram"
              >
                <SiInstagram size={18} />
              </a>
              <a
                href="#"
                className={`w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 ${
                  !prefersReducedMotion ? 'hover:shadow-glow' : ''
                }`}
                aria-label="YouTube"
              >
                <SiYoutube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Whispers Of The White Moon. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-destructive fill-destructive" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors duration-300"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

