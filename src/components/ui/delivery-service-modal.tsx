'use client';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';

interface DeliveryServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeliveryServiceModal({ isOpen, onClose }: DeliveryServiceModalProps) {
  const deliveryServices = [
    {
      name: 'DoorDash',
      logo: '/Doordash.webp',
      url: 'https://www.doordash.com',
      description: 'Fast delivery from your favorite restaurants'
    },
    {
      name: 'Grubhub',
      logo: '/Grubhub.webp',
      url: 'https://www.grubhub.com',
      description: 'Food delivery from the best local restaurants'
    },
    {
      name: 'Uber Eats',
      logo: '/ubereats.png',
      url: 'https://www.ubereats.com',
      description: 'Delicious food delivered to your door'
    }
  ];

  const handleServiceClick = (url: string) => {
    window.open(url, '_blank');
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            🚚 Delivery Service Update
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              We're currently working on our own delivery partner to serve you better! 
              In the meantime, please order through our trusted third-party delivery partners.
            </p>
          </div>

          <div className="space-y-3">
            {deliveryServices.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleServiceClick(service.url)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={service.logo}
                    alt={`${service.name} logo`}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 