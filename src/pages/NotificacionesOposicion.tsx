
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import UrlList from '@/components/notifications/UrlList';
import SubscriptionForm from '@/components/notifications/SubscriptionForm';

interface URL {
  id: string;
  name: string;
  url: string;
}

interface FormData {
  email: string;
  name: string;
}

const NotificacionesOposicion = () => {
  const [urls, setUrls] = useState<URL[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();
  const isStandalonePage = location.pathname === '/notificaciones-oposicion';
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();

  useEffect(() => {
    fetchUrls();
  }, []);

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

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const onSubmit = async (data: FormData) => {
    if (selectedUrls.length === 0) {
      toast({
        title: 'Error',
        description: 'Por favor, selecciona al menos una URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (user) {
        const { error: deleteError } = await supabase
          .from('user_url_subscriptions')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase
          .from('user_url_subscriptions')
          .insert(
            selectedUrls.map(urlId => ({
              user_id: user.id,
              url_id: urlId,
            }))
          );

        if (insertError) throw insertError;

        toast({
          title: '¡Éxito!',
          description: 'Tus suscripciones se han actualizado correctamente.',
        });
        
        triggerConfetti();
      } else {
        const { data: lead, error: leadError } = await supabase
          .from('leads')
          .insert([
            {
              email: data.email,
              name: data.name,
            }
          ])
          .select()
          .single();

        if (leadError) throw leadError;

        const { error: subsError } = await supabase
          .from('lead_url_subscriptions')
          .insert(
            selectedUrls.map(urlId => ({
              lead_id: lead.id,
              url_id: urlId,
            }))
          );

        if (subsError) throw subsError;

        triggerConfetti();
        toast({
          title: '¡Gracias!',
          description: 'Te avisaremos cuando haya actualizaciones.',
        });

        setValue('email', '');
        setValue('name', '');
        setSelectedUrls([]);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar la operación. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerClass = isStandalonePage 
    ? "min-h-screen bg-gray-50 flex items-center justify-center px-4"
    : "";

  const formContainerClass = isStandalonePage
    ? "max-w-md w-full space-y-8"
    : "w-full space-y-6";

  if (error) {
    return (
      <div className={containerClass}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchUrls()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={formContainerClass}>
        {isStandalonePage && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Suscríbete a actualizaciones</h1>
            <p className="mt-2 text-gray-600">
              Selecciona las URLs que te interesan y te avisaremos cuando haya cambios.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {!user && <SubscriptionForm register={register} errors={errors} />}

          <div className="space-y-4 bg-white rounded-lg">
            <UrlList
              urls={urls}
              selectedUrls={selectedUrls}
              isLoading={isLoading}
              onUrlToggle={handleUrlToggle}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || selectedUrls.length === 0}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Guardando...' : user ? 'Guardar suscripciones' : 'Suscribirse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificacionesOposicion;
