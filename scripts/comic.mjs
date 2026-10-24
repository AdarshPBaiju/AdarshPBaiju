export const comicCss = `
text{font-family:'Trebuchet MS',Arial,sans-serif}
text[font-weight="700"]{font-family:Impact,'Arial Black',Arial,sans-serif;letter-spacing:.2px}
.mono{font-family:Consolas,'Liberation Mono',monospace;font-weight:700;letter-spacing:.6px}
.motion-border{stroke:#1B1B25;stroke-opacity:.5;stroke-width:2}
.motion-packet{stroke:#244BC4;stroke-width:4}
.motion-rise{animation-name:comic-pop}
.calendar-cell rect{stroke:#1B1B25;stroke-width:.8}
.comic-spark{transform-box:fill-box;transform-origin:center;animation:comic-spark 3s steps(2,end) infinite}
.comic-bubble{animation:comic-pop .7s cubic-bezier(.2,.8,.3,1.3) both;animation-delay:.3s}
@keyframes comic-pop{from{opacity:0;transform:translateY(9px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes comic-spark{50%{opacity:.5;transform:scale(.9)}}
@media(prefers-reduced-motion:reduce){.comic-spark,.comic-bubble{animation:none}}
`;

export function comicPaper(w, h) {
  return `<defs><pattern id="comic-dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#1B1B25" opacity=".11"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#comic-dots)"/><path d="M${w - 95} 1L${w - 55} 1M${w - 80} 9L${w - 40} 9M${w - 65} 17L${w - 25} 17" stroke="#1B1B25" stroke-width="2" opacity=".18"/>`;
}

export function comicHero(profile, { text, rect, C, mono }) {
  return `<defs><clipPath id="name-clip"><rect class="motion-name" width="740" height="110" x="28" y="66"/></clipPath></defs>
  ${rect(34, 20, 345, 36, C.yellow, 0)}${text(50, 44, "PYTHON BACKEND DEVELOPER", 13, C.text, mono)}${text(1164, 40, profile.location.toUpperCase(), 12, C.text, `${mono} text-anchor="end"`)}
  <g transform="rotate(-1 350 140)" clip-path="url(#name-clip)">${text(39, 147, profile.name.toUpperCase(), 70, C.lime, 'font-weight="700"')}${text(35, 142, profile.name.toUpperCase(), 70, C.text, 'font-weight="700"')}</g>
  <g class="motion-rise">${text(38, 194, "PYTHON / DJANGO / REST APIs", 24, C.blue, 'font-weight="700"')}</g>
  <g class="comic-bubble"><path d="M42 221H686V279H106L76 300L83 279H42Z" fill="#FFFCF4" stroke="${C.text}" stroke-width="3"/>${text(61, 257, profile.tagline, 22, C.text)}</g>
  ${rect(39, 320, 114, 33, C.yellow, 0)}${text(96, 342, "PYTHON", 13, C.text, `${mono} text-anchor="middle"`)}${rect(165, 320, 114, 33, C.blue, 0)}${text(222, 342, "DJANGO", 13, C.bg, `${mono} text-anchor="middle"`)}${rect(291, 320, 122, 33, C.lime, 0)}${text(352, 342, "REST APIs", 13, C.bg, `${mono} text-anchor="middle"`)}
  <g transform="translate(804 78) rotate(1.5 175 130)">${rect(0, 0, 350, 275, C.panel, 0)}${rect(14, 13, 322, 38, C.yellow, 0)}${text(29, 39, "GET /api/projects", 18, C.text, mono)}<rect class="motion-cursor" x="250" y="23" width="8" height="18" fill="${C.text}"/>
  ${rect(29, 76, 292, 57, C.blue, 0)}${text(175, 112, "DJANGO", 23, C.bg, 'font-weight="700" text-anchor="middle"')}
  <path d="M175 139V169H91V190M175 169H258V190" stroke="${C.text}" stroke-width="3" fill="none"/><path class="motion-packet" d="M175 139V169H91V190M175 169H258V190"/>
  ${rect(14, 196, 153, 55, C.yellow, 0)}${rect(180, 196, 156, 55, C.lime, 0)}${text(90, 228, "POSTGRESQL", 13, C.text, `${mono} text-anchor="middle"`)}${text(258, 228, "CELERY + REDIS", 11, C.bg, `${mono} text-anchor="middle"`)}</g>
  <path class="comic-spark" d="M755 100L773 80L774 99L791 91L777 111L783 128L763 116L746 130L753 110L738 103Z" fill="${C.yellow}" stroke="${C.text}" stroke-width="3"/>`;
}
