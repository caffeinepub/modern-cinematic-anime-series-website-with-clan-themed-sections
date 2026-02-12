import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Concept Art' | 'Fight Scenes' | 'Character Designs';
  src: string;
  alt: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
  onImageClick: (index: number) => void;
}

export function GalleryGrid({ items, onImageClick }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['Concept Art', 'Fight Scenes', 'Character Designs'] as const;

  // Derive available categories from items
  const availableCategories = categories.filter((cat) =>
    items.some((item) => item.category === cat)
  );

  const filteredItems =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory);

  // Hide tabs if there's only one item or only one category with items
  const showTabs = items.length > 1 && availableCategories.length > 1;

  return (
    <div className="w-full">
      {showTabs ? (
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => {
                const globalIndex = items.findIndex((gi) => gi.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onImageClick(globalIndex)}
                    className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:glow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-primary">{item.category}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onImageClick(index)}
              className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:glow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-primary">{item.category}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
