-- Insert sample data into stock_prices table for testing
INSERT INTO public.stock_prices (
  symbol, current_price, market_time, open_price, high_price, low_price, 
  previous_close, volume, variation_daily, variation_monthly, currency, short_name, long_name, 
  logo_url, auto_insight
) VALUES
-- Brazilian Stocks (B3)
('PETR4', 28.45, NOW(), 27.80, 28.95, 27.65, 27.90, 125000000, 1.98, 5.20, 'BRL', 'PETR4', 'Petróleo Brasileiro S.A.', 'https://api.brapi.dev/quote/PETR4?token=YOUR_TOKEN', 'Tendência altista com suporte em R$ 27.50'),
('VALE3', 58.20, NOW(), 56.50, 59.10, 56.40, 56.80, 98000000, 2.47, 8.15, 'BRL', 'VALE3', 'Vale S.A.', 'https://api.brapi.dev/quote/VALE3?token=YOUR_TOKEN', 'Forte recuperação com rompimento de resistência'),
('ITUB4', 31.50, NOW(), 30.85, 32.15, 30.70, 31.05, 156000000, 1.45, 3.82, 'BRL', 'ITUB4', 'Itaú Unibanco Holding S.A.', 'https://api.brapi.dev/quote/ITUB4?token=YOUR_TOKEN', 'Movimento lateral com potencial de alta'),
('MGLU3', 9.35, NOW(), 9.05, 9.60, 8.95, 9.15, 89000000, 2.19, -15.30, 'BRL', 'MGLU3', 'Magazine Luiza S.A.', 'https://api.brapi.dev/quote/MGLU3?token=YOUR_TOKEN', 'Em recuperação após pressão vendedora'),
('ABEV3', 15.80, NOW(), 15.45, 16.10, 15.30, 15.60, 234000000, 1.28, 2.60, 'BRL', 'ABEV3', 'Ambev S.A.', 'https://api.brapi.dev/quote/ABEV3?token=YOUR_TOKEN', 'Estável com bom volume de negociação'),
('BBDC4', 27.15, NOW(), 26.70, 27.60, 26.55, 26.90, 145000000, 0.93, 4.15, 'BRL', 'BBDC4', 'Banco Bradesco S.A.', 'https://api.brapi.dev/quote/BBDC4?token=YOUR_TOKEN', 'Setor bancário em alta com perspectivas positivas'),
('USDBRL', 4.87, NOW(), 4.82, 4.92, 4.80, 4.85, 0, 0.41, 1.25, 'BRL', 'USD', 'Dollar/Real', 'https://api.brapi.dev/quote/USDBRL?token=YOUR_TOKEN', 'Volatilidade esperada com cenário externo'),

-- US Stocks (NASDAQ/NYSE)
('AAPL', 234.50, NOW(), 230.20, 236.80, 229.10, 231.40, 52000000, 1.34, 12.50, 'USD', 'AAPL', 'Apple Inc.', 'https://logo.clearbit.com/apple.com', 'Crescimento sustentado com novos produtos'),
('MSFT', 445.30, NOW(), 438.90, 449.20, 436.50, 442.10, 31000000, 0.72, 18.75, 'USD', 'MSFT', 'Microsoft Corporation', 'https://logo.clearbit.com/microsoft.com', 'IA e cloud computing impulsionam resultados'),
('GOOGL', 198.75, NOW(), 195.20, 201.50, 194.80, 197.30, 28000000, 0.73, 15.30, 'USD', 'GOOGL', 'Alphabet Inc. Class A', 'https://logo.clearbit.com/google.com', 'Publicidade digital com sinais de recuperação'),
('AMZN', 198.35, NOW(), 195.10, 200.60, 194.50, 196.80, 65000000, 0.79, 22.10, 'USD', 'AMZN', 'Amazon.com Inc.', 'https://logo.clearbit.com/amazon.com', 'AWS e varejo eletrônico em expansão'),
('TSLA', 312.45, NOW(), 305.20, 318.90, 303.50, 309.50, 143000000, 0.95, -8.50, 'USD', 'TSLA', 'Tesla Inc.', 'https://logo.clearbit.com/tesla.com', 'Volatilidade com foco em produção')
ON CONFLICT DO NOTHING;
