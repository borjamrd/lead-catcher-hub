
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Bell, Link } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface URL {
  id: string;
  name: string;
  url: string;
  description: string; // Added this property to match the database schema
}

interface Subscription {
  urls: URL;
}

const MisNotificaciones = () => {
  const { user } = useAuth();
  const { data: urls, isLoading: isLoadingUrls } = useQuery({
    queryKey: ['urls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('urls')
        .select('*');

      if (error) throw error;
      return data as URL[];
    },
  });

  const { data: subscriptions, isLoading: isLoadingSubscriptions, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_url_subscriptions')
        .select(`
          urls (
            id,
            name,
            description,
            url
          )
        `);

      if (error) throw error;
      return data as Subscription[];
    },
  });

  const subscribedUrlIds = subscriptions?.map(sub => sub.urls.id) || [];

  const handleSubscriptionToggle = async (urlId: string, isCurrentlySubscribed: boolean) => {
    if (!user) {
      toast.error('Debes iniciar sesión para suscribirte');
      return;
    }

    try {
      if (isCurrentlySubscribed) {
        const { error } = await supabase
          .from('user_url_subscriptions')
          .delete()
          .eq('url_id', urlId)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Te has dado de baja correctamente');
      } else {
        const { error } = await supabase
          .from('user_url_subscriptions')
          .insert({ 
            url_id: urlId,
            user_id: user.id 
          });

        if (error) throw error;
        toast.success('Te has suscrito correctamente');
      }
      refetch();
    } catch (error) {
      console.error('Error toggling subscription:', error);
      toast.error('Ha ocurrido un error al actualizar la suscripción');
    }
  };

  if (isLoadingUrls || isLoadingSubscriptions) {
    return <div className="p-8">Cargando...</div>;
  }

  if (!urls?.length) {
    return (
      <div className="p-8 text-center">
        <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay URLs disponibles</h3>
        <p className="text-gray-500">
          No hay URLs disponibles para suscribirse en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mis Notificaciones</h2>
          <p className="text-gray-600">
            Selecciona las URLs de las que quieres recibir notificaciones cuando haya cambios.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {urls.map((url) => {
          const isSubscribed = subscribedUrlIds.includes(url.id);
          
          return (
            <div
              key={url.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-start space-x-3">
              
                <div>
                  <h3 className="font-medium text-gray-900">{url.name}</h3>
                  <span>{url.description}</span>
                  <a
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex gap-1 align-middle mt-1"
                  >
                      <Link className="h-4 w-4 text-gray-400" />
                    {url.url}
                  </a>
                </div>
              </div>
              <Checkbox
                checked={isSubscribed}
                onCheckedChange={() => handleSubscriptionToggle(url.id, isSubscribed)}
                className="ml-4"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MisNotificaciones;
