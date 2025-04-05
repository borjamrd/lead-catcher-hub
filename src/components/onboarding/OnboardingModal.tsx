
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OnboardingChat from "./OnboardingChat";
import OpositionSelect from "./OpositionSelect";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useOppositionStore } from "@/stores/useOppositionStore";

const OnboardingModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuth();
  const { setOnboardingInfo } = useOnboardingStore();
  const { onboardingSelectedOppositionId, setOnboardingOppositionId } = useOppositionStore();

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

        // If data exists, store it in global state
        if (data) {
          setOnboardingInfo(data);
          
          // If there's an opposition_id, also set it in the opposition store
          if (data.opposition_id) {
            setOnboardingOppositionId(data.opposition_id);
          }
        }

        // If no data exists, the user needs onboarding
        setOpen(!data);
      } catch (err) {
        console.error("Unexpected error during onboarding check:", err);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, setOnboardingInfo, setOnboardingOppositionId]);

  // Function to handle opposition selection
  const handleOppositionSelect = (oppositionId: string) => {
    setOnboardingOppositionId(oppositionId);
  };

  // Function to handle confirmation of opposition selection
  const handleOppositionConfirm = () => {
    setShowChat(true);
  };

  // Function to handle successful onboarding completion
  const handleOnboardingComplete = () => {
    setOpen(false);
  };

  // Prevent closing the dialog until onboarding is complete
  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if we're explicitly setting it to closed
    // and we're no longer in the loading state
    if (!newOpen && !loading) {
      setOpen(true);
    }
  };

  if (loading) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] h-[60vh] p-20"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Bienvenid@ a{" "}
            <span className="font-bold">
              <span className="text-oxford_blue">oposita</span>
              <span className="text-yinmn_blue">place</span>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {!showChat ? (
            <OpositionSelect
              user={user}
              onSelect={handleOppositionSelect}
              onConfirm={handleOppositionConfirm}
            />
          ) : (
            <OnboardingChat onComplete={handleOnboardingComplete} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
