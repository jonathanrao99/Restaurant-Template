'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useScrollToTopOnNavClick } from '@/hooks/useScrollToTopOnNavClick';
import { fadeInUp } from '@/utils/motion.variants';
import MagneticButton from '@/components/MagneticButton';
import AnimatedCardGrid, { AnimatedCard } from '@/components/AnimatedCardGrid';
import { Phone, Mail, MapPin, Calendar, Users, PartyPopper, Utensils } from 'lucide-react';

// Define your services here
const services = [
  { title: 'Corporate Events', icon: '/Ingredients/clove-removebg-preview.png', description: 'Tailored menus for conferences, meetings, and corporate gatherings.' },
  { title: 'Weddings', icon: '/Ingredients/pngtree-onion-slice-transparent-background-5727009.png', description: 'Elegant wedding catering with customizable buffet and plated options.' },
  { title: 'Private Parties', icon: '/Ingredients/mint-removebg-preview.png', description: 'Personalized menus for birthday parties, anniversaries, and special celebrations.' },
];

// Define your gallery items here (type: 'image' or 'video')
const galleryItems = [
  { type: 'image', src: '/Truck/IMG-20250603-WA0005.jpg', alt: 'Corporate Event Setup' },
  { type: 'video', src: '/videos/event-highlight.mp4' },
  { type: 'image', src: '/Truck/IMG-20250610-WA0011.jpg', alt: 'Wedding Reception' },
];

const Catering = () => {
  const router = useRouter();
  useScrollToTopOnNavClick();

  const handleQuoteClick = () => {
    router.push('/');
    setTimeout(() => {
      const connect = document.getElementById('connect');
      if (connect) connect.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  return (
    <div className="bg-desi-cream">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent z-10" />
        <div className="absolute inset-0 z-0">
          <img
            src="/Truck/IMG-20250603-WA0005.jpg"
            alt="Premium Catering"
            className="w-full h-full object-cover animate-float"
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-3xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="text-white animate-fade-in"
          >
            <h1 className="text-5xl md:text-6xl font-against font-bold mb-4">
              Catering & Events
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Elevate your events with exquisite Indian cuisine, crafted with passion and love.
            </p>
            
          </motion.div>
        </div>
      </section>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Catering & Events Section */}
        <section>
          <h2 className="text-3xl font-playfair font-bold text-desi-black text-center mb-2">
            Catering & Events
          </h2>
          <p className="text-lg text-gray-700 text-center mb-8">
            Bring the authentic taste of India to your next event. Our food truck is available for private parties, corporate events, and special celebrations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
              <Calendar className="text-desi-orange mx-auto mb-4 h-8 w-8" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Private Events</h3>
              <p className="text-gray-600 text-center">Make your special occasions memorable with our authentic Indian cuisine. Perfect for birthdays, anniversaries, and corporate events.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
              <Users className="text-desi-orange mx-auto mb-4 h-8 w-8" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Corporate Catering</h3>
              <p className="text-gray-600 text-center">Impress your clients and employees with our professional catering services. Customizable menus for meetings and office parties.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
              <PartyPopper className="text-desi-orange mx-auto mb-4 h-8 w-8" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Festival Catering</h3>
              <p className="text-gray-600 text-center">Celebrate cultural festivals with our traditional Indian dishes. Special menus available for Diwali, Holi, and other celebrations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
              <Utensils className="text-desi-orange mx-auto mb-4 h-8 w-8" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Custom Menus</h3>
              <p className="text-gray-600 text-center">Tailored menus to suit your event's theme and dietary requirements. Vegetarian, vegan, and gluten-free options available.</p>
            </div>
          </div>
        </section>

        {/* Gallery & Videos */}
        <section>
          <h2 className="text-3xl font-display font-bold text-desi-black text-center mb-8">
            Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryItems.map((item, idx) => (
              item.type === 'image' ? (
                <motion.img
                  key={idx}
                  src={item.src}
                  alt={item.alt || `Gallery ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                />
              ) : (
                <motion.video
                  key={idx}
                  controls
                  className="w-full h-64 rounded-lg shadow-md hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                >
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </motion.video>
              )
            ))}
          </div>
        </section>

        {/* Tray Pricing Download */}
        <section className="text-center">
          <h2 className="text-3xl font-display font-bold text-desi-black mb-4">
            Tray Pricing
          </h2>
          <p className="text-gray-600 mb-6">
            Download our comprehensive tray price list to plan your perfect menu.
          </p>
          <a
            href="/tray-prices.pdf"
            download
            className="inline-block bg-desi-black text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition"
          >
            Download Tray Prices
          </a>
        </section>

        {/* Contact Information */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-display font-bold text-desi-black mb-6 text-center">
            Connect With Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <Phone className="h-6 w-6 text-desi-orange" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-700">
                  <a href="tel:+13468244212" className="hover:text-desi-orange">
                    +1 (346) 824-4212
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-desi-orange" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-700">
                  <a href="mailto:info@desiflavorskaty.com" className="hover:text-desi-orange">
                    info@desiflavorskaty.com
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-desi-orange" />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-gray-700">
                  <a
                    href="https://maps.app.goo.gl/JURVBywvbtw7Qgja7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-desi-orange"
                  >
                    1989 North Fry Rd, Katy, TX 77494
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Get a Quote CTA */}
        <section className="py-14 max-w-screen-xl mx-auto">
          <div className="relative overflow-hidden mx-4 px-4 py-14 rounded-2xl bg-desi-orange md:px-8 md:mx-8">
            <div className="relative z-10 max-w-xl mx-auto text-center space-y-3">
              <h3 className="text-3xl text-white font-bold">Have an Event? Get a Quote</h3>
              <p className="text-orange-100 leading-relaxed">Ready to plan your event? Click the button below to connect with us.</p>
              <MagneticButton onClick={handleQuoteClick} className="p-2 px-4 rounded-lg font-medium text-desi-orange bg-white hover:bg-gray-100 duration-150 shadow-md outline-none">Get a Quote</MagneticButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Catering; 
