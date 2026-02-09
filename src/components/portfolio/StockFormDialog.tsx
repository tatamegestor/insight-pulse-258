import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PortfolioItem, PortfolioInput } from '@/hooks/usePortfolio';

interface StockFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PortfolioInput) => void;
  stock?: PortfolioItem | null;
  isLoading?: boolean;
}

const STOCK_EMOJIS = ['📈', '💹', '🏦', '🛢️', '⛏️', '⚙️', '🏭', '💊', '🛒', '✈️'];

export function StockFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  stock, 
  isLoading 
}: StockFormDialogProps) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [logo, setLogo] = useState('📈');
  const [purchasedAt, setPurchasedAt] = useState(new Date().toISOString().split('T')[0]);

  const isEditing = !!stock;

  useEffect(() => {
    if (stock) {
      setSymbol(stock.symbol);
      setName(stock.name);
      setQuantity(stock.quantity.toString());
      setAvgPrice(stock.avg_price.toString());
      setLogo(stock.logo);
      setPurchasedAt(stock.purchased_at || new Date().toISOString().split('T')[0]);
    } else {
      setSymbol('');
      setName('');
      setQuantity('');
      setAvgPrice('');
      setLogo('📈');
      setPurchasedAt(new Date().toISOString().split('T')[0]);
    }
  }, [stock, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      symbol,
      name,
      quantity: parseInt(quantity, 10),
      avg_price: parseFloat(avgPrice),
      logo,
      purchased_at: purchasedAt,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Ativo' : 'Adicionar Ativo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Código do Ativo</Label>
            <Input
              id="symbol"
              placeholder="Ex: PETR4"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input
              id="name"
              placeholder="Ex: Petrobras"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgPrice">Preço Médio ($)</Label>
              <Input
                id="avgPrice"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="35.50"
                value={avgPrice}
                onChange={(e) => setAvgPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasedAt">Data da Compra</Label>
            <Input
              id="purchasedAt"
              type="date"
              value={purchasedAt}
              onChange={(e) => setPurchasedAt(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="flex flex-wrap gap-2">
              {STOCK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setLogo(emoji)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    logo === emoji
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
