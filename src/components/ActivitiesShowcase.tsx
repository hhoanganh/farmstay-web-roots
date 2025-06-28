
// ABOUTME: This component showcases the farm's core activities.
// ABOUTME: It presents static, informational content about farm experiences.

import ActivityBlock from './ActivityBlock';

const ActivitiesShowcase = () => {
  const activities = [
    {
      id: '1',
      title: 'Highland Coffee Experience',
      description: 'Join me in the early morning hours as we walk through our coffee grove. You\'ll learn about the unique growing conditions of our highland climate, how we hand-pick the ripest cherries, and the careful process of preparing our beans. We end with a cupping session, tasting the fruits of our labor together.',
      imageUrl: 'https://ik.imagekit.io/offvxi40h/coffee-experience.jpg?tr=w-400,q-80',
      altText: 'Coffee cherries being hand-picked in the highland grove'
    },
    {
      id: '2',
      title: 'Farm-to-Table Cooking',
      description: 'Our kitchen becomes a classroom where we transform fresh ingredients from our garden into traditional Vietnamese dishes. I\'ll share family recipes passed down through generations, and you\'ll discover how the highland terroir influences the flavors of our vegetables, herbs, and fruits.',
      imageUrl: 'https://ik.imagekit.io/offvxi40h/cooking-class.jpg?tr=w-400,q-80',
      altText: 'Traditional Vietnamese cooking using fresh farm ingredients'
    },
    {
      id: '3',
      title: 'Mindful Garden Walks',
      description: 'These aren\'t just tours—they\'re invitations to slow down and truly see. We\'ll move through our gardens at a gentle pace, observing seasonal changes, identifying native plants, and understanding the delicate ecosystem we\'ve cultivated. Each walk reveals something new about our connection to this land.',
      imageUrl: 'https://ik.imagekit.io/offvxi40h/garden-walk.jpg?tr=w-400,q-80',
      altText: 'Peaceful walk through the terraced garden paths'
    },
    {
      id: '4',
      title: 'Stargazing & Stories',
      description: 'When the highland sky clears and the stars emerge, we gather on our viewing deck. Away from city lights, the Milky Way stretches overhead like a river of light. I share stories of this land, local folklore, and the quiet wisdom that comes from living so close to nature.',
      imageUrl: 'https://ik.imagekit.io/offvxi40h/stargazing.jpg?tr=w-400,q-80',
      altText: 'Clear highland night sky perfect for stargazing'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 
        className="text-3xl md:text-4xl mb-8 text-[hsl(var(--text-accent))]" 
        style={{ fontFamily: 'Caveat, cursive' }}
      >
        Farm Experiences
      </h2>
      
      <div className="space-y-12">
        {activities.map((activity) => (
          <ActivityBlock key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default ActivitiesShowcase;
