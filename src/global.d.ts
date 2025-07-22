declare namespace JSX {
  interface IntrinsicElements {
    'gmp-place-autocomplete': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      ref?: any;
      value?: string;
      options?: string;
      placeholder?: string;
    };
  }
} 