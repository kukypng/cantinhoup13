
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, ArrowRight, Lock, Home, User, LogOut, Settings, Gamepad2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile.tsx";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const Header = memo(() => {
  const { totalItems } = useCart();
  const { settings } = useStore();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const isMobile = useIsMobile();
  const isWelcomeVisible = useScrollDirection();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-10 animate-fade-in shadow-lg bg-white/95 backdrop-blur-sm border-b dark:bg-gray-900/95 dark:border-gray-800">
      <div className="container mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6">
        {/* Logo and store name */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center transition-transform duration-300 hover:scale-105">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#FF1B8D] to-[#9747FF] bg-clip-text text-transparent drop-shadow-sm shine-effect">
              {settings.storeName}
            </span>
          </Link>
        </div>

        {/* Desktop actions */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-3">
            {/* Admin access */}
            <Link to="/admin">
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-store-pink hover:border-store-pink btn-pop">
                <Lock className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        )}

        {/* Cart and mobile menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile checkout button - only show when there are items */}
          {isMobile && totalItems > 0 && (
            <Link to="/cart" className="btn-pop">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-store-pink to-store-purple hover:from-store-pink/90 hover:to-store-purple/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                <span className="text-xs font-bold text-white relative z-10">Aqui</span>
                <ArrowRight className="h-3 w-3 text-white relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </Link>
          )}

          {/* Cart icon with counter */}
          <div className="relative">
            <Link to="/cart" className="relative btn-pop group">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-2 sm:p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105 border border-gray-200 dark:border-gray-600">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-store-pink" />
              </div>
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-store-pink to-store-purple text-xs font-bold text-white shadow-lg animate-pulse border-2 border-white dark:border-gray-900">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Cart notification - desktop only */}
            {totalItems > 0 && !isMobile && (
              <Link to="/cart" className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap">
                <div className="flex items-center gap-2 px-4 py-2 shadow-xl rounded-full bg-gradient-to-r from-store-pink to-store-purple hover:from-store-pink/90 hover:to-store-purple/90 transition-all duration-200 hover:scale-105">
                  <span className="text-sm font-semibold text-white">Finalizar Compra</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </Link>
            )}
          </div>
          
          {/* Mobile menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-store-pink hover:bg-store-pink/10 btn-pop p-3 rounded-xl border-2 border-transparent hover:border-store-pink/20 transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-l-2 border-store-pink/20 shadow-2xl backdrop-blur-sm" showCloseButton={false}>
                {/* Header do menu */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-200/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-store-pink/10 to-store-purple/10 rounded-lg">
                      <Menu className="h-5 w-5 text-store-pink" />
                    </div>
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-store-pink to-store-purple bg-clip-text text-transparent">
                      Menu
                    </h2>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-store-pink hover:bg-store-pink/10 rounded-lg">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Navigation menu */}
                <nav className="flex flex-col gap-2 py-6">
                  {/* Home */}
                  <SheetClose asChild>
                    <Link to="/" className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-store-pink hover:bg-store-pink/5 rounded-xl transition-all duration-200 hover:scale-[1.02] group">
                      <div className="p-2 bg-blue-100 group-hover:bg-store-pink/10 rounded-lg transition-colors duration-200">
                        <Home className="h-5 w-5 text-blue-600 group-hover:text-store-pink transition-colors duration-200" />
                      </div>
                      <span className="font-medium">Início</span>
                    </Link>
                  </SheetClose>
                  
                  {/* Cart */}
                  <SheetClose asChild>
                    <Link to="/cart" className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-store-pink hover:bg-store-pink/5 rounded-xl transition-all duration-200 hover:scale-[1.02] group relative">
                      <div className="p-2 bg-green-100 group-hover:bg-store-pink/10 rounded-lg transition-colors duration-200">
                        <ShoppingCart className="h-5 w-5 text-green-600 group-hover:text-store-pink transition-colors duration-200" />
                      </div>
                      <span className="font-medium">Carrinho</span>
                      {totalItems > 0 && (
                        <span className="ml-auto bg-store-pink text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </SheetClose>
                  
                  <Separator className="my-3 bg-gray-200/50" />
                  
                  {/* Authentication section */}
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      {/* Admin section */}
                      {isAdmin && (
                        <>
                          <SheetClose asChild>
                            <Link to="/admin" className="flex items-center gap-4 py-3 px-4 text-store-pink hover:bg-store-pink/5 rounded-xl transition-all duration-200 hover:scale-[1.02] group">
                              <div className="p-2 bg-store-pink/10 group-hover:bg-store-pink/20 rounded-lg transition-colors duration-200">
                                <Lock className="h-5 w-5 text-store-pink" />
                              </div>
                              <span className="font-medium">Área Administrativa</span>
                            </Link>
                          </SheetClose>
                          
                          <SheetClose asChild>
                            <Link to="/admin/settings" className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-store-pink hover:bg-store-pink/5 rounded-xl transition-all duration-200 hover:scale-[1.02] group">
                              <div className="p-2 bg-purple-100 group-hover:bg-store-pink/10 rounded-lg transition-colors duration-200">
                                <Settings className="h-5 w-5 text-purple-600 group-hover:text-store-pink transition-colors duration-200" />
                              </div>
                              <span className="font-medium">Configurações</span>
                            </Link>
                          </SheetClose>
                          
                          {/* Easter egg link */}
                          <SheetClose asChild>
                            <Link to="/easteregg" className="flex items-center gap-4 py-2 px-4 text-gray-400 hover:text-store-pink hover:bg-store-pink/5 rounded-xl transition-all duration-200 hover:scale-[1.02] group">
                              <div className="p-1.5 bg-gray-100 group-hover:bg-store-pink/10 rounded-lg transition-colors duration-200">
                                <Gamepad2 className="h-4 w-4 text-gray-400 group-hover:text-store-pink transition-colors duration-200" />
                              </div>
                              <span className="text-sm font-medium">Easter Egg</span>
                            </Link>
                          </SheetClose>
                          
                          <Separator className="my-3 bg-gray-200/50" />
                        </>
                      )}
                      
                      {/* Logout */}
                      <Button variant="ghost" className="w-full flex justify-start items-center gap-4 py-3 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-[1.02] group h-auto" onClick={handleLogout}>
                        <div className="p-2 bg-red-100 group-hover:bg-red-200 rounded-lg transition-colors duration-200">
                          <LogOut className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="font-medium">Sair</span>
                      </Button>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link to="/login" className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-store-pink hover:bg-store-pink/5 rounded-xl transition-all duration-200 hover:scale-[1.02] group">
                        <div className="p-2 bg-indigo-100 group-hover:bg-store-pink/10 rounded-lg transition-colors duration-200">
                          <User className="h-5 w-5 text-indigo-600 group-hover:text-store-pink transition-colors duration-200" />
                        </div>
                        <span className="font-medium">Entrar</span>
                      </Link>
                    </SheetClose>
                  )}
                </nav>
                
                {/* Social media footer */}
                {settings.socialMedia && (
                  <div className="mt-auto pt-6 border-t border-gray-200/50">
                    <div className="flex justify-center space-x-6">
                      {settings.socialMedia.instagram && (
                        <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="p-3 text-gray-600 hover:text-store-pink hover:bg-store-pink/10 rounded-xl transition-all duration-200 hover:scale-110">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        </a>
                      )}
                      {settings.socialMedia.whatsapp && (
                        <a href={settings.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="p-3 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-110">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-store-pink/5 to-transparent rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-store-purple/5 to-transparent rounded-full blur-3xl -z-10"></div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* Welcome message with improved responsiveness and animation */}
      {settings.welcomeMessage && (
        <div className={`w-full overflow-hidden bg-gradient-to-r from-store-pink/5 via-store-purple/5 to-store-pink/5 border-t border-store-pink/10 transition-all duration-500 ease-in-out ${
          isWelcomeVisible 
            ? 'opacity-100 max-h-16' 
            : 'opacity-0 max-h-0'
        }`}>
          <div className="w-full px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-center">
              <div className="w-1.5 h-1.5 bg-store-pink rounded-full animate-pulse hidden sm:block"></div>
              <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 break-words px-2">
                {settings.welcomeMessage}
              </p>
              <div className="w-1.5 h-1.5 bg-store-purple rounded-full animate-pulse hidden sm:block"></div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Header.displayName = "Header";
export default Header;
