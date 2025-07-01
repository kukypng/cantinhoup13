
import React from "react";
import { BellRing, MapPin } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useStore } from "@/context/StoreContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const AnnouncementsSection: React.FC = () => {
  const { settings } = useStore();

  const hasMultipleAnnouncements = settings.announcements && settings.announcements.length > 1;
  const hasAnnouncements = settings.announcements && settings.announcements.length > 0;
  const showFreeDeliveryBanner = settings.showFreeDeliveryBanner && settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0;

  return (
    <div className="mb-3 sm:mb-4 space-y-2">
      {/* Anúncios principais - mais discretos */}
      {hasAnnouncements && (
        <div className="space-y-2">
          {hasMultipleAnnouncements ? (
            // Carousel para múltiplos anúncios
            <Carousel className="w-full">
              <CarouselContent>
                {settings.announcements!.map((announcement, index) => (
                  <CarouselItem key={index}>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-lg p-3 animate-fade-in">
                      <div className="flex items-start gap-2">
                        <BellRing className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-blue-900 text-sm font-medium">Aviso Importante</p>
                          <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                            {announcement}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {settings.announcements!.length > 1 && (
                <>
                  <CarouselPrevious className="left-1 h-6 w-6" />
                  <CarouselNext className="right-1 h-6 w-6" />
                </>
              )}
            </Carousel>
          ) : (
            // Anúncio único mais discreto
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-lg p-3 animate-fade-in">
              <div className="flex items-start gap-2">
                <BellRing className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-900 text-sm font-medium">Aviso Importante</p>
                  <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                    {settings.announcements![0]}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Banner de frete grátis - mais sutil */}
      {showFreeDeliveryBanner && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200/50 shadow-sm">
            <MapPin className="h-4 w-4 text-amber-600" />
            <span className="text-xs">
              {settings.freeDeliveryMessage || `Entrega Grátis acima de R$ ${settings.freeDeliveryThreshold}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsSection;
