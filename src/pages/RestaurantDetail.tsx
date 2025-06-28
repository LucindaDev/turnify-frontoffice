import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useBranches } from '@/hooks/useBranches';
import { useCreateReservation } from '@/hooks/useReservations';
import { ArrowLeft, Clock, MapPin, Users, Star, CalendarIcon, Circle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTables } from '@/hooks/useTables';
import { formatTime } from '@/utils/Utils';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: branches, isLoading } = useBranches(id ? parseInt(id) : undefined);
  const { data: tables, isFetching } = useTables(id ? parseInt(id) : undefined);
  const createReservation = useCreateReservation();
  
  const [activeTab, setActiveTab] = useState<'info' | 'reservation'>('info');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [reservationType, setReservationType] = useState<'traditional' | 'time_limited'>('traditional');
  
  const branch = branches && branches.length > 0 ? branches[0] : null;

  const handleReservation = async () => {
    if (!selectedDate || !selectedTime || !guestCount || !branch) {
      return;
    }

    const reservationData = {
      branch_id: branch.id,
      reservation_type: reservationType,
      reservation_date: format(selectedDate, 'yyyy-MM-dd'),
      reservation_time: selectedTime,
      number_of_guests: parseInt(guestCount),
    };

    try {
      await createReservation.mutateAsync(reservationData);
      navigate('/reservations');
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del restaurante...</p>
        </div>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mesas...</p>
        </div>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Restaurante no encontrado</p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    const occupancyRate = branch.total_tables > 0 ? (branch.active_tables / branch.total_tables) * 100 : 0;

    if (occupancyRate < 30) return { text: 'Tranquilo', color: 'text-green-600', time: '2 min' };
    if (occupancyRate < 60) return { text: 'Flujo Normal', color: 'text-blue-600', time: '5-10 min' };
    if (occupancyRate < 80) return { text: 'Casi lleno', color: 'text-yellow-600', time: '15-20 min' };
    if (occupancyRate < 95) return { text: 'Lleno', color: 'text-orange-600', time: '25-30 min' };
    return { text: 'Saturado', color: 'text-red-600', time: '30+ min' };
  };

  const statusInfo = getStatusInfo();

  const getOccupancyStatus = () => {
    const totalCapacity = branch.total_tables;
    const occupiedCapacity = Math.floor(Math.random() * totalCapacity);
    const percentage = totalCapacity > 0 ? (occupiedCapacity / totalCapacity) * 100 : 0;

    if (percentage <= 40) {
      return { status: 'Espacio de sobra', color: 'bg-green-500', textColor: 'text-green-600', icon: CheckCircle };
    } else if (percentage <= 70) {
      return { status: 'Flujo normal', color: 'bg-yellow-500', textColor: 'text-yellow-600', icon: Circle };
    } else if (percentage <= 90) {
      return { status: 'Casi lleno', color: 'bg-orange-500', textColor: 'text-orange-600', icon: AlertCircle };
    } else {
      return { status: 'Sin disponibilidad', color: 'bg-red-500', textColor: 'text-red-600', icon: AlertCircle };
    }
  };

  const occupancyStatus = getOccupancyStatus();
  const StatusIcon = occupancyStatus.icon;

  const mainImage = branch.images && branch.images.length > 0
    ? branch.images[0]
    : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';

  const getAvailableTimes = () => {
    const times: string[] = [];
    const startTime = branch.opens_at;
    const endTime = branch.closes_at;

    if (!startTime || !endTime) return times;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute, 0, 0);

    let current = new Date(start);

    while (current <= end) {
      const h = current.getHours().toString().padStart(2, '0');
      const m = current.getMinutes().toString().padStart(2, '0');

      // Exclude times that are less than 30 minutes from now
      if (current.getTime() < now.getTime() + 30 * 60 * 1000) {
        current.setMinutes(current.getMinutes() + 30);
        continue;
      }
      times.push(`${h}:${m}`);
      current.setHours(current.getHours() + 2);
    }

    return times;
  }

  const availableTimes = getAvailableTimes();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative">
        <img
          src={mainImage}
          alt={branch.name}
          className="w-full h-64 object-cover"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Restaurant Info */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-900 rounded-lg flex-shrink-0">icono</div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center">{branch.name}</h1>
        </div>

        {/* Time - Status - Rating - Section */}
        <div className="flex items-center justify-center gap-4 mt-2 text-sm mb-3">
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-6 max-w-sm w-full">
              {/* Wait Time */}
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <Clock className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                <div className="text-xs text-gray-500">Tiempo</div>
                <span className={statusInfo.color}>{statusInfo.time}</span>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <StatusIcon className={`w-4 h-4 mx-auto mb-1 ${occupancyStatus.textColor}`} />
                <div className="text-xs text-gray-500">Estado</div>
                <span className={statusInfo.color}>{statusInfo.text}</span>
              </div>

              {/* Rating */}
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1 fill-current" />
                <div className="text-xs text-gray-500">Rating</div>
                <div className="font-bold text-sm text-gray-900">4.8</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'info' ? 'default' : 'outline'}
            onClick={() => setActiveTab('info')}
            className="flex-1"
          >
            Información
          </Button>
          <Button
            variant={activeTab === 'reservation' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reservation')}
            className="flex-1"
          >
            Reservación
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'info' ? (
          <div className="space-y-4">
            {/* Horario */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Horario</h3>
                    <p className="text-sm text-gray-600">
                      {branch.opens_at && branch.closes_at
                        ? `${formatTime(branch.opens_at)} - ${formatTime(branch.closes_at)}`
                        : 'No especificado'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Ubicación</h3>
                    <p className="text-sm text-gray-600">{branch.location || 'Ubicación no disponible'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capacidad */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Capacidad</h3>
                    <p className="text-sm text-gray-600">{branch.active_tables} lugares totales</p>
                  </div>
                </div>

                {/* Tables Status */}
                <div className="grid grid-cols-2 gap-3">
                  {tables.map((table) => (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center" key={table.id}>
                      <p className="font-medium text-green-800">{table.name}</p>
                      <p className="text-sm text-green-600">{table.places} lugares</p>
                      <p className="text-xs text-green-600 font-medium">Disponible</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-orange-600" />
                <h3 className="font-medium text-gray-900">Hacer Reservación</h3>
              </div>

              <div className="space-y-4">
                {/* Tipo de Reservación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reservación</label>
                  <Select value={reservationType} onValueChange={(value: 'traditional' | 'time_limited') => setReservationType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Tradicional</SelectItem>
                      <SelectItem value="time_limited">Con tiempo límite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: es }) : "dd/mm/aaaa"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Horarios disponibles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTime(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Número de personas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de personas</label>
                  <Select value={guestCount} onValueChange={setGuestCount}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'persona' : 'personas'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleReservation} 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={!selectedDate || !selectedTime || !guestCount || createReservation.isPending}
                >
                  {createReservation.isPending ? 'Creando...' : 'Confirmar Reservación'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
