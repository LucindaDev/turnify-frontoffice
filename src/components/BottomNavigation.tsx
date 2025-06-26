
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'reservations', label: 'Mis reservaciones', icon: Calendar, path: '/reservations' },
    { id: 'account', label: 'Mi cuenta', icon: User, path: '/account' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                active 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className={`w-5 h-5 mb-1 ${active ? 'text-blue-600' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
