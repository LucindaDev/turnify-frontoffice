
import React, { useState, useEffect } from 'react';
import { Search, MapPin, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import NotificationIcon from './NotificationIcon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

const SearchBar = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'loading'>('loading');
  const [manualAddress, setManualAddress] = useState('');
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });

      if (permission.state === 'granted') {
        getCurrentLocation();
      } else if (permission.state === 'denied') {
        setLocationPermission('denied');
      } else {
        // Prompt for permission
        getCurrentLocation();
      }
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    setLocationPermission('loading');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Simulated reverse geocoding - in a real app, you'd use a service like Google Maps API
          const address = await reverseGeocode(latitude, longitude);

          setLocation({
            latitude,
            longitude,
            address
          });
          setLocationPermission('granted');
        } catch (error) {
          setLocation({
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          });
          setLocationPermission('granted');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationPermission('denied');

        if (error.code === error.PERMISSION_DENIED) {
          toast({
            variant: "destructive",
            title: "Ubicación denegada",
            description: "Necesitamos acceso a tu ubicación para mostrarte restaurantes cercanos.",
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // This is a mock function. In a real app, you'd use a geocoding service
    // For now, we'll return a mock address based on coordinates
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Ciudad de México, CDMX");
      }, 500);
    });
  };

  const handleManualLocationSave = () => {
    if (manualAddress.trim()) {
      setLocation({
        latitude: 0,
        longitude: 0,
        address: manualAddress.trim()
      });
      setLocationPermission('granted');
      setIsLocationDialogOpen(false);
      setManualAddress('');

      toast({
        title: "Ubicación actualizada",
        description: "Tu ubicación ha sido configurada manualmente.",
      });
    }
  };

  const handleLocationClick = () => {
    if (locationPermission === 'denied') {
      setIsLocationDialogOpen(true);
    } else if (locationPermission === 'granted') {
      // Allow user to change location
      setIsLocationDialogOpen(true);
    } else {
      requestLocationPermission();
    }
  };

  const renderLocationSection = () => {
    if (locationPermission === 'loading') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="text-sm font-medium text-gray-900">Obteniendo ubicación...</p>
            <p className="text-xs text-gray-500">Espera un momento</p>
          </div>
        </div>
      );
    }

    if (locationPermission === 'denied') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLocationClick}
                className="flex items-center gap-3 w-80 text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Ubicación no disponible</p>
                  <p className="text-xs text-gray-500">Toca para configurar manualmente</p>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Necesitamos tu ubicación para mostrarte restaurantes cercanos. Toca para configurar manualmente.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <button
        onClick={handleLocationClick}
        className="flex items-center gap-3 w-80 text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
      >
        <MapPin className="w-5 h-5 text-gray-600" />
        <div>
          <p className="text-sm font-medium text-gray-900">Ubicación actual</p>
          <p className="text-xs text-gray-500">{location?.address || "Ubicación no disponible"}</p>
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white p-4 shadow-sm">
      {/* Header: ubicación a la izquierda, notificaciones a la derecha */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">{renderLocationSection()}</div>
        <NotificationIcon />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="¿Dónde quieres reservar?"
          className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl"
        />
      </div>

      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar ubicación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Ingresa tu ubicación manualmente
              </label>
              <Input
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="Ej: Colonia Roma, Ciudad de México"
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleManualLocationSave}
                className="flex-1"
                disabled={!manualAddress.trim()}
              >
                Guardar ubicación
              </Button>
              <Button
                variant="outline"
                onClick={getCurrentLocation}
                className="flex-1"
              >
                Intentar GPS
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Necesitamos tu ubicación para mostrarte restaurantes cercanos y mejorar tu experiencia.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchBar;
