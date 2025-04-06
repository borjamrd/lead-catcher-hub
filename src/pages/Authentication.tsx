
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IniciaSesion from "./IniciaSesion";
import { useAuth } from "@/contexts/AuthContext";

const Authentication = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return <IniciaSesion />;
};

export default Authentication;
