
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import { Calendar, Clock, MapPin, Users, Phone } from 'lucide-react';

const Reservations = () => {
  const reservations = [
    {
      id: '1',
      restaurant: 'Restaurante Pujol',
      date: '2024-06-26',
      time: '20:00',
      guests: 4,
      status: 'confirmed',
      address: 'Tennyson 133, Polanco',
      phone: '+52 55 5545 4111',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop'
    },
    {
      id: '2',
      restaurant: 'Contramar',
      date: '2024-06-28',
      time: '14:30',
      guests: 2,
      status: 'pending',
      address: 'Durango 200, Roma Norte',
      phone: '+52 55 5514 9217',
      image: 'https://images.unsplash.com/photo-1552566090-a855ac7e7e5c?w=400&h=200&fit=crop'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-900">Mis Reservaciones</h1>
        <p className="text-gray-600 text-sm">Gestiona tus reservas actuales y pasadas</p>
      </div>

      {/* Reservaciones */}
      <div className="p-4 space-y-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="overflow-hidden">
            <div className="relative">
              <img 
                src={reservation.image} 
                alt={reservation.restaurant}
                className="w-full h-32 object-cover"
              />
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                {getStatusText(reservation.status)}
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {reservation.restaurant}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(reservation.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{reservation.time}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{reservation.guests} personas</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{reservation.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{reservation.phone}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Modificar
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                  Cancelar
                </Button>
                <Button size="sm" className="flex-1">
                  Ver detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botón para nueva reserva */}
      <div className="fixed bottom-24 right-4">
        <Button size="lg" className="rounded-full shadow-lg">
          <Calendar className="w-5 h-5 mr-2" />
          Nueva reserva
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Reservations;
