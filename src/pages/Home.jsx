import { useEffect, useState } from "react";
import { redirectToAuthCodeFlow } from "../utils/auth";
import { getProfile } from "../utils/spotify";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const Home = () => {
  const navigate = useNavigate();
  // Initialize loading based on token presence to avoid effect update
  const [loading, setLoading] = useState(() => !!localStorage.getItem("access_token"));

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      getProfile().then((profile) => {
        if (profile) {
          navigate("/dashboard");
        } else {
            setLoading(false);
        }
      });
    }
  }, [navigate]);

  const handleLogin = () => {
    if (!CLIENT_ID) {
        alert("Please set VITE_SPOTIFY_CLIENT_ID in .env");
        return;
    }
    redirectToAuthCodeFlow(CLIENT_ID);
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-[#0A0A0A] text-white font-mono text-xs tracking-widest animate-pulse">INITIALIZING...</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-display flex flex-col md:flex-row overflow-hidden">
      {/* Left Column */}
      <div className="w-full md:w-[190px] md:h-screen shrink-0 border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.1)] flex flex-col justify-between p-8 z-10 bg-[#0A0A0A]">
        <div>
            <h1 className="text-2xl font-extrabold tracking-tighter text-white mb-2">
                MOOD<span className="text-[#E8360D]">.</span>
            </h1>
            <p className="font-mono text-[8px] text-[rgba(255,255,255,0.4)] tracking-[2px] leading-tight">
                SPOTIFY<br/>ANALYTICS
            </p>
        </div>
        
        <div className="font-mono text-[8px] text-[rgba(255,255,255,0.2)] tracking-widest hidden md:block">
            © 2026<br/>
            MOODIFY<br/>
            V 2.0.1
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 py-12 relative">
        <div className="max-w-4xl z-10">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-8 bg-[#E8360D]"></div>
                <span className="text-[#E8360D] text-[8px] tracking-[6px] font-bold uppercase">
                    Music Intelligence
                </span>
            </div>
            
            <h2 className="text-[48px] md:text-[64px] font-[800] leading-[0.9] tracking-tight mb-8 uppercase">
                Your<br/>
                Sound<br/>
                <span className="text-[#E8360D]">Decoded.</span>
            </h2>
            
            <p className="text-[14px] text-[rgba(255,255,255,0.45)] max-w-[360px] leading-relaxed mb-12 font-normal">
                Moodify turns your Spotify history into sharp visual insights. See your top tracks, artists, and the mood behind your music.
            </p>
            
            <button
                onClick={handleLogin}
                className="group relative px-8 py-4 bg-[#E8360D] text-white font-bold text-[14px] tracking-[3px] uppercase overflow-hidden transition-all hover:bg-white hover:text-[#E8360D]"
            >
                <span className="relative z-10">Connect Spotify</span>
            </button>
        </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex justify-between items-end pointer-events-none z-10">
        <div className="hidden md:block">
            <div className="w-[120px] h-[1px] bg-[rgba(255,255,255,0.2)] mb-4"></div>
            <p className="text-[11px] text-[rgba(255,255,255,0.4)] font-mono tracking-widest">
                EST. 2026<br/>
                BETA VERSION
            </p>
        </div>
        
        <div className="flex gap-8">
            <div className="text-right">
                <h3 className="text-[12px] font-bold tracking-[2px] uppercase mb-1">Analytics</h3>
                <p className="text-[11px] text-[rgba(255,255,255,0.4)] font-mono leading-relaxed">
                    Deep dive into your listening habits
                </p>
            </div>
            <div className="text-right">
                <h3 className="text-[12px] font-bold tracking-[2px] uppercase mb-1">Play Log</h3>
                <p className="text-[11px] text-[rgba(255,255,255,0.4)] font-mono leading-relaxed">
                    Full history of your recent plays
                </p>
            </div>
        </div>
        
        {/* Background typographic element */}
        <div className="absolute bottom-0 right-0 pointer-events-none select-none opacity-[0.03] leading-none overflow-hidden">
             <span className="text-[20vw] font-black uppercase tracking-tighter whitespace-nowrap">
                Moodify
             </span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;
