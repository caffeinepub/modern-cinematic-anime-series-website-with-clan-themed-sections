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
import { ContactSection } from './components/sections/ContactSection';
import { ClanPersonalityQuizSection } from './components/sections/ClanPersonalityQuizSection';
import { CharacterAffinityMatcherSection } from './components/sections/CharacterAffinityMatcherSection';
import { PowerSystemDatabaseSection } from './components/sections/PowerSystemDatabaseSection';
import { SecretVaultSection } from './components/secrets/SecretVaultSection';
import { Footer } from './components/sections/Footer';
import { AdminAccessGate } from './components/admin/AdminAccessGate';
import { ProModeGate } from './components/pro/ProModeGate';
import { ProPresentationSection } from './components/pro/ProPresentationSection';
import { ProToolbar } from './components/pro/ProToolbar';

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'admin' | 'pro' | 'secret'>('main');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
      } else if (hash === '#pro') {
        setCurrentView('pro');
      } else if (hash === '#vault') {
        setCurrentView('secret');
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
            <ClanPersonalityQuizSection />
            <CharacterAffinityMatcherSection />
            <PowerSystemDatabaseSection />
            <DonationSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      </ProModeGate>
    );
  }

  if (currentView === 'secret') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <HeaderNav />
        <main>
          <SecretVaultSection />
        </main>
        <Footer />
      </div>
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
        <ClanPersonalityQuizSection />
        <CharacterAffinityMatcherSection />
        <PowerSystemDatabaseSection />
        <DonationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
