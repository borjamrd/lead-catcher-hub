
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface URL {
  id: string;
  name: string;
  url: string;
}

export const useUrlSubscriptions = () => {
  const [urls, setUrls] = useState<URL[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUrls = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching URLs...');
      
      const { data: urlsData, error: urlsError } = await supabase
        .from('urls')
        .select('*')
        .eq('active', true);

      if (urlsError) {
        console.error('Error fetching URLs:', urlsError);
        throw urlsError;
      }

      console.log('URLs fetched:', urlsData);
      setUrls(urlsData || []);

      if (user) {
        console.log('Fetching user subscriptions...');
        const { data: subscriptions, error: subError } = await supabase
          .from('user_url_subscriptions')
          .select('url_id')
          .eq('user_id', user.id);

        if (subError) {
          console.error('Error fetching subscriptions:', subError);
          throw subError;
        }

        console.log('User subscriptions:', subscriptions);
        setSelectedUrls(subscriptions?.map(sub => sub.url_id) || []);
      }
    } catch (error: any) {
      console.error('Error in fetchUrls:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las URLs. Por favor, inténtalo de nuevo más tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlToggle = (urlId: string) => {
    setSelectedUrls(prev => {
      if (prev.includes(urlId)) {
        return prev.filter(id => id !== urlId);
      }
      return [...prev, urlId];
    });
  };

  useEffect(() => {
    fetchUrls();
  }, [user]);

  return {
    urls,
    selectedUrls,
    isLoading,
    error,
    handleUrlToggle,
    fetchUrls,
    setSelectedUrls
  };
};
