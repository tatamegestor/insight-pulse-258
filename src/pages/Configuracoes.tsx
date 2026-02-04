import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Configuracoes() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas preferências e conta
          </p>
        </div>

        {/* Profile Section */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  defaultValue="Investidor"
                  className="bg-muted/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="investidor@email.com"
                  className="bg-muted/50 border-border"
                />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Salvar Alterações
            </Button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notificações</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">Alertas de Preço</p>
                <p className="text-sm text-muted-foreground">
                  Receba notificações quando uma ação atingir seu alvo
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">Insights da IA</p>
                <p className="text-sm text-muted-foreground">
                  Receba resumos diários gerados pela IA
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">Notícias do Mercado</p>
                <p className="text-sm text-muted-foreground">
                  Atualizações importantes sobre suas ações
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Segurança</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">Autenticação em Dois Fatores</p>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Button variant="outline" className="border-border hover:bg-muted">
                Configurar
              </Button>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">Alterar Senha</p>
                <p className="text-sm text-muted-foreground">
                  Atualize sua senha regularmente
                </p>
              </div>
              <Button variant="outline" className="border-border hover:bg-muted">
                Alterar
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card p-6 border-destructive/30 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-lg font-semibold text-destructive mb-4">Zona de Perigo</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ações irreversíveis. Proceda com cuidado.
          </p>
          <Button variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/30">
            Excluir Conta
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
