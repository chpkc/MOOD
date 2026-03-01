import React, { useState, useEffect, useRef } from 'react';
import FontSelector from './FontSelector';

const DisplayName = ({ name }) => {
    const [currentFont, setCurrentFont] = useState(() => {
        return localStorage.getItem("dashboard_font") || "Syne";
    });
    const [displayedName, setDisplayedName] = useState(name);
    const [isTyping, setIsTyping] = useState(false);
    
    // Update displayed name if prop changes (initial load)
    useEffect(() => {
        if (!isTyping) {
            setDisplayedName(name);
        }
    }, [name]);

    const handleFontChange = (fontName) => {
        if (isTyping || !name) return;
        setIsTyping(true);
        
        const originalText = name;
        
        // Immediate switch
        setDisplayedName(""); 
        setCurrentFont(fontName);
        localStorage.setItem("dashboard_font", fontName);
        
        let j = 0;
        let lastTime = performance.now();
        const typeSpeed = 40; // ms per char

        const animateTyping = (time) => {
            const deltaTime = time - lastTime;
            
            if (deltaTime >= typeSpeed) {
                j++;
                setDisplayedName(originalText.slice(0, j));
                lastTime = time;
            }
            
            if (j < originalText.length) {
                requestAnimationFrame(animateTyping);
            } else {
                setIsTyping(false);
            }
        };
        
        requestAnimationFrame(animateTyping);
    };

    return (
        <div className="flex items-baseline gap-4 mb-8 relative z-50">
            <h1 
                className="text-[48px] md:text-[72px] font-[800] uppercase leading-[0.85] tracking-[-2px] break-words transition-all duration-300 min-h-[0.85em]"
                style={{ fontFamily: currentFont }}
            >
                {displayedName}
                {isTyping && <span className="animate-pulse">|</span>}
            </h1>
            <div className="relative top-[-8px]">
                <FontSelector currentFont={currentFont} onSelect={handleFontChange} />
            </div>
        </div>
    );
};

export default DisplayName;