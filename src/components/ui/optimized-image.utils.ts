export function generateSrcSet(src: string): string {
  const hasParams = src.includes('?');
  const connector = hasParams ? '&' : '?';
  if (src.startsWith('/')) {
    return `
      ${src} 1x,
      ${src}${connector}w=640 640w,
      ${src}${connector}w=750 750w,
      ${src}${connector}w=828 828w,
      ${src}${connector}w=1080 1080w,
      ${src}${connector}w=1200 1200w,
      ${src}${connector}w=1920 1920w,
      ${src}${connector}w=2048 2048w,
      ${src}${connector}w=3840 3840w
    `;
  }
  return '';
}

export function getModernFormat(src: string): string {
  if (src.startsWith('/') && !src.includes('?') && !src.endsWith('.webp') && !src.endsWith('.avif')) {
    const extension = src.split('.').pop();
    if (extension && ['jpg', 'jpeg', 'png'].includes(extension)) {
      return src.replace(`.${extension}`, '.webp');
    }
  }
  return src;
} 