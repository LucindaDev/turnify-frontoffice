
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import { useReservations } from '@/hooks/useReservations';
import { Calendar, Clock, MapPin, Users, CalendarX } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatTime } from '@/utils/Utils';

const Reservations = () => {
  const navigate = useNavigate();
  const { data: reservations = [], isLoading, error } = useReservations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'seated':
        return 'bg-green-100 text-green-800';
      case 'finished':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programada';
      case 'seated':
        return 'En mesa';
      case 'finished':
        return 'Finalizada';
      case 'cancelled':
        return 'Cancelada';
      case 'no_show':
        return 'No asistió';
      default:
        return 'Desconocido';
    }
  };

  const getReservationTypeText = (type: string) => {
    return type === 'traditional' ? 'Tradicional' : 'Con tiempo límite';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-bold text-gray-900">Mis Reservaciones</h1>
          <p className="text-gray-600 text-sm">Gestiona tus reservas actuales y pasadas</p>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 ml-3">Cargando reservaciones...</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-bold text-gray-900">Mis Reservaciones</h1>
          <p className="text-gray-600 text-sm">Gestiona tus reservas actuales y pasadas</p>
        </div>
        <div className="flex items-center justify-center p-8">
          <p className="text-red-600">Error al cargar las reservaciones</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-900">Mis Reservaciones</h1>
        <p className="text-gray-600 text-sm">Gestiona tus reservas actuales y pasadas</p>
      </div>

      {/* Reservaciones */}
      <div className="p-4">
        {reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <CalendarX className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes reservaciones</h3>
            <p className="text-gray-500 text-center mb-6">
              Aún no has realizado ninguna reservación. Explora nuestros restaurantes y haz tu primera reserva.
            </p>
            <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600">
              Explorar Restaurantes
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={reservation.branches?.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop'} 
                    alt={reservation.branches?.name || 'Restaurante'}
                    className="w-full h-32 object-cover"
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {getStatusText(reservation.status)}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {reservation.branches?.name || 'Restaurante'}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(reservation.reservation_date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(reservation.reservation_time)} - {getReservationTypeText(reservation.reservation_type)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{reservation.number_of_guests} {reservation.number_of_guests === 1 ? 'persona' : 'personas'}</span>
                    </div>
                    
                    {reservation.branches?.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{reservation.branches.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/reservation/${reservation.id}`)}
                    >
                      Ver detalles
                    </Button>
                    {reservation.status === 'scheduled' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => navigate(`/reservation/${reservation.id}?action=cancel`)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Reservations;
