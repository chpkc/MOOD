import { useState, useEffect } from "react";
import { getTopTracks } from "../utils/spotify";
import { cleanText } from "../utils/cleaner";

const TopTracks = () => {
    const [tracks, setTracks] = useState([]);
    const [range, setRange] = useState("short_term");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTopTracks(range, 50)
            .then(data => {
                setTracks(data?.items || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [range]);

    const formatTime = (ms) => {
        const min = Math.floor(ms / 60000);
        const sec = ((ms % 60000) / 1000).toFixed(0).padStart(2, "0");
        return `${min}:${sec}`;
    };

    return (
        <div className="flex flex-col min-h-full">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-[#0A0A0A] p-6 md:p-12 pb-8 sticky top-0 bg-[#F2EDE4] z-20">
                <h1 className="text-[40px] md:text-[56px] font-[800] uppercase leading-[0.9] tracking-[-2px] mb-4 md:mb-0">
                    Your<br/>Tracks.
                </h1>
                
                <div className="flex gap-2 bg-transparent">
                    {[
                        { label: "4 WEEKS", value: "short_term" },
                        { label: "6 MONTHS", value: "medium_term" },
                        { label: "ALL TIME", value: "long_term" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setLoading(true);
                                setRange(opt.value);
                            }}
                            className={`px-4 py-2 text-[11px] font-[700] tracking-[2px] uppercase transition-all duration-200 border border-[#0A0A0A] ${
                                range === opt.value 
                                    ? "bg-[#0A0A0A] text-white" 
                                    : "bg-transparent text-[#0A0A0A] hover:bg-[rgba(10,10,10,0.05)]"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Table Header */}
            <div className="px-6 md:px-12 py-4 border-b-2 border-[#0A0A0A] sticky top-[138px] md:top-[124px] bg-[#F2EDE4] z-10 hidden md:grid grid-cols-[30px_60px_2fr_1.5fr_60px] gap-4 items-center">
                <span className="text-[11px] font-[700] tracking-[4px] text-[#8A8480] uppercase">#</span>
                <span className="text-[11px] font-[700] tracking-[4px] text-[#8A8480] uppercase">Cover</span>
                <span className="text-[11px] font-[700] tracking-[4px] text-[#8A8480] uppercase">Track / Artist</span>
                <span className="text-[11px] font-[700] tracking-[4px] text-[#8A8480] uppercase">Album</span>
                <span className="text-[11px] font-[700] tracking-[4px] text-[#8A8480] uppercase text-right">Time</span>
            </div>

            {/* Tracks List */}
            <div className="flex-1 px-6 md:px-12 pb-12">
                {loading ? (
                     <div className="space-y-4 py-8">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-16 border-b border-[rgba(10,10,10,0.1)] animate-pulse bg-[rgba(10,10,10,0.02)]" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {tracks.map((track, i) => (
                            <a 
                                href={track.external_urls?.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={track.id} 
                                style={{ animationDelay: `${i * 0.03}s` }}
                                className="group grid grid-cols-[30px_auto_1fr] md:grid-cols-[30px_60px_2fr_1.5fr_60px] gap-4 py-[10px] border-b border-[rgba(10,10,10,0.1)] items-center hover:pl-[8px] transition-all duration-300 ease-out cursor-pointer hover:bg-[rgba(10,10,10,0.02)] animate-[fadeSlideUp_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
                            >
                                {/* Index */}
                                <span className="font-mono text-[12px] text-[#8A8480] group-hover:text-[#E8360D] transition-colors">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                
                                {/* Cover */}
                                <div className="w-[48px] h-[48px] bg-black shrink-0 overflow-hidden relative">
                                    {track.album.images[0] && (
                                        <img src={track.album.images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                                    )}
                                </div>
                                
                                {/* Track Info */}
                                <div className="min-w-0 flex flex-col justify-center">
                                    <h3 className="text-[14px] font-[700] uppercase truncate group-hover:text-[#E8360D] transition-colors leading-tight">
                                        {cleanText(track.name)}
                                    </h3>
                                    <p className="text-[12px] text-[#8A8480] uppercase mt-[2px] truncate font-[600]">
                                        {cleanText(track.artists.map(a => a.name).join(", "))}
                                    </p>
                                </div>
                                
                                {/* Album (Hidden on mobile) */}
                                <div className="hidden md:block truncate text-[12px] text-[#8A8480] uppercase font-[600]">
                                    {cleanText(track.album.name)}
                                </div>
                                
                                {/* Time (Hidden on mobile, usually shown though? I'll keep it hidden to match grid or show it absolute) 
                                    Actually mobile view isn't fully specified, I'll prioritize desktop correctness.
                                */}
                                <div className="hidden md:block text-right font-mono text-[12px] text-[#8A8480]">
                                    {formatTime(track.duration_ms)}
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default TopTracks;
