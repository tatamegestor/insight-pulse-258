import { DashboardLayout } from "@/components/DashboardLayout";
import { User, Bell, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Configuracoes() {
  const { user, profile, updateProfile, signOut } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);

  // Notification preferences (localStorage)
  const [priceAlerts, setPriceAlerts] = useState(() => localStorage.getItem('pref_price_alerts') !== 'false');
  const [aiInsights, setAiInsights] = useState(() => localStorage.getItem('pref_ai_insights') !== 'false');
  const [marketNews, setMarketNews] = useState(() => localStorage.getItem('pref_market_news') === 'true');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhoneNumber(profile.phone_number || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await updateProfile({ full_name: fullName, phone_number: phoneNumber });
    setSaving(false);
    if (error) {
      toast.error('Erro ao salvar perfil');
    } else {
      toast.success('Perfil atualizado com sucesso!');
    }
  };

  const togglePref = (key: string, value: boolean, setter: (v: boolean) => void) => {
    localStorage.setItem(key, String(value));
    setter(value);
    toast.success('Preferência atualizada');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas preferências e conta</p>
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
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-muted/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled className="bg-muted/50 border-border opacity-70" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="(11) 99999-9999" className="bg-muted/50 border-border" />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {saving ? 'Salvando...' : 'Salvar Alterações'}
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
                <p className="text-sm text-muted-foreground">Receba notificações quando uma ação atingir seu alvo</p>
              </div>
              <Switch checked={priceAlerts} onCheckedChange={(v) => togglePref('pref_price_alerts', v, setPriceAlerts)} />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">Insights da IA</p>
                <p className="text-sm text-muted-foreground">Receba resumos diários gerados pela IA</p>
              </div>
              <Switch checked={aiInsights} onCheckedChange={(v) => togglePref('pref_ai_insights', v, setAiInsights)} />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">Notícias do Mercado</p>
                <p className="text-sm text-muted-foreground">Atualizações importantes sobre suas ações</p>
              </div>
              <Switch checked={marketNews} onCheckedChange={(v) => togglePref('pref_market_news', v, setMarketNews)} />
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
                <p className="text-foreground font-medium">Alterar Senha</p>
                <p className="text-sm text-muted-foreground">Atualize sua senha regularmente</p>
              </div>
              <Button variant="outline" className="border-border hover:bg-muted" onClick={() => toast.info('Funcionalidade em breve')}>
                Alterar
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card p-6 border-destructive/30 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-lg font-semibold text-destructive mb-4">Zona de Perigo</h2>
          <p className="text-sm text-muted-foreground mb-4">Ações irreversíveis. Proceda com cuidado.</p>
          <Button variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/30" onClick={() => toast.info('Entre em contato com o suporte para excluir sua conta')}>
            Excluir Conta
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
