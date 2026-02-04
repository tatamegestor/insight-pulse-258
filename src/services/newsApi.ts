const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';
const BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// Mock data for fallback when API is unavailable
const mockNews: NewsArticle[] = [
  {
    source: { id: null, name: "Reuters" },
    author: "Paula Arend Laier",
    title: "Ibovespa recua com bancos após resultado do Santander Brasil",
    description: "O Ibovespa recuava nesta quarta-feira, após renovar máximas na véspera, com bancos entre as maiores pressões negativas, tendo no radar resultado do Santander Brasil no último trimestre do ano passado.",
    url: "https://example.com",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    publishedAt: new Date().toISOString(),
    content: null
  },
  {
    source: { id: null, name: "InfoMoney" },
    author: "Redação",
    title: "Dólar opera em alta com mercado de olho em dados econômicos",
    description: "Moeda americana avança frente ao real em dia de agenda econômica relevante nos EUA.",
    url: "https://example.com",
    urlToImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
    publishedAt: new Date().toISOString(),
    content: null
  },
  {
    source: { id: null, name: "Valor Econômico" },
    author: "Redação",
    title: "Petrobras anuncia novos investimentos em energia renovável",
    description: "Estatal planeja expandir portfólio de energia limpa nos próximos anos.",
    url: "https://example.com",
    urlToImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
    publishedAt: new Date().toISOString(),
    content: null
  },
  {
    source: { id: null, name: "Bloomberg" },
    author: "Market Team",
    title: "Vale reporta aumento na produção de minério de ferro",
    description: "Mineradora brasileira supera expectativas do mercado com resultados trimestrais.",
    url: "https://example.com",
    urlToImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    publishedAt: new Date().toISOString(),
    content: null
  },
  {
    source: { id: null, name: "Exame" },
    author: "Economia",
    title: "Banco Central mantém Selic em decisão unânime",
    description: "Copom decide manter taxa básica de juros, em linha com expectativas do mercado.",
    url: "https://example.com",
    urlToImage: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800&q=80",
    publishedAt: new Date().toISOString(),
    content: null
  }
];

export async function getFinanceNews(pageSize: number = 5): Promise<NewsArticle[]> {
  // If no API key, return mock data
  if (!NEWS_API_KEY) {
    console.log('NEWS_API_KEY not found, using mock data');
    return mockNews.slice(0, pageSize);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=mercado+financeiro+OR+bolsa+OR+ibovespa&language=pt&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      console.warn('News API error, using mock data');
      return mockNews.slice(0, pageSize);
    }

    const data: NewsResponse = await response.json();
    
    // Filter out articles without images
    const articlesWithImages = data.articles.filter(article => article.urlToImage);
    
    return articlesWithImages.length > 0 ? articlesWithImages : mockNews.slice(0, pageSize);
  } catch (error) {
    console.error('Error fetching news:', error);
    return mockNews.slice(0, pageSize);
  }
}
