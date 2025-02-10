
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, Bell } from 'lucide-react';

interface Subscription {
  urls: {
    id: string;
    name: string;
    url: string;
  }
}

const MisNotificaciones = () => {
  const { data: subscriptions, isLoading, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_url_subscriptions')
        .select(`
          urls (
            id,
            name,
            url
          )
        `);

      if (error) throw error;
      return data as Subscription[];
    },
  });

  const handleUnsubscribe = async (urlId: string) => {
    try {
      const { error } = await supabase
        .from('user_url_subscriptions')
        .delete()
        .eq('url_id', urlId);

      if (error) throw error;

      toast.success('Te has dado de baja correctamente');
      refetch();
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Error al darte de baja');
    }
  };

  if (isLoading) {
    return <div className="p-8">Cargando...</div>;
  }

  if (!subscriptions?.length) {
    return (
      <div className="p-8 text-center">
        <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes notificaciones activas</h3>
        <p className="text-gray-500 mb-4">
          Suscríbete a URLs para recibir notificaciones cuando haya cambios.
        </p>
        <Button asChild>
          <a href="/notificaciones-oposicion">Gestionar suscripciones</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mis Notificaciones</h2>
        <p className="text-gray-600">
          Recibirás notificaciones cuando haya cambios en las siguientes URLs.
        </p>
      </div>

      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.urls.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-start space-x-3">
              <Link className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">{subscription.urls.name}</h3>
                <a
                  href={subscription.urls.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {subscription.urls.url}
                </a>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => handleUnsubscribe(subscription.urls.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Dar de baja
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisNotificaciones;
