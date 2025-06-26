
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from '@supabase/supabase-js';
import { 
  User as UserIcon, 
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

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

  const handleComingSoon = (feature: string) => {
    toast({
      title: "Próximamente",
      description: `La función "${feature}" estará disponible pronto.`,
    });
  };

  const menuItems = [
    { icon: UserIcon, label: 'Editar perfil', action: () => handleComingSoon('Editar perfil'), disabled: true },
    { icon: Heart, label: 'Restaurantes favoritos', action: () => handleComingSoon('Restaurantes favoritos'), disabled: true },
    { icon: CreditCard, label: 'Métodos de pago', action: () => handleComingSoon('Métodos de pago'), disabled: true },
    { icon: Bell, label: 'Notificaciones', action: () => handleComingSoon('Notificaciones'), disabled: true },
    { icon: Gift, label: 'Promociones', action: () => handleComingSoon('Promociones'), disabled: true },
    { icon: Settings, label: 'Configuración', action: () => handleComingSoon('Configuración'), disabled: true },
    { icon: HelpCircle, label: 'Ayuda y soporte', action: () => handleComingSoon('Ayuda y soporte'), disabled: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';
  const userEmail = user?.email || 'email@ejemplo.com';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header con perfil */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserIcon className="w-8 h-8" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">{userName}</h1>
            <p className="text-blue-100">{userEmail}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">Usuario nuevo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-xs text-gray-600">Reservas</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-xs text-gray-600">Favoritos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">0</div>
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
                disabled={item.disabled}
                className={`w-full flex items-center justify-between p-4 transition-colors border-b border-gray-100 last:border-b-0 ${
                  item.disabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-gray-50 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${item.disabled ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${item.disabled ? 'text-gray-400' : 'text-gray-400'}`} />
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
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleComingSoon('Contactar soporte')}
              >
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
