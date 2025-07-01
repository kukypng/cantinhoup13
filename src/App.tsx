
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import GameEasterEgg from "./pages/GameEasterEgg";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Settings from "./pages/admin/Settings";

// Components
import MaintenanceMode from "./components/MaintenanceMode";

// Providers
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { StoreProvider } from "./context/StoreContext";
import { AuthProvider } from "./context/AuthContext";
import { CouponProvider } from "./context/CouponContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Hooks
import { useStore } from "./context/StoreContext";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { settings, isLoaded } = useStore();
  const { isAdmin } = useAuth();

  // Mostrar loading enquanto as configurações carregam
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-store-pink"></div>
      </div>
    );
  }

  // Se modo manutenção está ativo e o usuário não é admin, mostrar página de manutenção
  if (settings.maintenanceMode && !isAdmin) {
    return <MaintenanceMode />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/easteregg" element={<GameEasterEgg />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/products" 
          element={<ProtectedRoute><Products /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/settings" 
          element={<ProtectedRoute><Settings /></ProtectedRoute>} 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <StoreProvider>
            <ProductProvider>
              <CouponProvider>
                <CartProvider>
                  <Toaster />
                  <Sonner />
                  <AppContent />
                </CartProvider>
              </CouponProvider>
            </ProductProvider>
          </StoreProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
