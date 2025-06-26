
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchBar from '@/components/SearchBar';
import RestaurantCard from '@/components/RestaurantCard';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, Utensils, Clock, MapPin } from 'lucide-react';

const Dashboard = () => {
  // Mock data para restaurantes populares
  const popularRestaurants = [
    {
      id: '1',
      name: 'La Docena Oyster Bar',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
      rating: 4.8,
      cuisine: 'Mariscos • Mexicana',
      waitTime: '15-20 min',
      distance: '0.8 km',
      availability: 'Disponible'
    },
    {
      id: '2',
      name: 'Rosetta',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      rating: 4.9,
      cuisine: 'Italiana • Fine Dining',
      waitTime: '25-30 min',
      distance: '1.2 km',
      availability: 'Pocas mesas'
    },
    {
      id: '3',
      name: 'Contramar',
      image: 'https://images.unsplash.com/photo-1552566090-a855ac7e7e5c?w=400&h=300&fit=crop',
      rating: 4.7,
      cuisine: 'Mariscos • Casual',
      waitTime: '30-35 min',
      distance: '2.1 km',
      availability: 'Disponible'
    }
  ];

  const categories = [
    { name: 'Italiana', icon: '🍝', color: 'bg-red-100' },
    { name: 'Japonesa', icon: '🍱', color: 'bg-pink-100' },
    { name: 'Mexicana', icon: '🌮', color: 'bg-green-100' },
    { name: 'Mariscos', icon: '🦐', color: 'bg-blue-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header con barra de búsqueda */}
      <SearchBar />
      
      {/* Reserva activa (si existe) */}
      <div className="px-4 py-3">
        <Card className="bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tu reservación</p>
                <p className="font-semibold">Restaurante Pujol</p>
                <p className="text-sm opacity-90">Hoy, 8:00 PM • Mesa para 4</p>
              </div>
              <Button size="sm" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                Ver detalles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categorías */}
      <div className="px-4 py-2">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`flex flex-col items-center p-3 rounded-xl ${category.color} min-w-[70px] cursor-pointer hover:scale-105 transition-transform`}
            >
              <span className="text-2xl mb-1">{category.icon}</span>
              <span className="text-xs font-medium text-gray-700">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de reserva rápida */}
      <div className="px-4 py-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Reserva rápida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 flex flex-col gap-1">
                <span className="font-medium">Hoy</span>
                <span className="text-xs text-gray-500">Disponible</span>
              </Button>
              <Button variant="outline" className="h-12 flex flex-col gap-1">
                <span className="font-medium">Mañana</span>
                <span className="text-xs text-gray-500">Pocas mesas</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restaurantes populares */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-blue-600" />
            Populares cerca de ti
          </h2>
          <Button variant="ghost" size="sm" className="text-blue-600">
            Ver todos
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {popularRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>
      </div>

      {/* Sección de descubrimiento */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Descubre nuevos lugares
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=200&h=120&fit=crop" 
                alt="Nuevos restaurantes"
                className="w-full h-24 object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm">Nuevos restaurantes</h3>
              <p className="text-xs text-gray-500">Descubre los más recientes</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=120&fit=crop" 
                alt="Ofertas especiales"
                className="w-full h-24 object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm">Ofertas especiales</h3>
              <p className="text-xs text-gray-500">Descuentos y promociones</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navegación inferior */}
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
