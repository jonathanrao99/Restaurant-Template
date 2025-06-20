import { Source_Sans_3 } from 'next/font/google';
import localFont from 'next/font/local';

export const source_sans_3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-source-sans-3',
});

export const samarkan = localFont({
  src: '../../public/Fonts/samarkan/saman___.ttf',
  variable: '--font-samarkan',
});

export const against = localFont({
  src: '../../public/Fonts/against_2/against-regular.ttf',
  variable: '--font-against',
});

export const butler = localFont({
  src: '../../public/Fonts/butler/Butler/butler-light.otf',
  variable: '--font-butler',
}); 