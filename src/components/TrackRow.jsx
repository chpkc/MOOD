import React from 'react';

const TrackRow = ({ track, index, showCover = false }) => {
  const duration = track ? 
    `${Math.floor(track.duration_ms / 60000)}:${((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}` : 
    "--:--";
  
  const popularity = (track && typeof track.popularity === 'number') ? track.popularity : 0;

  return (
    <a 
      href={track?.external_urls?.spotify} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{ animationDelay: `${index * 0.05}s` }}
      className="group grid grid-cols-[24px_1fr_auto] gap-4 py-[10px] border-b border-[rgba(10,10,10,0.07)] items-center hover:pl-[8px] transition-all duration-300 ease-out cursor-pointer hover:bg-[rgba(10,10,10,0.02)] animate-[fadeSlideUp_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
    >
      <span className="font-mono text-[11px] text-[#8A8480] group-hover:text-[#E8360D] transition-colors">
        {String(index + 1).padStart(2, '0')}
      </span>
      
      <div className="flex items-center gap-3 min-w-0">
        {showCover && track?.album?.images?.[0] && (
            <div className="w-12 h-12 bg-black shrink-0 overflow-hidden relative">
                <img src={track.album.images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
            </div>
        )}
        <div className="min-w-0">
            <h3 className="text-[13px] md:text-[15px] font-[700] uppercase truncate group-hover:text-[#E8360D] transition-colors">
            {track?.name || "Track Name"}
            </h3>
            <p className="text-[12px] text-[#8A8480] uppercase mt-[2px] truncate">
            {track?.artists?.map(a => a.name).join(", ") || "Artist"}
            </p>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-[11px] text-[#8A8480]">
            {duration}
        </div>
      </div>
    </a>
  );
};

export default TrackRow;
