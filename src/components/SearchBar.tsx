
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  return (
    <div className="bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <MapPin className="w-5 h-5 text-gray-600" />
        <div>
          <p className="text-sm font-medium text-gray-900">Ubicación actual</p>
          <p className="text-xs text-gray-500">Ciudad de México, CDMX</p>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="¿Dónde quieres reservar?"
          className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl"
        />
      </div>
    </div>
  );
};

export default SearchBar;
