
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import OnboardingChat from "./OnboardingChat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const OnboardingModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkOnboardingStatus = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('onboarding_info')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking onboarding status:', error);
          return;
        }

        // If no data exists, the user needs onboarding
        setOpen(!data);
      } catch (err) {
        console.error('Unexpected error during onboarding check:', err);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  // Prevent closing the dialog until onboarding is complete
  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if we're explicitly setting it to closed
    // and we're no longer in the loading state
    if (!newOpen && !loading) {
      setOpen(newOpen);
    }
  };

  if (loading) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] h-[80vh]"
        // Remove the close button by passing an empty close icon
        closeIcon={<></>}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Bienvenido a tu Plataforma de Oposiciones</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <OnboardingChat />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
