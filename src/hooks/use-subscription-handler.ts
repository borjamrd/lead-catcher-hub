
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { UseFormReset } from 'react-hook-form';

interface FormData {
  email: string;
  name: string;
}

export const useSubscriptionHandler = (
  selectedUrls: string[], 
  setSelectedUrls: (urls: string[]) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSubscription = async (data: FormData, reset: UseFormReset<FormData>) => {
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

        reset();
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

  return {
    isLoading,
    handleSubscription
  };
};
