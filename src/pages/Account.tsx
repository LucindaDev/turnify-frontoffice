
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Settings, 
  Heart, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Star,
  Gift
} from 'lucide-react';

const Account = () => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
    }
  };

  const menuItems = [
    { icon: User, label: 'Editar perfil', action: () => {} },
    { icon: Heart, label: 'Restaurantes favoritos', action: () => {} },
    { icon: CreditCard, label: 'Métodos de pago', action: () => {} },
    { icon: Bell, label: 'Notificaciones', action: () => {} },
    { icon: Gift, label: 'Promociones', action: () => {} },
    { icon: Settings, label: 'Configuración', action: () => {} },
    { icon: HelpCircle, label: 'Ayuda y soporte', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header con perfil */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Juan Pérez</h1>
            <p className="text-blue-100">juan.perez@email.com</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">4.8 • Cliente VIP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-xs text-gray-600">Reservas</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-gray-600">Favoritos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-xs text-gray-600">Reseñas</div>
            </CardContent>
          </Card>
        </div>

        {/* Menú principal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mi cuenta</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Sección de ayuda */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">¿Necesitas ayuda?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contáctanos para resolver cualquier duda sobre tus reservaciones
              </p>
              <Button variant="outline" className="w-full">
                Contactar soporte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botón de cerrar sesión */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Account;
