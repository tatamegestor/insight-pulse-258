import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePriceAlerts, PriceAlertInput } from "@/hooks/usePriceAlerts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function Notificacoes() {
  const { alerts, isLoading, createAlert, toggleAlert, deleteAlert } = usePriceAlerts();
  const { user, profile } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [phone, setPhone] = useState((profile as any)?.phone_number || "");

  // Form state
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState<"above" | "below">("above");

  const handleCreateAlert = () => {
    if (!symbol || !name || !targetPrice) return;
    
    // Check if phone is set
    if (!(profile as any)?.phone_number) {
      toast({ title: "Configure seu WhatsApp", description: "Cadastre seu número de telefone antes de criar alertas.", variant: "destructive" });
      setPhoneDialogOpen(true);
      return;
    }

    createAlert.mutate(
      { symbol: symbol.toUpperCase(), name, target_price: parseFloat(targetPrice), direction },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setSymbol(""); setName(""); setTargetPrice(""); setDirection("above");
          toast({ title: "Alerta criado!", description: `Você será notificado quando ${symbol.toUpperCase()} ${direction === 'above' ? 'subir acima' : 'cair abaixo'} de R$ ${targetPrice}` });
        },
      }
    );
  };

  const handleSavePhone = async () => {
    if (!user || !phone) return;
    const { error } = await supabase.from("profiles").update({ phone_number: phone } as any).eq("user_id", user.id);
    if (error) {
      toast({ title: "Erro", description: "Não foi possível salvar o telefone.", variant: "destructive" });
    } else {
      toast({ title: "Telefone salvo!", description: "Seu número de WhatsApp foi cadastrado." });
      setPhoneDialogOpen(false);
    }
  };

  const activeAlerts = alerts.filter(a => a.is_active && !a.triggered_at);
  const triggeredAlerts = alerts.filter(a => a.triggered_at);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notificações</h1>
            <p className="text-muted-foreground mt-1">Monitore ativos e receba alertas no WhatsApp</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPhoneDialogOpen(true)} className="gap-2">
              <Phone className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Alerta
            </Button>
          </div>
        </div>

        {/* Phone reminder */}
        {!(profile as any)?.phone_number && (
          <div className="glass-card p-4 border-primary/30 animate-fade-in flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Cadastre seu WhatsApp</p>
              <p className="text-xs text-muted-foreground">Para receber alertas, configure seu número de telefone.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setPhoneDialogOpen(true)}>Configurar</Button>
          </div>
        )}

        {/* Active Alerts */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alertas Ativos ({activeAlerts.length})
          </h2>

          {isLoading ? (
            <p className="text-muted-foreground text-sm">Carregando...</p>
          ) : activeAlerts.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum alerta ativo. Crie um para começar!</p>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className={`p-2 rounded-lg ${alert.direction === 'above' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {alert.direction === 'above' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{alert.symbol}</p>
                    <p className="text-sm text-muted-foreground truncate">{alert.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-foreground">R$ {Number(alert.target_price).toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs">
                      {alert.direction === 'above' ? 'Acima' : 'Abaixo'}
                    </Badge>
                  </div>
                  <Switch
                    checked={alert.is_active}
                    onCheckedChange={(checked) => toggleAlert.mutate({ id: alert.id, is_active: checked })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => deleteAlert.mutate(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Alertas Disparados</h2>
            <div className="space-y-3">
              {triggeredAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/30 opacity-70">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{alert.symbol}</p>
                    <p className="text-sm text-muted-foreground">{alert.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-foreground">R$ {Number(alert.target_price).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.triggered_at && new Date(alert.triggered_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => deleteAlert.mutate(alert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Alert Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Alerta de Preço</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Código do Ativo</Label>
              <Input placeholder="Ex: PETR4" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />
            </div>
            <div className="space-y-2">
              <Label>Nome da Empresa</Label>
              <Input placeholder="Ex: Petrobras" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preço Alvo (R$)</Label>
                <Input type="number" step="0.01" placeholder="35.50" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Condição</Label>
                <Select value={direction} onValueChange={(v) => setDirection(v as 'above' | 'below')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Subir acima de</SelectItem>
                    <SelectItem value="below">Cair abaixo de</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">Cancelar</Button>
              <Button onClick={handleCreateAlert} disabled={createAlert.isPending} className="flex-1">
                {createAlert.isPending ? "Criando..." : "Criar Alerta"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Phone Dialog */}
      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Número do WhatsApp</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Telefone com DDD</Label>
              <Input placeholder="5511999999999" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <p className="text-xs text-muted-foreground">Formato: 55 + DDD + número (sem espaços)</p>
            </div>
            <Button onClick={handleSavePhone} className="w-full">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
