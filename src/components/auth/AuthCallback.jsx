import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Use the same key as your RegistryPage: "registry_token"
      localStorage.setItem("registry_token", token);
      
      // Redirect back to registry with a state to trigger the modal
      navigate("/registry", { state: { openSignModal: true } });
    } else {
      navigate("/registry");
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", color: "#5cbdb9", fontFamily: "monospace" }}>
      INITIALIZING_SECURE_SESSION...
    </div>
  );
}