
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wrench, AlertTriangle } from "lucide-react";
import HelpTooltip from "./HelpTooltip";

interface MaintenanceModeSectionProps {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

const MaintenanceModeSection: React.FC<MaintenanceModeSectionProps> = ({
  maintenanceMode,
  maintenanceMessage,
  onInputChange,
  onSwitchChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-orange-600" />
          Modo de Manutenção
          <HelpTooltip text="Ative quando precisar fazer manutenções no sistema. Os clientes verão uma página informativa enquanto você mantém acesso ao painel administrativo." />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {maintenanceMode && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Atenção:</strong> O modo de manutenção está ativo! Os clientes não conseguem acessar a loja normalmente.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="maintenanceMode">Ativar modo de manutenção</Label>
            <p className="text-sm text-muted-foreground">
              Quando ativo, apenas administradores poderão acessar a loja
            </p>
          </div>
          <Switch
            id="maintenanceMode"
            checked={maintenanceMode}
            onCheckedChange={(checked) => onSwitchChange("maintenanceMode", checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenanceMessage">
            Mensagem de manutenção
            <HelpTooltip text="Esta mensagem será exibida para os clientes durante o período de manutenção" />
          </Label>
          <Textarea
            id="maintenanceMessage"
            name="maintenanceMessage"
            value={maintenanceMessage}
            onChange={onInputChange}
            placeholder="Estamos em manutenção. Em breve voltaremos a funcionar normalmente!"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Seja claro e cordial com seus clientes sobre quando a loja voltará a funcionar
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceModeSection;
