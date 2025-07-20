import { Inter, Merriweather } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const samarkan = localFont({
  src: '../fonts/samarkan/saman___.ttf',
  variable: '--font-samarkan',
});

export const displayFont = localFont({
  src: '../fonts/against_2/against-regular.ttf',
  variable: '--font-display',
  display: 'swap',
}); 