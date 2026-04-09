import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        const isAdmin = searchParams.get("isAdmin") === "true";
        console.log("token", token);
        console.log("isAdmin", isAdmin);

        if (token) {
            // Use the same key as your RegistryPage: "registry_token"
            localStorage.setItem("registry_token", token);
            localStorage.setItem("isAdmin",isAdmin);

            // Redirect back to registry with a state to trigger the modal
            navigate("/registry", { state: { openSignModal: false, isAdmin: isAdmin } });
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