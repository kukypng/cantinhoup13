
import React from "react";
import { useStore } from "@/context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Wrench, Clock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const MaintenanceMode = () => {
  const { settings } = useStore();
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo da loja se disponível */}
        {settings.logoUrl && (
          <div className="mb-8">
            <img 
              src={settings.logoUrl} 
              alt={settings.storeName}
              className="mx-auto h-16 w-auto"
            />
          </div>
        )}
        
        {/* Ícone de manutenção */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <Wrench className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {settings.storeName}
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Em Manutenção
        </h2>

        {/* Mensagem personalizada */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Voltaremos em breve</span>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            {settings.maintenanceMessage || 'Estamos em manutenção. Em breve voltaremos a funcionar normalmente!'}
          </p>
        </div>

        {/* Botão de login admin */}
        <div className="mb-8">
          <Button 
            onClick={handleAdminLogin}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Login Admin
          </Button>
        </div>

        {/* Links para redes sociais se disponíveis */}
        {(settings.socialMedia?.instagram || settings.socialMedia?.whatsapp) && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Enquanto isso, nos acompanhe:
            </p>
            
            <div className="flex gap-4 justify-center">
              {settings.socialMedia.instagram && (
                <a
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 transition-colors"
                >
                  Instagram
                </a>
              )}
              
              {settings.socialMedia.whatsapp && (
                <a
                  href={settings.socialMedia.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Obrigado pela sua paciência!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
