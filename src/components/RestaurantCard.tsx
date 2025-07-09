
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Clock, Star, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePhoneValidationModal } from '@/components/PhoneValidationWrapper';

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  waitTime: string;
  distance: string;
  availability: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  image,
  rating,
  cuisine,
  waitTime,
  distance,
  availability
}) => {
  const navigate = useNavigate();
  const { openPhoneValidation } = usePhoneValidationModal();
  const [isPhoneValidated, setIsPhoneValidated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPhoneValidation = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('phone_validated')
          .eq('id', user.id)
          .single();

        setIsPhoneValidated(profile?.phone_validated || false);
      } catch (error) {
        console.error('Error checking phone validation:', error);
        setIsPhoneValidated(false);
      }
    };

    checkPhoneValidation();

    // Escuchar eventos de validación exitosa
    const handlePhoneValidated = () => {
      setIsPhoneValidated(true);
    };

    window.addEventListener('phoneValidated', handlePhoneValidated);

    return () => {
      window.removeEventListener('phoneValidated', handlePhoneValidated);
    };
  }, []);

  const handleClick = () => {
    if (isPhoneValidated === false) {
      openPhoneValidation(
        'Validación requerida',
        'Para continuar con la reservación, primero debes configurar y validar tu número de teléfono celular. ¿Quieres hacerlo ahora mismo?'
      );
    } else {
      navigate(`/restaurant/${id}`);
    }
  };

  return (
    <Card
      className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
          {distance}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{cuisine}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{waitTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span className={`font-medium ${availability === 'Disponible' ? 'text-green-600' : 'text-yellow-600'}`}>
              {availability}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
