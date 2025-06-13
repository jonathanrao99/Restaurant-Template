import { motion } from 'framer-motion';
import { BookOpen, Leaf, Star } from 'lucide-react';
import Image from 'next/image';
import { Card, CardHeader, CardBody } from '@heroui/react';

export default function DesiExperienceSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-orange-50 to-desi-cream">
      {/* Soft gradient background with faint spice overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-desi-orange/10 via-white/60 to-yellow-100/40" />
        <Image
          src="/Ingredients/mint-removebg-preview.png"
          alt="Spice watermark"
          width={112}
          height={112}
          className="absolute top-8 left-16 w-28 h-auto opacity-10 select-none pointer-events-none"
          loading="lazy"
        />
        <Image
          src="/Ingredients/cinamon-removebg-preview.png"
          alt="Spice watermark"
          width={128}
          height={128}
          className="absolute bottom-8 right-16 w-32 h-auto opacity-10 select-none pointer-events-none"
          loading="lazy"
        />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold mb-4 text-desi-orange"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          Our Promise to You
        </motion.h2>
        <motion.p
          className="text-xl md:text-2xl text-desi-orange mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, type: 'spring' }}
        >
          Every plate is a commitment to quality, authenticity, and your satisfaction.
        </motion.p>
        
        
      </div>
    </section>
  );
} 
 