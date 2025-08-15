/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Heart, MapPin, Star, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import { Deck, DeckCard, DeckInfo, useDeck } from '@repo/design-system/ui/deck';

/**
 * A Tinder-like swipeable card stack component with smooth animations and drag support.
 */
const meta: Meta<typeof Deck> = {
  title: 'ui/Deck',
  component: Deck,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    swipeThreshold: {
      control: { type: 'number' },
      description: 'Minimum distance to trigger a swipe',
    },
    stackSize: {
      control: { type: 'number' },
      description: 'Number of cards visible in the stack',
    },
    perspective: {
      control: { type: 'number' },
      description: 'CSS perspective for 3D effect',
    },
    scaling: {
      control: { type: 'number' },
      description: 'Scale factor for stacked cards',
    },
    showControls: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample card data
const profileCards = [
  {
    id: 1,
    name: 'Sarah Johnson',
    age: 28,
    location: 'San Francisco, CA',
    bio: 'Adventure seeker, coffee enthusiast, and dog lover. Always up for hiking or trying new restaurants!',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616c88c6d3d?w=400&h=600&fit=crop&crop=face',
    interests: ['Photography', 'Travel', 'Yoga'],
  },
  {
    id: 2,
    name: 'Mike Chen',
    age: 32,
    location: 'New York, NY',
    bio: 'Tech entrepreneur by day, chef by night. Love building things and cooking for friends.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
    interests: ['Cooking', 'Technology', 'Basketball'],
  },
  {
    id: 3,
    name: 'Emma Wilson',
    age: 26,
    location: 'Austin, TX',
    bio: "Artist and designer with a passion for sustainable living. Let's create something beautiful together!",
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
    interests: ['Art', 'Design', 'Sustainability'],
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    age: 30,
    location: 'Denver, CO',
    bio: 'Mountain climber and outdoor guide. Life is better with fresh air and good company.',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
    interests: ['Climbing', 'Hiking', 'Photography'],
  },
  {
    id: 5,
    name: 'Lisa Park',
    age: 29,
    location: 'Seattle, WA',
    bio: 'Software engineer who loves books, board games, and rainy days. Always learning something new.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
    interests: ['Reading', 'Gaming', 'Learning'],
  },
];

const productCards = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: '$299',
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    description:
      'Premium noise-canceling headphones with 30-hour battery life.',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: '$399',
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    description:
      'Advanced fitness tracking with heart rate monitoring and GPS.',
  },
  {
    id: 3,
    name: 'Laptop Stand',
    price: '$79',
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    description:
      'Ergonomic aluminum stand for better posture and productivity.',
  },
];

const simpleCards = [
  {
    id: 1,
    title: 'Card 1',
    content: 'Swipe or use buttons',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Card 2',
    content: 'Swipe or use buttons',
    color: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Card 3',
    content: 'Swipe or use buttons',
    color: 'bg-purple-500',
  },
  {
    id: 4,
    title: 'Card 4',
    content: 'Swipe or use buttons',
    color: 'bg-red-500',
  },
  {
    id: 5,
    title: 'Card 5',
    content: 'Swipe or use buttons',
    color: 'bg-yellow-500',
  },
];

// Profile Card Component
const ProfileCard = ({ profile }: { profile: (typeof profileCards)[0] }) => (
  <DeckCard className="bg-white">
    <div className="relative h-full">
      <Image
        src={profile.image}
        alt={profile.name}
        className="h-2/3 w-full object-cover"
        width={400}
        height={600}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-bold text-2xl">{profile.name}</h3>
          <span className="text-xl">{profile.age}</span>
        </div>

        <div className="mb-3 flex items-center gap-1 text-white/80">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{profile.location}</span>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-white/90">{profile.bio}</p>

        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-white/20 px-2 py-1 text-xs"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  </DeckCard>
);

// Product Card Component
const ProductCard = ({ product }: { product: (typeof productCards)[0] }) => (
  <DeckCard className="bg-white">
    <div className="flex h-full flex-col">
      <Image
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover"
        width={400}
        height={300}
      />

      <div className="flex-1 p-6">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-bold text-gray-900 text-xl">{product.name}</h3>
          <span className="font-semibold text-lg text-primary">
            {product.price}
          </span>
        </div>

        <div className="mb-3 flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-gray-600 text-sm">{product.rating}</span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  </DeckCard>
);

// Simple Card Component
const SimpleCard = ({ card }: { card: (typeof simpleCards)[0] }) => (
  <DeckCard className={`${card.color} text-white`}>
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-4 font-bold text-3xl">{card.title}</h2>
      <p className="text-lg opacity-90">{card.content}</p>
    </div>
  </DeckCard>
);

export const Default: Story = {
  args: {
    cards: simpleCards.map((card) => <SimpleCard key={card.id} card={card} />),
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4 font-medium text-sm">Small</h4>
        <Deck
          size="sm"
          cards={simpleCards
            .slice(0, 3)
            .map((card) => <SimpleCard key={card.id} card={card} />)}
        />
      </div>

      <div>
        <h4 className="mb-4 font-medium text-sm">Medium</h4>
        <Deck
          size="md"
          cards={simpleCards
            .slice(0, 3)
            .map((card) => <SimpleCard key={card.id} card={card} />)}
        />
      </div>

      <div>
        <h4 className="mb-4 font-medium text-sm">Large</h4>
        <Deck
          size="lg"
          cards={simpleCards
            .slice(0, 3)
            .map((card) => <SimpleCard key={card.id} card={card} />)}
        />
      </div>
    </div>
  ),
};

