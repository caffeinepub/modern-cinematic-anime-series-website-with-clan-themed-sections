import { useEffect, useState } from 'react';
import { HeaderNav } from './components/sections/HeaderNav';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { CharactersSection } from './components/sections/CharactersSection';
import { ClansSection } from './components/sections/ClansSection';
import { EpisodesSection } from './components/sections/EpisodesSection';
import { GallerySection } from './components/sections/GallerySection';
import { NewsUpdatesSection } from './components/sections/NewsUpdatesSection';
import { DonationSection } from './components/sections/DonationSection';
import { Footer } from './components/sections/Footer';
import { AdminAccessGate } from './components/admin/AdminAccessGate';
import { ProModeGate } from './components/pro/ProModeGate';
import { ProPresentationSection } from './components/pro/ProPresentationSection';
import { ProToolbar } from './components/pro/ProToolbar';

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'admin' | 'pro'>('main');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
      } else if (hash === '#pro') {
        setCurrentView('pro');
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

  if (currentView === 'pro') {
    return (
      <ProModeGate>
        <div className="min-h-screen bg-background text-foreground">
          <ProToolbar />
          <HeaderNav />
          <main>
            <HeroSection />
            <AboutSection />
            <ProPresentationSection isProMode={true} />
            <CharactersSection />
            <ClansSection />
            <EpisodesSection />
            <GallerySection />
            <NewsUpdatesSection />
            <DonationSection />
          </main>
          <Footer />
        </div>
      </ProModeGate>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderNav />
      <main>
        <HeroSection />
        <AboutSection />
        <ProPresentationSection isProMode={false} />
        <CharactersSection />
        <ClansSection />
        <EpisodesSection />
        <GallerySection />
        <NewsUpdatesSection />
        <DonationSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
