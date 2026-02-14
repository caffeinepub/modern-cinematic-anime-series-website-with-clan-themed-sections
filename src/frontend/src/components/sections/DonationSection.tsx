import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { DollarSign, Heart } from 'lucide-react';

export function DonationSection() {
  const { ref, isVisible } = useRevealOnScroll();

  const rewardTiers = [
    {
      emoji: '🌑',
      name: 'Moon Clan Supporter',
      range: '$1 to $5',
      benefits: ['Official Moon Clan Supporter title'],
    },
    {
      emoji: '🔥',
      name: 'Flame Warrior Supporter',
      range: '$6 to $15',
      benefits: [
        'Everything from Moon Clan tier',
        'Quicker contact responds',
        'Official Fire Clan Supporter title',
      ],
    },
    {
      emoji: '🌊',
      name: 'Water Guardian Supporter',
      range: '$16 to $30',
      benefits: [
        'User-Name secretly added to Anime',
        'Official Water Clan Supporter title',
      ],
    },
    {
      emoji: '☀️',
      name: 'Royal Sun Supporter',
      range: '$31 to $75',
      benefits: [
        'Everything from previous tiers',
        'User-Name listed in episode credits (Supporter Section)',
        'Added to anime (own Character)',
      ],
    },
    {
      emoji: '👑',
      name: 'Legendary Balance Supporter',
      range: '$76+',
      benefits: [
        'Everything from previous tiers',
        'Special thank-you message from the creator team',
        'Chance to have an important Anime character',
        'Ultimate supporter recognition',
      ],
    },
  ];

  return (
    <section
      id="donation"
      ref={ref}
      className={`py-24 px-4 relative overflow-hidden ${
        isVisible ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/thanks!.png)' }}
      />

      {/* Dark Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />

      {/* Background glow effects - light green */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Section Title - light green */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-300 via-green-400 to-green-300 bg-clip-text text-transparent">
              Donation
            </span>
          </h2>
        </div>

        {/* Donation Content Card - light green border/background */}
        <div className="bg-card/50 backdrop-blur-sm border border-green-500/40 rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(134,239,172,0.15)] hover:shadow-[0_0_50px_rgba(134,239,172,0.25)] transition-all duration-500">
          <div className="text-center space-y-6">
            {/* Moon Icon - light green background */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center">
                <span className="text-4xl">🌙</span>
              </div>
            </div>

            {/* Main Heading - light green */}
            <h3 className="text-2xl md:text-3xl font-bold text-green-300">
              Support Whispers Of The White Moon
            </h3>

            {/* Description - light green */}
            <p className="text-lg text-green-200/90 leading-relaxed max-w-2xl mx-auto">
              Help bring the story, animation, and characters to life.
              <br />
              Every donation helps support development, voice acting, art, and future episodes.
            </p>

            {/* Supporter Message - light green */}
            <p className="text-base text-green-200/80 leading-relaxed max-w-2xl mx-auto pt-2">
              Every supporter becomes part of the Whispers Of The White Moon journey.
              <br />
              Choose your tier and help shape the story.
            </p>

            {/* Divider - light green */}
            <div className="flex items-center gap-4 py-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
              <Heart className="w-5 h-5 text-green-400" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
            </div>

            {/* Cash App Section - light green */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-xl font-semibold text-green-300">
                <span className="text-2xl">🔥</span>
                <span>Donate Via Cash App</span>
              </div>

              <div className="flex items-center justify-center gap-3 text-green-200/90">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-lg">Send support to:</span>
              </div>

              {/* Cash App Handle - light green border/background */}
              <div className="inline-block bg-green-400/10 border border-green-500/40 rounded-xl px-8 py-4 hover:bg-green-400/20 transition-colors duration-300">
                <div className="text-3xl font-bold text-green-300 tracking-wide">
                  $WOTWM
                </div>
              </div>

              <p className="text-sm text-green-200/70 mt-4">
                Thank you for your support! 💙
              </p>
            </div>
          </div>
        </div>

        {/* Rewards Section - light green */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-green-300 via-green-400 to-green-300 bg-clip-text text-transparent">
              Rewards
            </span>
          </h3>

          <div className="space-y-6">
            {rewardTiers.map((tier, index) => (
              <div
                key={index}
                className="bg-card/40 backdrop-blur-sm border border-green-500/40 rounded-xl p-6 shadow-[0_0_20px_rgba(134,239,172,0.1)] hover:shadow-[0_0_35px_rgba(134,239,172,0.2)] hover:border-green-500/60 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Emoji Icon - light green background */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-400/15 flex items-center justify-center text-2xl">
                    {tier.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h4 className="text-xl font-bold text-green-300">
                        {tier.name}
                      </h4>
                      <span className="text-lg font-semibold text-green-400">
                        {tier.range}
                      </span>
                    </div>

                    {/* Benefits List - light green */}
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <li
                          key={benefitIndex}
                          className="text-green-200/85 flex items-start gap-2"
                        >
                          <span className="text-green-400 mt-1">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
