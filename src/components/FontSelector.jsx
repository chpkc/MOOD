import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Type } from "lucide-react";

export const FONTS = [
    { name: "Syne", label: "Syne (Default)" },
    { name: "Bebas Neue", label: "Bebas Neue" },
    { name: "Barlow Condensed", label: "Barlow Condensed" },
    { name: "Anton", label: "Anton" },
    { name: "Oswald", label: "Oswald" },
    { name: "Rajdhani", label: "Rajdhani" },
    { name: "Exo 2", label: "Exo 2" },
    { name: "DM Sans", label: "DM Sans" },
    { name: "Urbanist", label: "Urbanist" },
    { name: "Cabinet Grotesk", label: "Cabinet Grotesk" },
];

const FontSelector = ({ currentFont, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedFont = FONTS.find(f => f.name === currentFont) || FONTS[0];

    return (
        <div className="relative z-[100]" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center bg-[#F2EDE4] border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-[11px] font-[700] uppercase tracking-[1px] px-3 py-2 ${isOpen ? 'bg-[#0A0A0A] text-white' : ''}`}
            >
                <Type size={14} className="shrink-0" />
                
                <div className={`grid transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-cols-[1fr] opacity-100' : 'grid-cols-[0fr] opacity-0 group-hover:grid-cols-[1fr] group-hover:opacity-100'}`}>
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-2 pl-2 min-w-max">
                            <span className="truncate">{selectedFont.label}</span>
                            <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-[220px] bg-[#F2EDE4] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_0px_#0A0A0A] z-[100] max-h-[300px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                    {FONTS.map((font) => (
                        <button
                            key={font.name}
                            onClick={() => {
                                onSelect(font.name);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-[14px] hover:bg-[#E8360D] hover:text-white transition-colors border-b last:border-b-0 border-[rgba(10,10,10,0.1)] flex items-center justify-between ${
                                currentFont === font.name ? "bg-[#0A0A0A] text-white" : "text-[#0A0A0A]"
                            }`}
                            style={{ fontFamily: font.name }}
                        >
                            <span className="truncate">{font.name}</span>
                            {currentFont === font.name && <div className="w-2 h-2 bg-[#E8360D] rounded-full ml-2 shrink-0" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FontSelector;