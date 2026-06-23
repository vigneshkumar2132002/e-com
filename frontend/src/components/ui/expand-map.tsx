"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Compass } from "lucide-react"

interface LocationMapProps {
  location?: string
  coordinates?: string
  className?: string
}

export function LocationMap({
  location = "Bapuji Surgicals",
  coordinates = "12.9145° N, 77.6333° E",
  className,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-[#FAF9F6] border border-border shadow-md hover:shadow-lg w-full h-[300px] md:h-[450px]"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-muted/10 pointer-events-none z-10" />

        {/* Detailed Map SVG Background */}
        <div className="absolute inset-0 z-0">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 800 400" 
            preserveAspectRatio="xMidYMid slice"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Gradients definitions */}
            <defs>
              <pattern id="detailedMapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(9, 118, 188, 0.03)" strokeWidth="1" />
              </pattern>
              <linearGradient id="lakeGradient" x1="580" y1="0" x2="800" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="100%" stopColor="#BAE6FD" />
              </linearGradient>
              <linearGradient id="parkGradient" x1="0" y1="280" x2="180" y2="400" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F0FDF4" />
                <stop offset="100%" stopColor="#DCFCE7" />
              </linearGradient>
            </defs>

            {/* Base Background */}
            <rect width="800" height="400" fill="#FAF9F6" />
            <rect width="800" height="400" fill="url(#detailedMapGrid)" />

            {/* Agara Lake - Top Right */}
            <path 
              d="M 640 0 C 670 40, 710 65, 800 80 L 800 0 Z" 
              fill="url(#lakeGradient)" 
              stroke="#bae6fd" 
              strokeWidth="1"
            />
            
            {/* Sector 6 Park - Bottom Left */}
            <path
              d="M 15 280 C 50 280, 85 295, 115 315 C 145 335, 160 360, 175 400 L 0 400 L 0 280 Z"
              fill="url(#parkGradient)"
              stroke="#dcfce7"
              strokeWidth="1"
            />

            {/* Park Pathways */}
            <path
              d="M 30 310 Q 70 330 100 360 T 140 395 M 0 350 Q 50 360 100 390"
              stroke="#86EFAC"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              fill="none"
              opacity="0.75"
            />

            {/* Road Casing (Underlay) */}
            <line x1="0" y1="70" x2="800" y2="70" stroke="#E2E8F0" strokeWidth="22" />
            <line x1="230" y1="70" x2="230" y2="400" stroke="#E2E8F0" strokeWidth="14" />
            <line x1="600" y1="70" x2="600" y2="400" stroke="#E2E8F0" strokeWidth="12" />
            <line x1="0" y1="320" x2="800" y2="320" stroke="#E2E8F0" strokeWidth="12" />
            <line x1="230" y1="200" x2="600" y2="200" stroke="#E0F2FE" strokeWidth="10" />

            {/* Road Core (Overlay) */}
            <line x1="0" y1="70" x2="800" y2="70" stroke="#94A3B8" strokeWidth="14" />
            <line x1="0" y1="70" x2="800" y2="70" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="8 6" />
            <line x1="230" y1="70" x2="230" y2="400" stroke="#CBD5E1" strokeWidth="6" />
            <line x1="600" y1="70" x2="600" y2="400" stroke="#CBD5E1" strokeWidth="4" />
            <line x1="0" y1="320" x2="800" y2="320" stroke="#CBD5E1" strokeWidth="4" />
            <line x1="230" y1="200" x2="600" y2="200" stroke="#0976BC" strokeWidth="2.5" strokeOpacity="0.85" />

            {/* Local Streets */}
            <line x1="450" y1="70" x2="450" y2="320" stroke="#E2E8F0" strokeWidth="3" strokeDasharray="4 3" />
            <line x1="230" y1="130" x2="600" y2="130" stroke="#E2E8F0" strokeWidth="3" strokeDasharray="4 3" />
            <line x1="0" y1="210" x2="230" y2="210" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 3" />

            {/* Residential Plots */}
            <g opacity="0.75">
              {/* Plot group left */}
              <rect x="25" y="100" width="30" height="15" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="25" y="120" width="30" height="15" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="30" y="140" width="30" height="15" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="30" y="225" width="30" height="15" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="30" y="245" width="30" height="15" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />

              {/* Plot group center top */}
              <rect x="260" y="90" width="35" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="305" y="90" width="35" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="350" y="90" width="35" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="260" y="145" width="35" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="305" y="145" width="35" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="350" y="145" width="35" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />

              {/* Plot group center bottom */}
              <rect x="260" y="250" width="35" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="305" y="250" width="35" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="350" y="250" width="35" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />

              {/* Plot group bottom right */}
              <rect x="485" y="335" width="30" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="525" y="335" width="30" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
              <rect x="565" y="335" width="30" height="18" rx="1.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
            </g>

            {/* Landmark Buildings */}
            {/* Asha Tiffins */}
            <g>
              <rect x="100" y="90" width="80" height="32" rx="4" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
              <text x="140" y="109" fontSize="6.5" fontWeight="800" fill="#B45309" textAnchor="middle">Asha Tiffins</text>
            </g>

            {/* UIDAI Aadhaar Kendra */}
            <g>
              <rect x="100" y="150" width="80" height="32" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
              <text x="140" y="169" fontSize="6.5" fontWeight="800" fill="#475569" textAnchor="middle">UIDAI Aadhaar</text>
            </g>

            {/* Teachers Colony residential blocks */}
            <g>
              <rect x="485" y="90" width="90" height="32" rx="4" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
              <text x="530" y="109" fontSize="7" fontWeight="800" fill="#475569" textAnchor="middle">Teachers Colony</text>
            </g>

            {/* Sector 6 Post Office */}
            <g>
              <rect x="475" y="240" width="90" height="28" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
              <text x="520" y="257" fontSize="6.5" fontWeight="800" fill="#475569" textAnchor="middle">Post Office</text>
            </g>

            {/* Narayana Multispeciality Hospital */}
            <g>
              <rect x="635" y="270" width="85" height="42" rx="5" fill="#FFF5F5" stroke="#FECACA" strokeWidth="1" />
              <text x="677.5" y="290" fontSize="7" fontWeight="800" fill="#C53030" textAnchor="middle">Narayana</text>
              <text x="677.5" y="300" fontSize="6" fontWeight="700" fill="#C53030" textAnchor="middle">Hospital</text>
            </g>

            {/* Bapuji Surgicals HQ Building footprint */}
            <g>
              <rect 
                x="350" y="175" width="100" height="50" rx="8" 
                fill="#F0F9FF" stroke="#0976BC" strokeWidth="2" 
                style={{ filter: "drop-shadow(0 4px 12px rgba(9, 118, 188, 0.2))" }}
              />
              <text x="400" y="198" fontSize="8.5" fontWeight="900" fill="#0976BC" textAnchor="middle" letterSpacing="0.05em">BAPUJI</text>
              <text x="400" y="209" fontSize="6.5" fontWeight="800" fill="#0976BC" textAnchor="middle">SURGICALS HQ</text>
            </g>

            {/* Pulsing signal halo in the center of Bapuji HQ */}
            <motion.circle
              cx="400"
              cy="200"
              r="25"
              fill="rgba(9, 118, 188, 0.12)"
              stroke="rgba(9, 118, 188, 0.3)"
              strokeWidth="0.75"
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.6, 0.05, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Road Text Labels */}
            <g opacity="0.95">
              <text x="140" y="63" fontSize="7.5" fontWeight="800" fill="#475569" letterSpacing="0.08em">OUTER RING ROAD</text>
              <text x="500" y="63" fontSize="7.5" fontWeight="800" fill="#475569" letterSpacing="0.08em">OUTER RING ROAD</text>
              <text x="480" y="313" fontSize="7" fontWeight="800" fill="#64748B" letterSpacing="0.05em">15TH CROSS ROAD</text>
              <text x="270" y="192" fontSize="6.5" fontWeight="800" fill="#0976BC" letterSpacing="0.03em">14TH 'B' CROSS ROAD</text>
              <text x="223.5" y="250" fontSize="7.5" fontWeight="800" fill="#64748B" transform="rotate(-90 223.5 250)" textAnchor="middle">14TH MAIN ROAD</text>
              <text x="593.5" y="250" fontSize="7" fontWeight="800" fill="#64748B" transform="rotate(-90 593.5 250)" textAnchor="middle">7TH MAIN ROAD</text>
            </g>

            {/* Water label */}
            <text x="720" y="35" fontSize="7.5" fontWeight="800" fill="#0369A1" letterSpacing="0.05em" opacity="0.8">AGARA LAKE</text>

            {/* Park label */}
            <text x="50" y="340" fontSize="7.5" fontWeight="800" fill="#15803D" letterSpacing="0.05em" opacity="0.8">SEC 6 PARK</text>
          </svg>
        </div>

        {/* Center marker Pin (HTML overlay absolute centered) */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 20, delay: 0.35 }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-lg"
            style={{ filter: "drop-shadow(0 4px 10px rgba(9, 118, 188, 0.45))" }}
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#0976BC" />
            <circle cx="12" cy="9" r="2.5" fill="#FAF9F6" />
          </svg>
        </motion.div>

        {/* Shadow Overlay at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/95 via-background/40 to-transparent pointer-events-none z-10" />

        {/* Floating Controls Content */}
        <div className="relative z-20 h-full flex flex-col justify-between p-5 pointer-events-none">
          {/* Top Row: Navigation status (GPS Badge) */}
          <div className="flex items-start justify-between pointer-events-auto">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border/40 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-blue-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">GPS Online</span>
            </div>
          </div>

          {/* Bottom Row: Info Labels */}
          <div className="space-y-1 z-20 pointer-events-auto">
            <motion.h3
              className="text-foreground font-bold text-base tracking-tight"
              animate={{
                x: isHovered ? 4 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {location}
            </motion.h3>

            <p className="text-muted-foreground text-[10px] md:text-xs font-mono">
              {coordinates}
            </p>

            {/* Animated underline */}
            <motion.div
              className="h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{
                scaleX: isHovered ? 1 : 0.25,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
