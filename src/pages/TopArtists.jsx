import { useState, useEffect } from "react";
import { getTopArtists, getArtists } from "../utils/spotify";

const TopArtists = () => {
    const [artists, setArtists] = useState([]);
    const [range, setRange] = useState("short_term");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;
        setError(false);

        const fetchData = async () => {
            try {
                const topArtistsData = await getTopArtists(range, 50);
                if (!mounted) return;
                
                if (topArtistsData && topArtistsData.items) {
                    setArtists(topArtistsData.items);
                } else {
                    setError(true);
                }
            } catch {
                if (mounted) {
                    setError(true);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [range]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center p-12">
                <div className="border border-[#E8360D] p-8 bg-[#F2EDE4]">
                    <h2 className="text-[12px] font-[800] tracking-[4px] text-[#E8360D] uppercase mb-2">
                        System Error
                    </h2>
                    <p className="font-mono text-[10px] text-[#0A0A0A] uppercase tracking-widest">
                        Failed to load // Check Connection
                    </p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-6 px-6 py-3 bg-[#0A0A0A] text-white font-[700] text-[9px] tracking-[2px] uppercase hover:bg-[#E8360D] transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-[#0A0A0A] p-6 md:p-12 pb-8 sticky top-0 bg-[#F2EDE4] z-20">
                <div className="flex items-baseline gap-4">
                    <h1 className="text-[40px] md:text-[56px] font-[800] uppercase leading-[0.9] tracking-[-2px]">
                        Your<br/>Artists.
                    </h1>
                </div>
                
                <div className="flex gap-2 bg-transparent mt-4 md:mt-0">
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
            
            {/* Grid */}
            <div className="flex-1 p-6 md:p-12 pb-12">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] border border-[rgba(10,10,10,0.1)] animate-pulse bg-[rgba(10,10,10,0.02)]" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {artists.map((artist, i) => (
                            <a 
                                href={artist.external_urls?.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={artist.id} 
                                style={{ animationDelay: `${i * 0.05}s` }}
                                className="group border-2 border-[#0A0A0A] bg-[#F2EDE4] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(232,54,13,1)] transition-all duration-300 flex flex-col h-full cursor-pointer animate-[fadeSlideUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
                            >
                                {/* Image */}
                                <div className="w-full aspect-square bg-black relative overflow-hidden">
                                {artist.images && artist.images[0] ? (
                                    <img 
                                        src={artist.images[0].url} 
                                        alt={artist.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                                        🎤
                                    </div>
                                )}
                                
                                {/* Rank Badge */}
                                <div className="absolute top-0 left-0 bg-[#E8360D] text-white font-mono text-[12px] px-2 py-1">
                                    #{String(i + 1).padStart(2, '0')}
                                </div>
                            </div>
                            
                            {/* Info */}
                            <div className="p-3 border-t border-[#0A0A0A] bg-[#F2EDE4] mt-auto">
                                <h3 className="text-[14px] font-[800] uppercase leading-tight mb-1 truncate">
                                    {artist.name}
                                </h3>
                                <p className="text-[11px] text-[#8A8480] font-[700] tracking-[2px] uppercase truncate">
                                    {(artist.genres || []).slice(0, 2).join(", ") || "Artist"}
                                </p>
                            </div>
                        </a>
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopArtists;
