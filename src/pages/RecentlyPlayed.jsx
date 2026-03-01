import { useState, useEffect } from "react";
import { getRecentlyPlayed } from "../utils/spotify";
import { cleanText } from "../utils/cleaner";

const RecentlyPlayed = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRecentlyPlayed(50)
            .then(data => {
                setTracks(data?.items || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const formatTime = (ms) => {
        const min = Math.floor(ms / 60000);
        const sec = ((ms % 60000) / 1000).toFixed(0).padStart(2, "0");
        return `${min}:${sec}`;
    };

    const formatPlayedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col min-h-full">
             {/* Hero Section */}
             <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-[#0A0A0A] p-6 md:p-12 pb-8 sticky top-0 bg-[#F2EDE4] z-20">
                <div className="flex items-baseline gap-4">
                    <h1 className="text-[40px] md:text-[56px] font-[800] uppercase leading-[0.9] tracking-[-2px]">
                        Play<br/>Log.
                    </h1>
                </div>
            </div>
            
             {/* Table Header */}
             <div className="px-6 md:px-12 py-4 border-b-2 border-[#0A0A0A] sticky top-[106px] md:top-[124px] bg-[#F2EDE4] z-10 hidden md:grid grid-cols-[120px_40px_2fr_1.5fr_60px] gap-4 items-center">
                 <span className="text-[11px] font-[700] tracking-[4px] text-[#8A8480] uppercase">Played At</span>
                 <span className="text-[11px] font-[700] tracking-[4px] text-[#8A8480] uppercase">Cover</span>
                 <span className="text-[11px] font-[700] tracking-[4px] text-[#8A8480] uppercase">Track / Artist</span>
                 <span className="text-[11px] font-[700] tracking-[4px] text-[#8A8480] uppercase">Album</span>
                 <span className="text-[11px] font-[700] tracking-[4px] text-[#8A8480] uppercase text-right">Duration</span>
             </div>
            
             {/* List */}
             <div className="flex-1 px-6 md:px-12 pb-12">
                {loading ? (
                    <div className="space-y-4 py-8">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-16 border-b border-[rgba(10,10,10,0.1)] animate-pulse bg-[rgba(10,10,10,0.02)]" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {tracks.map((item, i) => (
                            <a 
                                href={item.track.external_urls?.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={item.played_at + i} 
                                style={{ animationDelay: `${i * 0.03}s` }}
                                className="group grid grid-cols-[60px_1fr_auto] md:grid-cols-[120px_40px_2fr_1.5fr_60px] gap-4 py-[10px] border-b border-[rgba(10,10,10,0.1)] items-center hover:pl-[8px] transition-all duration-300 ease-out cursor-pointer hover:bg-[rgba(10,10,10,0.02)] animate-[fadeSlideUp_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
                            >
                                {/* Timestamp */}
                                <span className="font-mono text-[12px] text-[#8A8480] group-hover:text-[#E8360D] transition-colors">
                                    {formatPlayedAt(item.played_at)}
                                </span>
                                
                                {/* Cover */}
                                <div className="hidden md:block w-[40px] h-[40px] bg-black shrink-0 overflow-hidden relative">
                                    {item.track.album.images[0] && (
                                        <img src={item.track.album.images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                                    )}
                                </div>
                                
                                {/* Track Info */}
                                <div className="min-w-0 flex flex-col justify-center">
                                    <h3 className="text-[14px] font-[700] uppercase truncate group-hover:text-[#E8360D] transition-colors leading-tight">
                                        {cleanText(item.track.name)}
                                    </h3>
                                    <p className="text-[12px] text-[#8A8480] uppercase mt-[2px] truncate font-[600]">
                                        {cleanText(item.track.artists.map(a => a.name).join(", "))}
                                    </p>
                                </div>
                                
                                {/* Album (Hidden on mobile) */}
                                <div className="hidden md:block truncate text-[12px] text-[#8A8480] uppercase font-[600]">
                                    {cleanText(item.track.album.name)}
                                </div>
                                
                                {/* Duration */}
                                <div className="text-right font-mono text-[12px] text-[#8A8480]">
                                    {formatTime(item.track.duration_ms)}
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default RecentlyPlayed;
