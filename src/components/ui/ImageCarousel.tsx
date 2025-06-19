import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

export default function ImageCarousel({ images, alt = '' }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <button
        onClick={prev}
        className="absolute left-2 z-10 bg-black/30 p-1 rounded-full text-white hover:bg-black/40"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <div className="w-full h-full relative">
        <Image
          src={images[current]}
          alt={alt}
          fill
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </div>
      <button
        onClick={next}
        className="absolute right-2 z-10 bg-black/30 p-1 rounded-full text-white hover:bg-black/40"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
} 