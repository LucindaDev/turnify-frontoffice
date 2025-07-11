
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthWrapper from "./components/AuthWrapper";
import { PhoneValidationProvider } from "./components/PhoneValidationWrapper";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import Account from "./pages/Account";
import RestaurantDetail from "./pages/RestaurantDetail";
import ReservationDetail from "./pages/ReservationDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthWrapper>
          <PhoneValidationProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/reservation/:id" element={<ReservationDetail />} />
              <Route path="/account" element={<Account />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PhoneValidationProvider>
        </AuthWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
