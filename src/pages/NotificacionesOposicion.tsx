
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import UrlList from '@/components/notifications/UrlList';
import SubscriptionForm from '@/components/notifications/SubscriptionForm';
import ErrorDisplay from '@/components/notifications/ErrorDisplay';
import { useUrlSubscriptions } from '@/hooks/use-url-subscriptions';
import { useSubscriptionHandler } from '@/hooks/use-subscription-handler';

interface FormData {
  email: string;
  name: string;
}

const NotificacionesOposicion = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/notificaciones-oposicion';
  const { user } = useAuth();
  
  const {
    urls,
    selectedUrls,
    isLoading,
    error,
    handleUrlToggle,
    refetchUrls,
    setSelectedUrls
  } = useUrlSubscriptions();

  const {
    isLoading: isSubmitting,
    handleSubscription
  } = useSubscriptionHandler(selectedUrls, setSelectedUrls);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    handleSubscription(data, reset);
  };

  const containerClass = isStandalonePage 
    ? "min-h-screen bg-gray-50 flex items-center justify-center px-4"
    : "";

  const formContainerClass = isStandalonePage
    ? "max-w-md w-full space-y-8"
    : "w-full space-y-6";

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetchUrls}
        className={containerClass}
      />
    );
  }

  return (
    <div className={containerClass}>
      <div className={formContainerClass}>
        {isStandalonePage && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">¿List@ para recibir actualizaciones?</h1>
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
            disabled={isSubmitting || selectedUrls.length === 0}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Guardando...' : user ? 'Guardar suscripciones' : 'Suscribirse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificacionesOposicion;
