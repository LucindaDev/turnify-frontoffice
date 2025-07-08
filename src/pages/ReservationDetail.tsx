
import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useUpdateReservation, useCancelReservation, useReservation } from '@/hooks/useReservations';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Users, Phone, User, FileText, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatTime, formatDate } from '@/utils/Utils';
import { cn } from '@/lib/utils';

const ReservationDetail = () => {
  const { id } = useParams();

  // Fetch reservation details
  const { data: reservation, isLoading, error } = useReservation(id);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const updateReservation = useUpdateReservation();
  const cancelReservation = useCancelReservation();

  const [isEditing, setIsEditing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(searchParams.get('action') === 'cancel');
  const [cancellationReason, setCancellationReason] = useState('');

  // Form states for editing
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [notes, setNotes] = useState('');


  // Initialize form values when reservation loads
  React.useEffect(() => {
    if (reservation) {
      setSelectedDate(new Date(reservation.reservation_date));
      setSelectedTime(reservation.reservation_time);
      setGuestCount(reservation.number_of_guests.toString());
      setNotes(reservation.notes || '');
    }
  }, [reservation]);

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

  const handleSaveChanges = async () => {
    if (!reservation || !selectedDate || !selectedTime || !guestCount) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor completa todos los campos obligatorios.",
      });
      return;
    }

    try {
      await updateReservation.mutateAsync({
        id: reservation.id,
        updates: {
          reservation_date: format(selectedDate, 'yyyy-MM-dd'),
          reservation_time: selectedTime,
          number_of_guests: parseInt(guestCount),
          notes: notes || null,
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const handleCancelReservation = async () => {
    if (!reservation) return;

    try {
      await cancelReservation.mutateAsync({
        id: reservation.id,
        reason: cancellationReason || undefined
      });
      setShowCancelDialog(false);
      navigate('/reservations');
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const getAvailableTimes = () => {
    if (!reservation?.branches) return [];

    const times: string[] = [];
    const startTime = reservation.branches.opens_at;
    const endTime = reservation.branches.closes_at;

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
      times.push(`${h}:${m}`);
      current.setHours(current.getHours() + 2);
    }

    return times;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la reservación...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Reservación no encontrada</p>
          <Button onClick={() => navigate('/reservations')}>Volver a reservaciones</Button>
        </div>
      </div>
    );
  }

  const availableTimes = getAvailableTimes();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/reservations')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Detalles de Reservación</h1>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)} mt-1`}>
              {getStatusText(reservation.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Restaurant Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <img
                src={reservation.branches?.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop'}
                alt={reservation.branches?.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-gray-900">{reservation.branches?.name}</h2>
                {reservation.branches?.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{reservation.branches.location}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información de la Reservación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                {/* Fecha - Editable */}
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

                {/* Hora - Editable */}
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

                {/* Número de personas - Editable */}
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

                {/* Notas - Editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notas adicionales</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Agregar notas especiales..."
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Fecha y Hora</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(reservation.reservation_date)}
                      {' a las '} 
                      {formatTime(reservation.reservation_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Personas</p>
                    <p className="text-sm text-gray-600">
                      {reservation.number_of_guests} {reservation.number_of_guests === 1 ? 'persona' : 'personas'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Tipo de Reservación</p>
                    <p className="text-sm text-gray-600">
                      {reservation.reservation_type === 'traditional' ? 'Tradicional' : 'Con tiempo límite'}
                    </p>
                  </div>
                </div>

                {reservation.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-medium">Notas</p>
                      <p className="text-sm text-gray-600">{reservation.notes}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        {reservation.status === 'scheduled' && (
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                  disabled={updateReservation.isPending}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={updateReservation.isPending}
                >
                  {updateReservation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="flex-1"
                >
                  Modificar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCancelDialog(true)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  Cancelar Reserva
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Cancel Reservation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Cancelar Reservación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar esta reservación? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de cancelación (opcional)
            </label>
            <Textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Escribe el motivo de la cancelación..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelReservation.isPending}
            >
              Mantener Reserva
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelReservation}
              disabled={cancelReservation.isPending}
            >
              {cancelReservation.isPending ? 'Cancelando...' : 'Confirmar Cancelación'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationDetail;
