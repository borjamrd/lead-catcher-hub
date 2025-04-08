import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useOppositionStore } from "@/stores/useOppositionStore";
import { useEffect, useState } from "react";
import OnboardingChat from "./OnboardingChat";
import OpositionSelect from "./OpositionSelect";

const OnboardingModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { setOnboardingInfo, setOnboardingDone, isOnboardingDone } = useOnboardingStore();
  const { currentSelectedOppositionId, setOnboardingOppositionId } = useOppositionStore();

  useEffect(() => {
    if (!user) return;

    const checkOnboardingStatus = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("onboarding_info")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking onboarding status:", error);
          return;
        }

        if (data) {
          setOnboardingInfo(data);
          setOnboardingDone(true);
          if (data.opposition_id) {
            setOnboardingOppositionId(data.opposition_id);
          }
        } else {
          setOpen(true);
        }
      } catch (err) {
        console.error("Unexpected error during onboarding check:", err);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const handleOppositionSelect = (oppositionId: string) => {
    setOnboardingOppositionId(oppositionId);
  };

  const handleOnboardingComplete = () => {
    setOpen(false);
    setOnboardingDone(true); // <- clave
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Solo permitir cerrar si ya se completó
    if (!newOpen && !loading && !isOnboardingDone) {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        closeIcon={false}
        className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] h-[90vh] p-10"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
           Onboarding
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {!currentSelectedOppositionId ? (
            <OpositionSelect user={user} onSelect={handleOppositionSelect} />
          ) : (
            <OnboardingChat onComplete={handleOnboardingComplete} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
