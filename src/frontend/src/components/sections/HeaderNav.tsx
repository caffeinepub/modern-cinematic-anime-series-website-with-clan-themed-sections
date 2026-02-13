import { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'Story' },
    { href: '#characters', label: 'Characters' },
    { href: '#clans', label: 'Clans' },
    { href: '#episodes', label: 'Episodes' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#news', label: 'News' },
    { href: '#donation', label: 'Donation' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-glow'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <button
            onClick={() => scrollToSection('#hero')}
            className="text-2xl font-black tracking-tight hover:scale-105 transition-transform duration-300"
          >
            <span className="bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
              Whispers Of The White Moon
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-foreground/80 hover:text-primary font-semibold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            {identity && isAdmin && (
              <button
                onClick={navigateToAdmin}
                className="flex items-center gap-2 text-foreground/80 hover:text-primary font-semibold transition-colors duration-300 relative group"
              >
                <Shield className="w-4 h-4" />
                Admin
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border bg-card/95 backdrop-blur-xl rounded-lg">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-foreground/80 hover:text-primary font-semibold transition-colors duration-300 text-left px-4 py-2 hover:bg-primary/10 rounded"
                >
                  {link.label}
                </button>
              ))}
              {identity && isAdmin && (
                <button
                  onClick={navigateToAdmin}
                  className="flex items-center gap-2 text-foreground/80 hover:text-primary font-semibold transition-colors duration-300 text-left px-4 py-2 hover:bg-primary/10 rounded"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
