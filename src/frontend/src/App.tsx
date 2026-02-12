import { useEffect, useState } from 'react';
import { HeaderNav } from './components/sections/HeaderNav';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { CharactersSection } from './components/sections/CharactersSection';
import { ClansSection } from './components/sections/ClansSection';
import { EpisodesSection } from './components/sections/EpisodesSection';
import { GallerySection } from './components/sections/GallerySection';
import { NewsUpdatesSection } from './components/sections/NewsUpdatesSection';
import { Footer } from './components/sections/Footer';
import { AdminAccessGate } from './components/admin/AdminAccessGate';

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'admin'>('main');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('main');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AdminAccessGate />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderNav />
      <main>
        <HeroSection />
        <AboutSection />
        <CharactersSection />
        <ClansSection />
        <EpisodesSection />
        <GallerySection />
        <NewsUpdatesSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
