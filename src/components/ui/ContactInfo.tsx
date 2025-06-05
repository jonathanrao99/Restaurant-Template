import { MapPin, Mail, Phone, Clock, ExternalLink } from 'lucide-react';

interface ContactInfoProps {
  variant?: 'card' | 'inline';
  className?: string;
}

const contactInfo = {
  location: {
    icon: MapPin,
    title: 'Location',
    value: '1989 North Fry RD, Katy, Texas, 77449',
    link: 'https://maps.app.goo.gl/JURVBywvbtw7Qgja7'
  },
  email: {
    icon: Mail,
    title: 'Email',
    value: 'desiflavorskaty@gmail.com',
    link: 'mailto:desiflavorskaty@gmail.com'
  },
  phone: {
    icon: Phone,
    title: 'Phone',
    value: '+1 (346) 824-4212',
    link: 'tel:+13468244212'
  },
  hours: {
    icon: Clock,
    title: 'Hours',
    value: 'Monday - Sunday\n1:00 PM - 12:00 AM'
  }
};

export const ContactInfo = ({ variant = 'card', className = '' }: ContactInfoProps) => {
  const renderCard = (key: keyof typeof contactInfo) => {
    const { icon: Icon, title, value, link } = contactInfo[key];
    return (
      <div className="flex items-start gap-4">
        <div className="p-3 bg-desi-orange/10 rounded-full">
          <Icon className="w-6 h-6 text-desi-orange" />
        </div>
        <div>
          <h3 className="font-medium text-desi-black">{title}</h3>
          {key === 'location' ? (
            <div>
              <p className="text-gray-600">{value}</p>
              <a 
                href={link} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-desi-orange hover:text-desi-orange/80 text-sm flex items-center gap-1 mt-1"
              >
                View on map
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : link ? (
            <a 
              href={link} 
              className="text-gray-600 hover:text-desi-orange transition-colors"
            >
              {value}
            </a>
          ) : (
            <p className="text-gray-600 whitespace-pre-line">{value}</p>
          )}
        </div>
      </div>
    );
  };

  const renderInline = (key: keyof typeof contactInfo) => {
    const { icon: Icon, title, value, link } = contactInfo[key];
    return (
      <div className="flex items-center space-x-4">
        <Icon className="h-6 w-6 text-desi-orange" />
        <div>
          <h3 className="font-semibold">{title}</h3>
          {key === 'location' ? (
            <div>
              <p className="text-gray-600">{value}</p>
              <a 
                href={link} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-desi-orange hover:text-desi-orange/80 text-sm flex items-center gap-1 mt-1"
              >
                View on map
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : link ? (
            <a 
              href={link} 
              className="text-gray-600 hover:text-desi-orange transition-colors"
            >
              {value}
            </a>
          ) : (
            <p className="text-gray-600">{value}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {Object.keys(contactInfo).map((key) => (
        variant === 'card' 
          ? renderCard(key as keyof typeof contactInfo)
          : renderInline(key as keyof typeof contactInfo)
      ))}
    </div>
  );
}; 