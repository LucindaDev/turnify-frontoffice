
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchBar from '@/components/SearchBar';
import RestaurantCard from '@/components/RestaurantCard';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, Utensils, Clock, MapPin } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';

const Dashboard = () => {
  const { data: branches, isLoading, error } = useBranches();

  const categories = [
    { name: 'Italiana', icon: '🍝', color: 'bg-red-100' },
    { name: 'Japonesa', icon: '🍱', color: 'bg-pink-100' },
    { name: 'Mexicana', icon: '🌮', color: 'bg-green-100' },
    { name: 'Mariscos', icon: '🦐', color: 'bg-blue-100' },
  ];

  const transformBranchToRestaurant = (branch: any) => {
    const occupancyRate = branch.total_tables > 0 ? (branch.active_tables / branch.total_tables) * 100 : 0;
    
    let availability = 'Disponible';
    let waitTime = '2-5 min';
    
    if (occupancyRate >= 80) {
      availability = 'Pocas mesas';
      waitTime = '15-25 min';
    } else if (occupancyRate >= 60) {
      waitTime = '10-15 min';
    }

    return {
      id: branch.id.toString(),
      name: branch.name,
      image: branch.images && branch.images.length > 0 
        ? branch.images[0] 
        : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      rating: 4.5 + Math.random() * 0.5, // Rating simulado entre 4.5 y 5.0
      cuisine: 'Restaurante • General',
      waitTime,
      distance: '0.8 km', // Distancia simulada
      availability
    };
  };

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
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Error al cargar los restaurantes</p>
            <p className="text-sm text-gray-500">Inténtalo de nuevo más tarde</p>
          </div>
        ) : branches && branches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {branches.map((branch) => (
              <RestaurantCard key={branch.id} {...transformBranchToRestaurant(branch)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay restaurantes disponibles</p>
            <p className="text-sm text-gray-500">Pronto tendremos más opciones para ti</p>
          </div>
        )}
      </div>

      {/* Sección de descubrimiento */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Descubre nuevos lugares
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
