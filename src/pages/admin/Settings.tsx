
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { useCoupon } from "@/context/CouponContext";
import { toast } from "sonner";
import { Save } from "lucide-react";
import BeginnersGuide from "@/components/settings/BeginnersGuide";
import StoreInfoSection from "@/components/settings/StoreInfoSection";
import DeliverySettingsSection from "@/components/settings/DeliverySettingsSection";
import MessagesSection from "@/components/settings/MessagesSection";
import SocialMediaSection from "@/components/settings/SocialMediaSection";
import CouponsSection from "@/components/settings/CouponsSection";
import StoreHoursSection from "@/components/settings/StoreHoursSection";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useConfirmation } from "@/hooks/useConfirmation";
import { Coupon } from "@/types";

const Settings = () => {
  const { settings, updateSettings } = useStore();
  const { coupons, updateCoupon, addCoupon, deleteCoupon, isLoading: couponsLoading } = useCoupon();
  const confirmation = useConfirmation();
  
  const [formData, setFormData] = useState({
    storeName: settings.storeName,
    whatsappNumber: settings.whatsappNumber,
    deliveryFee: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold || 0,
    welcomeMessage: settings.welcomeMessage || "",
    footerMessage: settings.footerMessage || "",
    customCakeMessage: settings.customCakeMessage || "",
    announcements: settings.announcements || [],
    freeDeliveryMessage: settings.freeDeliveryMessage || `Entrega Grátis acima de R$ ${settings.freeDeliveryThreshold || 0}`,
    showFreeDeliveryBanner: settings.showFreeDeliveryBanner !== false,
    alwaysOpen: settings.alwaysOpen || false,
    storeClosedMessage: settings.storeClosedMessage || "",
    instagram: settings.socialMedia?.instagram || "",
    whatsapp: settings.socialMedia?.whatsapp || ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (e.target instanceof HTMLInputElement && e.target.type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAnnouncementAdd = () => {
    setFormData((prev) => ({
      ...prev,
      announcements: [...prev.announcements, ""]
    }));
  };

  const handleAnnouncementChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedAnnouncements = [...prev.announcements];
      updatedAnnouncements[index] = value;
      return {
        ...prev,
        announcements: updatedAnnouncements
      };
    });
  };

  const handleAnnouncementRemove = (index: number) => {
    setFormData((prev) => {
      const updatedAnnouncements = prev.announcements.filter((_, i) => i !== index);
      return {
        ...prev,
        announcements: updatedAnnouncements
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const confirmed = await confirmation.confirm({
      title: "Salvar Configurações",
      description: "Tem certeza que deseja salvar todas as alterações? Essas configurações afetarão o funcionamento da sua loja.",
      confirmText: "Salvar",
      cancelText: "Cancelar",
      variant: "default"
    });

    if (!confirmed) return;
    
    const socialMedia = {
      instagram: formData.instagram,
      whatsapp: formData.whatsapp
    };
    
    const filteredAnnouncements = formData.announcements.filter(ann => ann.trim() !== "");
    
    updateSettings({
      ...settings,
      storeName: formData.storeName,
      whatsappNumber: formData.whatsappNumber,
      deliveryFee: formData.deliveryFee,
      freeDeliveryThreshold: formData.freeDeliveryThreshold,
      welcomeMessage: formData.welcomeMessage,
      footerMessage: formData.footerMessage,
      customCakeMessage: formData.customCakeMessage,
      announcements: filteredAnnouncements,
      freeDeliveryMessage: formData.freeDeliveryMessage,
      showFreeDeliveryBanner: formData.showFreeDeliveryBanner,
      alwaysOpen: formData.alwaysOpen,
      storeClosedMessage: formData.storeClosedMessage,
      socialMedia
    });
    
    toast.success("Configurações salvas com sucesso!");
  };

  const handleCouponAdd = async (couponData: Omit<Coupon, "active" | "usageCount">) => {
    console.log("Settings: Tentando adicionar cupom:", couponData);
    
    try {
      await addCoupon(couponData);
      console.log("Settings: Cupom adicionado com sucesso");
    } catch (error) {
      console.error("Settings: Erro ao adicionar cupom:", error);
    }
  };

  const handleCouponUpdate = async (coupon: Coupon) => {
    console.log("Settings: Tentando atualizar cupom:", coupon);
    
    try {
      await updateCoupon(coupon);
      console.log("Settings: Cupom atualizado com sucesso");
    } catch (error) {
      console.error("Settings: Erro ao atualizar cupom:", error);
    }
  };

  const handleCouponDelete = async (code: string) => {
    const confirmed = await confirmation.confirm({
      title: "Excluir Cupom",
      description: `Tem certeza que deseja excluir o cupom "${code}"? Esta ação não pode ser desfeita e o cupom não poderá mais ser usado pelos clientes.`,
      confirmText: "Excluir",
      cancelText: "Cancelar",
      variant: "destructive"
    });

    if (!confirmed) return;

    console.log("Settings: Tentando deletar cupom:", code);
    
    try {
      await deleteCoupon(code);
      console.log("Settings: Cupom deletado com sucesso");
    } catch (error) {
      console.error("Settings: Erro ao deletar cupom:", error);
    }
  };

  return (
    <AdminLayout title="Configurações da Loja">
      <div className="space-y-4 md:space-y-6">
        <BeginnersGuide />

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:gap-6">
            <StoreInfoSection
              storeName={formData.storeName}
              whatsappNumber={formData.whatsappNumber}
              onInputChange={handleInputChange}
            />

            <DeliverySettingsSection
              deliveryFee={formData.deliveryFee}
              freeDeliveryThreshold={formData.freeDeliveryThreshold}
              onInputChange={handleInputChange}
            />

            <StoreHoursSection
              alwaysOpen={formData.alwaysOpen}
              storeClosedMessage={formData.storeClosedMessage}
              onInputChange={handleInputChange}
              onSwitchChange={handleSwitchChange}
            />

            <CouponsSection 
              coupons={coupons}
              onCouponAdd={handleCouponAdd}
              onCouponUpdate={handleCouponUpdate}
              onCouponDelete={handleCouponDelete}
              isLoading={couponsLoading}
            />

            <MessagesSection
              welcomeMessage={formData.welcomeMessage}
              footerMessage={formData.footerMessage}
              customCakeMessage={formData.customCakeMessage}
              announcements={formData.announcements}
              freeDeliveryMessage={formData.freeDeliveryMessage}
              showFreeDeliveryBanner={formData.showFreeDeliveryBanner}
              onInputChange={handleInputChange}
              onAnnouncementAdd={handleAnnouncementAdd}
              onAnnouncementChange={handleAnnouncementChange}
              onAnnouncementRemove={handleAnnouncementRemove}
              onSwitchChange={handleSwitchChange}
            />

            <SocialMediaSection
              instagram={formData.instagram}
              whatsapp={formData.whatsapp}
              onInputChange={handleInputChange}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" className="flex items-center gap-2 w-full sm:w-auto">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmationDialog
        open={confirmation.isOpen}
        onOpenChange={confirmation.setIsOpen}
        title={confirmation.options.title}
        description={confirmation.options.description}
        confirmText={confirmation.options.confirmText}
        cancelText={confirmation.options.cancelText}
        variant={confirmation.options.variant}
        onConfirm={confirmation.handleConfirm}
      />
    </AdminLayout>
  );
};

export default Settings;
