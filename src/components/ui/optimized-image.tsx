import { useState, useEffect, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { motion, type MotionProps } from 'framer-motion';
import { generateSrcSet, getModernFormat } from './optimized-image.utils';

export interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  sizes?: string;
  priority?: boolean;
  blur?: boolean;
  withAnimation?: boolean;
  animationProps?: MotionProps;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  fallback,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  blur = false,
  withAnimation = false,
  animationProps,
  ...props
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  // Calculate aspect ratio for placeholder
  const aspectRatio = width && height ? { aspectRatio: `${width} / ${height}` } : {};
  
  // Try WebP version first
  const webpSrc = getModernFormat(imgSrc);
  
  // Generate srcset for responsive images
  const srcSet = generateSrcSet(webpSrc);

  const handleError = () => {
    console.error(`Failed to load image: ${imgSrc}`);
    setIsError(true);
    if (fallback) {
      setImgSrc(fallback);
    }
  };

  const baseImageProps = {
    src: webpSrc,
    alt,
    width,
    height,
    loading: priority ? 'eager' as const : 'lazy' as const,
    decoding: priority ? 'sync' as const : 'async' as const,
    onLoad: () => setIsLoaded(true),
    onError: handleError,
    className: cn(
      'w-full transition-opacity duration-300',
      isLoaded ? 'opacity-100' : 'opacity-0',
      className
    ),
    sizes,
    style: {
      ...aspectRatio,
    },
    ...props,
  } as const;

  // Prepare the final props
  const finalProps = { ...baseImageProps };
  
  // Allow srcSet property on the image props
  type ImgWithSrcSet = ImgHTMLAttributes<HTMLImageElement> & { srcSet?: string };
  const imageProps = finalProps as ImgWithSrcSet;
  if (srcSet && !isError) {
    imageProps.srcSet = srcSet;
  }

  // Exclude React drag and CSS animation event handlers to satisfy motion.img prop types
  const {
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    ...filteredImageProps
  } = imageProps;

  const ImageComponent = withAnimation
    ? (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore allow any props on motion.img to avoid type conflicts
      <motion.img {...filteredImageProps} {...animationProps} />
    )
    : <img {...filteredImageProps} />;

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        blur && !isLoaded ? 'blur-sm' : 'blur-0',
        'transition-all duration-500'
      )}
      style={{ ...aspectRatio }}
    >
      {ImageComponent}
    </div>
  );
};

export default OptimizedImage; 