export const WithControls: Story = {
  args: {
    cards: simpleCards.map((card) => <SimpleCard key={card.id} card={card} />),
    showControls: true,
  },
};

export const ProfileCards: Story = {
  args: {
    cards: profileCards.map((profile) => (
      <ProfileCard key={profile.id} profile={profile} />
    )),
    showControls: true,
  },
};

export const ProductCards: Story = {
  args: {
    cards: productCards.map((product) => (
      <ProductCard key={product.id} product={product} />
    )),
    showControls: true,
    size: 'lg',
  },
};

export const CustomSettings: Story = {
  args: {
    cards: simpleCards.map((card) => <SimpleCard key={card.id} card={card} />),
    swipeThreshold: 50,
    stackSize: 5,
    scaling: 0.9,
    perspective: 1500,
    showControls: true,
  },
};

export const SingleCard: Story = {
  args: {
    cards: [<SimpleCard key={simpleCards[0].id} card={simpleCards[0]} />],
    showControls: true,
  },
};

export const EmptyDeck: Story = {
  args: {
    cards: [],
  },
};

export const Controlled: Story = {
  render: () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeHistory, setSwipeHistory] = useState<
      Array<{ direction: 'left' | 'right'; card: string }>
    >([]);

    const handleSwipe = (direction: 'left' | 'right', cardIndex: number) => {
      const card = simpleCards[cardIndex];
      setSwipeHistory((prev) => [...prev, { direction, card: card.title }]);
    };

    const handleIndexChange = (index: number) => {
      setCurrentIndex(index);
    };

    const resetDeck = () => {
      setCurrentIndex(0);
      setSwipeHistory([]);
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <DeckInfo />
          <div className="mt-2">
            <Button
              onClick={resetDeck}
              className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Reset Deck
            </Button>
          </div>
        </div>

        <Deck
          cards={simpleCards.map((card) => (
            <SimpleCard key={card.id} card={card} />
          ))}
          currentIndex={currentIndex}
          onSwipe={handleSwipe}
          onIndexChange={handleIndexChange}
          showControls={true}
        />

        {swipeHistory.length > 0 && (
          <div className="mx-auto max-w-md">
            <h4 className="mb-2 font-medium">Swipe History:</h4>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {swipeHistory.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {entry.direction === 'left' ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <Heart className="h-4 w-4 text-green-500" />
                  )}
                  <span>{entry.card}</span>
                  <span className="text-muted-foreground">
                    ({entry.direction})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [likes, setLikes] = useState<string[]>([]);
    const [passes, setPasses] = useState<string[]>([]);

    const handleSwipe = (direction: 'left' | 'right', cardIndex: number) => {
      const profile = profileCards[cardIndex];
      if (direction === 'right') {
        setLikes((prev) => [...prev, profile.name]);
      } else {
        setPasses((prev) => [...prev, profile.name]);
      }
    };

    return (
      <div className="space-y-6">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-4 text-center">
          <div className="rounded-lg bg-green-50 p-3">
            <div className="mb-1 flex items-center justify-center gap-1">
              <Heart className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Likes</span>
            </div>
            <div className="font-bold text-2xl text-green-600">
              {likes.length}
            </div>
          </div>

          <div className="rounded-lg bg-red-50 p-3">
            <div className="mb-1 flex items-center justify-center gap-1">
              <X className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">Passes</span>
            </div>
            <div className="font-bold text-2xl text-red-600">
              {passes.length}
            </div>
          </div>
        </div>

        <Deck
          cards={profileCards.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
          onSwipe={handleSwipe}
          showControls={true}
        />

        {(likes.length > 0 || passes.length > 0) && (
          <div className="mx-auto max-w-md space-y-3">
            {likes.length > 0 && (
              <div>
                <h4 className="mb-1 font-medium text-green-800">Liked:</h4>
                <div className="flex flex-wrap gap-1">
                  {likes.map((name, index) => (
                    <span
                      key={index}
                      className="rounded bg-green-100 px-2 py-1 text-green-800 text-sm"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {passes.length > 0 && (
              <div>
                <h4 className="mb-1 font-medium text-red-800">Passed:</h4>
                <div className="flex flex-wrap gap-1">
                  {passes.map((name, index) => (
                    <span
                      key={index}
                      className="rounded bg-red-100 px-2 py-1 text-red-800 text-sm"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
};

const DeckContextInfo = () => {
  const { currentIndex, totalCards, swipeDirection, isAnimating } = useDeck();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Current Index:</span>
          <div>{currentIndex}</div>
        </div>
        <div>
          <span className="font-medium">Total Cards:</span>
          <div>{totalCards}</div>
        </div>
        <div>
          <span className="font-medium">Swipe Direction:</span>
          <div>{swipeDirection || 'None'}</div>
        </div>
        <div>
          <span className="font-medium">Animating:</span>
          <div>{isAnimating ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
};

export const WithContext: Story = {
  render: () => (
    <Deck
      cards={simpleCards.map((card) => (
        <SimpleCard key={card.id} card={card} />
      ))}
      showControls
    >
      <DeckContextInfo />
    </Deck>
  ),
};
