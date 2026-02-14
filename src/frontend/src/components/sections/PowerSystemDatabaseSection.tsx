import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Search, Zap, Shield, Skull, Users } from 'lucide-react';
import { powerTypes, abilityRules, forbiddenTechniques, characterAbilities } from '../../data/powerSystemDatabase';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function PowerSystemDatabaseSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const { ref: sectionRef, isVisible } = useRevealOnScroll({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const filteredCharacters = characterAbilities.filter(char =>
    char.characterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.clanAffiliation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.abilities.some(ability => ability.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section
      id="powers"
      ref={sectionRef}
      className={`relative py-24 overflow-hidden transition-all duration-600 ${
        !prefersReducedMotion && isVisible ? 'animate-fade-in-up' : isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Master the Arts</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-glow">
            Power System Database
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the abilities, rules, and forbidden techniques of the seven clans
          </p>
        </div>

        {/* Database Content */}
        <Tabs defaultValue="types" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="types" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Power Types</span>
              <span className="sm:hidden">Types</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Rules & Limits</span>
              <span className="sm:hidden">Rules</span>
            </TabsTrigger>
            <TabsTrigger value="forbidden" className="gap-2">
              <Skull className="w-4 h-4" />
              <span className="hidden sm:inline">Forbidden</span>
              <span className="sm:hidden">Forbidden</span>
            </TabsTrigger>
            <TabsTrigger value="characters" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Characters</span>
              <span className="sm:hidden">Chars</span>
            </TabsTrigger>
          </TabsList>

          {/* Power Types Tab */}
          <TabsContent value="types" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {powerTypes.map((type) => (
                <Card key={type.id} className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">
                      {type.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/90">{type.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {type.examples.map((example, idx) => (
                          <Badge key={idx} variant="secondary">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rules & Limits Tab */}
          <TabsContent value="rules">
            <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Ability Rules and Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {abilityRules.map((rule) => (
                    <AccordionItem key={rule.id} value={rule.id}>
                      <AccordionTrigger className="text-left font-semibold">
                        {rule.title}
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/90">
                        {rule.description}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forbidden Techniques Tab */}
          <TabsContent value="forbidden" className="space-y-6">
            <Card className="border-2 border-destructive/30 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-destructive/10 p-2 rounded-full">
                    <Skull className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-destructive">
                      Forbidden Techniques
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      These techniques are outlawed and punishable by death
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {forbiddenTechniques.map((technique) => (
                  <div key={technique.id} className="border-l-4 border-destructive/50 pl-4 space-y-2">
                    <h3 className="text-xl font-bold text-destructive">{technique.name}</h3>
                    <p className="text-foreground/90">{technique.description}</p>
                    <div className="bg-destructive/10 p-3 rounded-lg">
                      <p className="text-sm text-foreground/80">
                        <strong className="text-destructive">Why it's forbidden:</strong> {technique.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Characters Tab */}
          <TabsContent value="characters" className="space-y-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search characters, clans, or abilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredCharacters.map((character) => (
                <Card key={character.characterName} className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {character.characterName}
                        </CardTitle>
                        <Badge variant="outline" className="mt-2">
                          {character.clanAffiliation}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Abilities:</h4>
                      <div className="flex flex-wrap gap-2">
                        {character.abilities.map((ability, idx) => (
                          <Badge key={idx} variant="secondary">
                            {ability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {character.specialTechnique && (
                      <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-sm text-primary mb-1">Special Technique:</h4>
                        <p className="text-sm text-foreground/90">{character.specialTechnique}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCharacters.length === 0 && (
              <Card className="border-2 border-muted bg-card/95 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No characters found matching your search.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
