import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { getCurrentlyPlaying } from "../utils/spotify";

const Layout = () => {
  const location = useLocation();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dateStr = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' //');

  useEffect(() => {
    // Initial fetch
    fetchCurrentlyPlaying();

    // Poll every 30 seconds to avoid rate limits
    const interval = setInterval(fetchCurrentlyPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentlyPlaying = async () => {
    if (document.hidden) return; // Skip if tab is hidden

    try {
        const data = await getCurrentlyPlaying();
        
        // Check if track has changed
        if (data && data.item) {
            setCurrentTrack(prev => {
                if (!prev || prev.id !== data.item.id) {
                    setIsTransitioning(true);
                    setTimeout(() => setIsTransitioning(false), 500); // Animation duration
                    return data.item;
                }
                return prev;
            });
        } else {
            setCurrentTrack(null);
        }
    } catch (e) {
        console.error("Failed to fetch currently playing", e);
    }
  };

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/dashboard": return "PAGE 1 - INDEX / DASHBOARD";
      case "/top-tracks": return "PAGE 2 - TOP TRACKS";
      case "/top-artists": return "PAGE 3 - TOP ARTISTS";
      case "/mood": return "PAGE 4 - VIBE ANALYSIS";
      case "/history": return "PAGE 5 - PLAY LOG";
      default: return "MOODIFY";
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F2EDE4] text-[#0A0A0A] font-display">
      <Navbar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-[44px] shrink-0 border-b-2 border-[#0A0A0A] flex justify-between items-center px-[36px] bg-[#F2EDE4] z-10 overflow-hidden">
            <div className="flex items-center gap-4 min-w-0">
                {currentTrack ? (
                    <div className={`flex items-center gap-2 transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
                        <div className="w-2 h-2 bg-[#E8360D] rounded-full animate-pulse shrink-0"></div>
                        <span className="text-[#E8360D] text-[10px] tracking-[2px] font-bold uppercase truncate">
                            NOW PLAYING: <span className="text-[#16a34a]">{currentTrack.name} - {currentTrack.artists.map(a => a.name).join(", ")}</span>
                        </span>
                    </div>
                ) : (
                    <span className="text-[#8A8480] text-[10px] tracking-[2px] font-bold uppercase opacity-50">
                        OFFLINE / PAUSED
                    </span>
                )}
            </div>
            <span className="font-mono text-[#8A8480] text-[12px]">
              {dateStr}
            </span>
        </header>
        <div className="flex-1 overflow-y-auto" key={location.pathname}>
            <div className="page-enter min-h-full pb-8">
                <Outlet />
                <div className="text-center py-4 text-[10px] text-[#8A8480] uppercase tracking-widest opacity-50">
                    Powered by Spotify API
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
