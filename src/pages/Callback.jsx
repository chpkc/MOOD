import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAccessToken } from "../utils/auth";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get("code");
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        console.log("Callback loaded. Code:", code);

        if (code) {
            getAccessToken(CLIENT_ID, code).then((token) => {
                console.log("Token received:", token);
                if (token) {
                    console.log("Navigating to dashboard");
                    navigate("/dashboard");
                } else {
                    console.error("No token received, redirecting to home");
                    navigate("/");
                }
            }).catch(err => {
                console.error("Error getting access token:", err);
                navigate("/");
            });
        } else {
            console.error("No code in URL, redirecting to home");
            navigate("/");
        }
    }, [code, navigate]);

    return <div className="h-screen flex items-center justify-center text-spotify bg-black">Authenticating...</div>;
};

export default Callback;
