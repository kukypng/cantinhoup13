
import React from "react";
import { Truck, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  text: string;
}

const HelpTooltip = ({ text }: HelpTooltipProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface DeliverySettingsSectionProps {
  deliveryFee: number;
  freeDeliveryThreshold: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DeliverySettingsSection = ({
  deliveryFee,
  freeDeliveryThreshold,
  onInputChange
}: DeliverySettingsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Configurações de Entrega
        </CardTitle>
        <CardDescription>
          Configure as taxas e regras de entrega.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
            <HelpTooltip text="Valor cobrado pela entrega. Use 0 para entrega gratuita para todos os pedidos" />
          </div>
          <Input
            id="deliveryFee"
            name="deliveryFee"
            type="number"
            min="0"
            step="0.01"
            value={deliveryFee}
            onChange={onInputChange}
            placeholder="0.00"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="freeDeliveryThreshold">
              Valor Mínimo para Entrega Grátis (R$)
            </Label>
            <HelpTooltip text="Quando o pedido atingir este valor, a entrega será gratuita" />
          </div>
          <Input
            id="freeDeliveryThreshold"
            name="freeDeliveryThreshold"
            type="number"
            min="0"
            step="0.01"
            value={freeDeliveryThreshold}
            onChange={onInputChange}
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500">
            Deixe como 0 para desativar a entrega grátis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliverySettingsSection;
