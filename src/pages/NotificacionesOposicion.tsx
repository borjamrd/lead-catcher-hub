
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const { data, error } = await supabase
        .from('urls')
        .select('*');

      if (error) throw error;
      setUrls(data || []);

      // If user is logged in, fetch their subscriptions
      if (user) {
        const { data: subscriptions, error: subError } = await supabase
          .from('user_url_subscriptions')
          .select('url_id')
          .eq('user_id', user.id);

        if (subError) throw subError;
        setSelectedUrls(subscriptions?.map(sub => sub.url_id) || []);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las URLs. Por favor, inténtalo de nuevo más tarde.',
        variant: 'destructive',
      });
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
        // Delete existing subscriptions first
        const { error: deleteError } = await supabase
          .from('user_url_subscriptions')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // Insert new subscriptions
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
        
        navigate('/dashboard/mis-notificaciones');
      } else {
        // For non-authenticated users, store in leads table
        const { error } = await supabase
          .from('leads')
          .insert([
            {
              email: data.email,
              name: data.name,
              selected_urls: selectedUrls,
            },
          ]);

        if (error) throw error;

        toast({
          title: '¡Gracias!',
          description: 'Te avisaremos cuando haya actualizaciones.',
        });
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Suscríbete a actualizaciones</h1>
          <p className="mt-2 text-gray-600">
            Selecciona las URLs que te interesan y te avisaremos cuando haya cambios.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {!user && (
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Introduce tu nombre"
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                  })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Introduce tu email"
                  {...register('email', {
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
            {urls.map((url) => (
              <div key={url.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <Checkbox
                  id={url.id}
                  checked={selectedUrls.includes(url.id)}
                  onCheckedChange={() => handleUrlToggle(url.id)}
                />
                <label htmlFor={url.id} className="flex items-center space-x-3 cursor-pointer flex-1">
                  <Link className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{url.name}</p>
                    <p className="text-sm text-gray-500">{url.url}</p>
                  </div>
                </label>
              </div>
            ))}
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
