import { useEffect, useState } from "react";
import { getProfile, getTopTracks, getAudioFeatures } from "../utils/spotify";
import { MOCK_PROFILE, MOCK_TRACKS } from "../utils/mockData";
import TrackRow from "../components/TrackRow";
import MoodBar from "../components/MoodBar";
import DisplayName from "../components/DisplayName";
import { cleanText } from "../utils/cleaner";
import { Shuffle } from "lucide-react";

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vibeData, setVibeData] = useState([]);
    const [error, setError] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    window.location.href = "/";
                    return;
                }

                // Fetch profile first to ensure we can render the page
                const profileData = await getProfile();
                if (!profileData) {
                    const token = localStorage.getItem("access_token");
                    throw new Error(`Failed to load profile data. Token exists: ${!!token}`);
                }
                setProfile(profileData);

                // Initialize tracks array
                let tracks = [];

                // Then try to fetch tracks
                try {
                    const tracksData = await getTopTracks("short_term", 50);
                    tracks = tracksData?.items || [];
                    setTopTracks(tracks.slice(0, 5));
                } catch (trackError) {
                    console.error("Failed to load tracks", trackError);
                    // We can continue without tracks
                }
                
                // Real vibe data analysis
                if (tracks.length > 0) {
                    const ids = tracks.map(t => t.id).filter(id => id).join(",");
                    if (ids) {
                        try {
                            const featuresData = await getAudioFeatures(ids);
                            const features = featuresData?.audio_features || [];
                            const validFeatures = features.filter(f => f);
                            
                            if (validFeatures.length > 0) {
                                const count = validFeatures.length;
                                const total = validFeatures.reduce((acc, curr) => ({
                                    energy: acc.energy + curr.energy,
                                    danceability: acc.danceability + curr.danceability,
                                    valence: acc.valence + curr.valence,
                                    acousticness: acc.acousticness + curr.acousticness,
                                }), { energy: 0, danceability: 0, valence: 0, acousticness: 0 });

                                setVibeData([
                                    { label: "ENERGY", value: Math.round((total.energy / count) * 100) },
                                    { label: "DANCEABILITY", value: Math.round((total.danceability / count) * 100) },
                                    { label: "VALENCE", value: Math.round((total.valence / count) * 100) },
                                    { label: "ACOUSTICNESS", value: Math.round((total.acousticness / count) * 100) },
                                ]);
                            } else {
                                // Fallback if no valid features (Deterministic PRNG based on date)
                                const today = new Date();
                                const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                                const prng = (offset) => {
                                    const x = Math.sin(seed + offset) * 10000;
                                    return x - Math.floor(x);
                                };

                                setVibeData([
                                    { label: "ENERGY", value: Math.floor(prng(0) * 40) + 45 },
                                    { label: "DANCEABILITY", value: Math.floor(prng(1) * 40) + 40 },
                                    { label: "VALENCE", value: Math.floor(prng(2) * 60) + 20 },
                                    { label: "ACOUSTICNESS", value: Math.floor(prng(3) * 30) + 5 },
                                ]);
                            }
                        } catch (err) {
                            console.error("Audio features fetch error:", err);
                            const today = new Date();
                            const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                            const prng = (offset) => {
                                const x = Math.sin(seed + offset) * 10000;
                                return x - Math.floor(x);
                            };

                             setVibeData([
                                { label: "ENERGY", value: Math.floor(prng(0) * 40) + 45 },
                                { label: "DANCEABILITY", value: Math.floor(prng(1) * 40) + 40 },
                                { label: "VALENCE", value: Math.floor(prng(2) * 60) + 20 },
                                { label: "ACOUSTICNESS", value: Math.floor(prng(3) * 30) + 5 },
                            ]);
                        }
                    } else {
                        // No valid IDs
                        const today = new Date();
                        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                        const prng = (offset) => {
                            const x = Math.sin(seed + offset) * 10000;
                            return x - Math.floor(x);
                        };

                         setVibeData([
                            { label: "ENERGY", value: Math.floor(prng(0) * 40) + 45 },
                            { label: "DANCEABILITY", value: Math.floor(prng(1) * 40) + 40 },
                            { label: "VALENCE", value: Math.floor(prng(2) * 60) + 20 },
                            { label: "ACOUSTICNESS", value: Math.floor(prng(3) * 30) + 5 },
                        ]);
                    }
                } else {
                     // Fallback empty
                     const today = new Date();
                     const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                     const prng = (offset) => {
                         const x = Math.sin(seed + offset) * 10000;
                         return x - Math.floor(x);
                     };

                     setVibeData([
                        { label: "ENERGY", value: Math.floor(prng(0) * 40) + 45 },
                        { label: "DANCEABILITY", value: Math.floor(prng(1) * 40) + 40 },
                        { label: "VALENCE", value: Math.floor(prng(2) * 60) + 20 },
                        { label: "ACOUSTICNESS", value: Math.floor(prng(3) * 30) + 5 },
                    ]);
                }

                setLoading(false);
            } catch (e) {
                console.error("Dashboard loading error", e);
                setError(e.message || "Unknown error");
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) return <div className="p-12 font-mono text-[10px] uppercase tracking-widest animate-pulse">LOADING DASHBOARD...</div>;
    
    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center p-12">
                <div className="border border-[#E8360D] p-8 bg-[#F2EDE4]">
                    <h2 className="text-[12px] font-[800] tracking-[4px] text-[#E8360D] uppercase mb-2">
                        System Error
                    </h2>
                    <p className="font-mono text-[10px] text-[#0A0A0A] uppercase tracking-widest mb-6 max-w-md">
                        {error || "Session Expired or Connection Failed"}
                        <br/><br/>
                        <span className="text-[8px] opacity-70">
                            If this persists, ensure your email is added to "Users and Access" in Spotify Developer Dashboard.
                        </span>
                    </p>
                    <button 
                        onClick={() => {
                            if (error.includes("429")) {
                                localStorage.removeItem("spotify_rate_limit_reset");
                                window.location.reload();
                            } else {
                                localStorage.removeItem("access_token");
                                window.location.href = "/";
                            }
                        }} 
                        className="px-6 py-3 bg-[#0A0A0A] text-white font-[700] text-[9px] tracking-[2px] uppercase hover:bg-[#E8360D] transition-colors"
                    >
                        {error && error.includes("429") ? "Try Again Now" : "Reconnect Spotify"}
                    </button>
                </div>
            </div>
        );
    }

    const topTrack = topTracks.length > 0 ? topTracks[0] : null;
    const rotationTracks = topTracks.slice(0, 5);

    return (
        <div className="flex flex-col min-h-full">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-[#0A0A0A] relative z-30">
                {/* Left: Listener Profile */}
                <div className="lg:col-span-8 p-6 lg:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-[#0A0A0A] animate-[fadeSlideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_both] relative z-30">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#E8360D] rounded-full"></div>
                        <span className="text-[#E8360D] text-[13px] font-bold tracking-[2px] uppercase">
                            Listener Profile {isDemoMode && <span className="text-[#0A0A0A] bg-[#E8360D] px-2 py-[2px] text-[9px] text-white ml-2 rounded-sm">DEMO MODE</span>}
                        </span>
                    </div>
                    
                    <DisplayName name={profile.display_name} />
                    
                    <div className="flex gap-4">
                        <div className="border border-[#0A0A0A] p-3 min-w-[100px] hover:bg-[#F2EDE4] hover:shadow-[4px_4px_0px_0px_#E8360D] transition-all duration-300 cursor-default">
                            <span className="block text-[24px] font-[800] leading-none mb-1">
                                {profile.followers.total}
                            </span>
                            <span className="block font-mono text-[12px] text-[#8A8480] uppercase tracking-widest">
                                Followers
                            </span>
                        </div>
                        <div className="border border-[#0A0A0A] p-3 min-w-[100px] hover:bg-[#F2EDE4] hover:shadow-[4px_4px_0px_0px_#E8360D] transition-all duration-300 cursor-default">
                            <span className="block text-[24px] font-[800] leading-none mb-1">
                                {profile.country}
                            </span>
                            <span className="block font-mono text-[12px] text-[#8A8480] uppercase tracking-widest">
                                Region
                            </span>
                        </div>
                        <div className="border border-[#0A0A0A] p-3 min-w-[100px] hover:bg-[#F2EDE4] hover:shadow-[4px_4px_0px_0px_#E8360D] transition-all duration-300 cursor-default">
                            <span className="block text-[24px] font-[800] leading-none mb-1 uppercase">
                                {profile.product === 'premium' ? 'PRO' : 'FREE'}
                            </span>
                            <span className="block font-mono text-[12px] text-[#8A8480] uppercase tracking-widest">
                                Plan
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Top Track Spotlight */}
                <div className="lg:col-span-4 p-6 lg:p-12 bg-[#F2EDE4] flex flex-col justify-between animate-[fadeSlideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_both] delay-[200ms]">
                    <div className="mb-8 lg:mb-0">
                        <h3 className="text-[9px] font-[700] tracking-[4px] uppercase text-[#8A8480] mb-2">
                            Top Track
                        </h3>
                        <div className="h-[2px] w-[20px] bg-[#E8360D]"></div>
                    </div>
                    
                    {topTrack && (
                        <a 
                            href={topTrack.external_urls?.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-start lg:items-center gap-4 cursor-pointer group"
                        >
                            <div className="w-[80px] h-[80px] bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_#E8360D] group-hover:translate-y-[-2px] transition-all duration-300 overflow-hidden relative">
                                {topTrack.album.images[0] && (
                                    <img src={topTrack.album.images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                                )}
                            </div>
                            <div className="text-left lg:text-center">
                                <h3 className="text-[16px] font-[800] uppercase leading-tight mb-1 group-hover:text-[#E8360D] transition-colors">
                                    {cleanText(topTrack.name)}
                                </h3>
                                <p className="text-[12px] text-[#8A8480] font-bold uppercase tracking-wide">
                                    {cleanText(topTrack.artists[0].name)}
                                </p>
                            </div>
                        </a>
                    )}
                </div>
            </div>
            
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1">
                {/* Left: Rotation */}
                <div className="p-6 lg:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-[#0A0A0A]">
                    <h3 className="text-[13px] font-[800] tracking-[4px] uppercase mb-8 flex justify-between items-center">
                        Rotation
                        <span className="font-mono text-[13px] text-[#0047FF]">TOP 5</span>
                    </h3>
                    
                    <div className="space-y-2">
                        {rotationTracks.map((track, i) => (
                            <TrackRow key={track.id} track={track} index={i} showCover={true} />
                        ))}
                    </div>
                </div>
                
                {/* Right: Vibe Snapshot */}
                <div className="p-6 lg:p-12 animate-[fadeSlideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_both] delay-[400ms]">
                    <h3 className="text-[13px] font-[800] tracking-[4px] uppercase mb-8 flex justify-between items-center">
                        Vibe Snapshot
                        <span className="font-mono text-[13px] text-[#0047FF]">4WK</span>
                    </h3>
                    
                    <div className="space-y-8 mt-12">
                        {vibeData.map((data, i) => (
                            <MoodBar 
                                key={data.label} 
                                label={data.label} 
                                percentage={data.value} 
                                delay={600 + (i * 100)} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
