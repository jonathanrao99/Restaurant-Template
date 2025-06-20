import BlogPostClient from './BlogPostClient';

interface Post { slug: string; title: string; content: string; image: string; }
const posts: Post[] = [
  { slug: 'our-secret-to-perfect-biryani', title: 'Our Secret to Perfect Biryani', content: 'Learn the spices and techniques that make our biryani a customer favorite, from marination to the final dum.', image: '/Truck/IMG-20250610-WA0011.jpg' },
  { slug: 'meet-the-chef-a-journey-in-indian-cuisine', title: 'Meet the Chef: A Journey in Indian Cuisine', content: 'Get to know the culinary mastermind behind Desi Flavors Katy, their favorite dishes, and inspirations.', image: '/Truck/IMG-20250610-WA0011.jpg' },
  { slug: 'how-to-host-the-perfect-indian-party', title: 'How to Host the Perfect Indian Party', content: 'Tips and tricks for planning a memorable event with authentic Indian food, from menu selection to presentation.', image: '/Truck/IMG-20250610-WA0011.jpg' },
  { slug: 'behind-the-scenes-food-truck-life', title: 'Behind the Scenes: Food Truck Life', content: 'A day in the life of our food truck team—prepping, serving, and sharing the love of Indian cuisine with Katy, TX.', image: '/Truck/IMG-20250610-WA0011.jpg' }
];

export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }));
}

export default async function Page({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise;
  const post = posts.find(p => p.slug === params.slug);
  if (!post) {
    return <div>Post not found</div>;
  }
  return <BlogPostClient post={post} />;
} 