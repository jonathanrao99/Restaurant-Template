import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// Ingredient image data
const ingredients = [
  { name: 'clove', src: '/clove-removebg-preview.png', alt: 'Clove Spice' },
  { name: 'cinnamon', src: '/cinamon-removebg-preview.png', alt: 'Cinnamon Stick' },
  { name: 'mint', src: '/mint-removebg-preview.png', alt: 'Mint Leaves' },
  { name: 'onion', src: '/onion.png', alt: 'Sliced Onion' }
];

// Floating & rotating ingredient component
const SlideInIngredient = ({
  src,
  alt,
  position,
  size,
  delay,
  direction,
  hasAnimated,
}: {
  src: string;
  alt: string;
  position: {
    top: string;
    left?: string;
    right?: string;
  };
  size: string;
  delay: number;
  direction: 'left' | 'right';
  hasAnimated: boolean;
}) => {
  return (
    <motion.div
      className={`absolute ${size} z-30`}
      style={position}
      initial={{ 
        opacity: 0, 
        x: direction === 'left' ? -300 : 300,
        scale: 0.3,
        rotate: direction === 'left' ? -30 : 30
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        scale: 1,
        rotate: 0,
        transition: { 
          delay, 
          duration: 1.2, 
          ease: [0.25, 0.1, 0.25, 1],
          opacity: { duration: 0.8 }
        },
      }}
      viewport={{ once: false, margin: "-100px", amount: 0.3 }}
    >
      <motion.div
        animate={hasAnimated ? {
          y: 0,
          rotate: 0,
        } : {
          y: [0, -15, 0],
          rotate: [0, 8, 0],
        }}
        whileHover={{
          scale: 1.2,
          rotate: direction === 'left' ? -8 : 8,
          transition: { duration: 0.3 }
        }}
        transition={{
          repeat: hasAnimated ? 0 : Infinity,
          duration: 3 + Math.random() * 2,
          ease: 'easeInOut',
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto"
          loading="eager"
          onError={(e) => {
            console.error(`Error loading image: ${src}`);
            e.currentTarget.src = '/placeholder.svg';
          }}
          style={{
            filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default function TraditionalRecipesSection() {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Set hasAnimated to true after the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 5000); // Increased to 5 seconds to allow more time for initial animation
    
    return () => clearTimeout(timer);
  }, []);

  const ingredientPositions = [
    { top: '15%', left: '15%', size: 'w-16 md:w-24 lg:w-28', delay: 0.2, direction: 'left' },
    { top: '35%', left: '10%', size: 'w-14 md:w-20 lg:w-24', delay: 0.4, direction: 'left' },
    { top: '55%', left: '20%', size: 'w-12 md:w-16 lg:w-20', delay: 0.6, direction: 'left' },
    { top: '75%', left: '15%', size: 'w-14 md:w-20 lg:w-24', delay: 0.8, direction: 'left' },
    { top: '20%', right: '15%', size: 'w-16 md:w-24 lg:w-28', delay: 0.3, direction: 'right' },
    { top: '40%', right: '10%', size: 'w-14 md:w-20 lg:w-24', delay: 0.5, direction: 'right' },
    { top: '60%', right: '20%', size: 'w-12 md:w-16 lg:w-20', delay: 0.7, direction: 'right' },
    { top: '80%', right: '15%', size: 'w-14 md:w-20 lg:w-24', delay: 0.9, direction: 'right' },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen pt-16 pb-72 md:pt-28 md:pb-80 lg:pt-32 lg:pb-96 bg-gradient-to-b from-white to-orange-50 overflow-hidden hidden lg:block"
    >
      {/* Radial background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-desi-orange/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-desi-orange/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/4 right-10 w-16 h-16 bg-desi-orange/10 rounded-full"></div>
      
      <motion.div 
        className="absolute left-10 bottom-20 w-4 h-4 rounded-full bg-desi-orange/40"
        animate={hasAnimated ? { 
          y: 0,
          opacity: 0.6
        } : { 
          y: [0, -15, 0],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 3,
          repeat: hasAnimated ? 0 : Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
      
      <motion.div 
        className="absolute right-1/3 top-40 w-6 h-6 rounded-full bg-desi-orange/30"
        animate={hasAnimated ? { 
          y: 0,
          opacity: 0.5
        } : { 
          y: [0, -20, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: hasAnimated ? 0 : Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      ></motion.div>

      {/* Floating Ingredients - SIMPLIFIED */}
      <div className="absolute inset-0 z-20">
        {ingredientPositions.map((config, index) => {
          const ingredient = ingredients[index % ingredients.length];
          return (
            <motion.div
              key={`ingredient-${index}`}
              className={`absolute ${config.size} z-30`}
              style={{ 
                top: config.top, 
                ...(config.left ? { left: config.left } : { right: config.right }) 
              }}
              initial={{ 
                opacity: 0, 
                x: config.left ? -100 : 100,
                y: 20
              }}
              whileInView={{ 
                opacity: 1, 
                x: 0,
                y: 0 
              }}
              viewport={{ once: true }}
              transition={{ 
                delay: config.delay, 
                duration: 0.5, 
                ease: "easeOut" 
              }}
            >
              <img
                src={ingredient.src}
                alt={ingredient.alt}
                className="w-full h-auto"
                loading="eager"
                onError={(e) => {
                  console.error(`Error loading image: ${ingredient.src}`);
                  e.currentTarget.src = '/placeholder.svg';
                }}
                style={{
                  filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Hero Text */}
      <div className="relative z-30 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-24 md:mb-32"
          >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 font-display">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
              className="block mb-2"
              >
                Traditional Recipes,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              className="block text-orange-600"
              >
                Modern Delights
              </motion.span>
            </h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              viewport={{ once: true }}
            className="text-base md:text-lg text-gray-600 max-w-xl mx-auto"
            >
            Taste the heritage of India with every spoonful of our aromatic, handcrafted biryani.
                  </motion.p>
                </motion.div>
              </div>


                
      {/* Biryani Image - Half Visible */}
      <div className="biryani-container" style={{ bottom: '-220px', width: '700px' }}>
        <img 
                    src="/biryani.png"
          alt="Biryani" 
          className="biryani-image"
        />
      </div>
    </section>
  );
}
