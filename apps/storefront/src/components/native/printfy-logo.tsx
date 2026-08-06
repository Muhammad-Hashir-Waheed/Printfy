/** Printfy brand mark — inline so it never 404s via redirects */
export function PrintfyLogo({ className }: { className?: string }) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 64 64"
         fill="none"
         className={className}
         role="img"
         aria-label="Printfy"
      >
         <defs>
            <linearGradient id="printfyLogoBg" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
               <stop stopColor="#FF5A52" />
               <stop offset="0.55" stopColor="#7C5CFC" />
               <stop offset="1" stopColor="#5EEAD4" />
            </linearGradient>
            <linearGradient id="printfyLogoLid" x1="18" y1="14" x2="46" y2="28" gradientUnits="userSpaceOnUse">
               <stop stopColor="#FFFFFF" stopOpacity="0.95" />
               <stop offset="1" stopColor="#E8ECF5" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="printfyLogoFace" x1="20" y1="28" x2="44" y2="52" gradientUnits="userSpaceOnUse">
               <stop stopColor="#1A2236" />
               <stop offset="1" stopColor="#0B1220" />
            </linearGradient>
         </defs>
         <rect width="64" height="64" rx="16" fill="url(#printfyLogoBg)" />
         <path d="M32 14 L48 22 L32 30 L16 22 Z" fill="url(#printfyLogoLid)" />
         <path d="M16 22 L32 30 L32 48 L16 40 Z" fill="#0F172A" opacity="0.92" />
         <path d="M32 30 L48 22 L48 40 L32 48 Z" fill="url(#printfyLogoFace)" />
         <path d="M20 25.5 L32 31.5 L44 25.5 L32 19.5 Z" fill="#FF5A52" opacity="0.9" />
         <circle cx="46" cy="16" r="2.2" fill="#5EEAD4" />
         <circle cx="18" cy="46" r="1.6" fill="#FFFFFF" opacity="0.85" />
      </svg>
   )
}
