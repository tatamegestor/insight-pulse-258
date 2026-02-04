import { useQuery } from '@tanstack/react-query';
import { getFinanceNews, NewsArticle } from '@/services/newsApi';

export function useFinanceNews(pageSize: number = 5) {
  return useQuery<NewsArticle[]>({
    queryKey: ['financeNews', pageSize],
    queryFn: () => getFinanceNews(pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
