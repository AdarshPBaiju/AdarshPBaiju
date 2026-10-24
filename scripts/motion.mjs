import { xml } from "./lib.mjs";

export const motionCss = `
text{font-family:Arial,'Segoe UI',sans-serif}.mono{font-family:Consolas,'Liberation Mono',monospace;letter-spacing:.8px}
.motion-rise{animation:motion-rise .9s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--delay,0s)}
.motion-number{animation:motion-rise 1s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--delay,0s)}
.motion-border{stroke-dasharray:70 900;animation:motion-border 9s linear infinite;fill:none;stroke:#C7F464;stroke-opacity:.38}
.motion-bar{transform-box:fill-box;transform-origin:left;animation:motion-bar 1.6s cubic-bezier(.2,.7,.2,1) both}
.motion-packet{stroke-dasharray:5 70;animation:motion-packet 3s linear infinite;fill:none;stroke:#C7F464;stroke-width:3}
.motion-cursor{animation:motion-cursor 1s steps(1) infinite}
.motion-orbit{transform-box:fill-box;transform-origin:center;animation:motion-orbit 8s linear infinite}
.motion-float{animation:motion-float 5s ease-in-out infinite;animation-delay:var(--delay,0s)}
.motion-pulse{animation:motion-pulse 4s ease-in-out infinite;animation-delay:var(--delay,0s)}
.motion-name{animation:motion-name 1.5s cubic-bezier(.2,.7,.2,1) both}
.scene-a{animation:scene-a 9s ease-in-out infinite}.scene-b{opacity:0;animation:scene-b 9s ease-in-out infinite}
.calendar-cell{transform-box:fill-box;transform-origin:center;animation:calendar-cell .8s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--delay,0s)}
.calendar-glow{animation:motion-pulse 5s ease-in-out infinite;animation-delay:var(--delay,0s)}
.calendar-scan{animation:calendar-scan 12s linear infinite}
@keyframes motion-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes motion-border{to{stroke-dashoffset:-970}}
@keyframes motion-bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes motion-packet{to{stroke-dashoffset:-150}}
@keyframes motion-cursor{50%{opacity:0}}
@keyframes motion-orbit{to{transform:rotate(360deg)}}
@keyframes motion-float{50%{transform:translateY(-3px)}}
@keyframes motion-pulse{50%{opacity:.6}}
@keyframes motion-name{from{width:0}to{width:740px}}
@keyframes scene-a{0%,40%,100%{opacity:1}48%,90%{opacity:0}}
@keyframes scene-b{0%,40%,100%{opacity:0}48%,90%{opacity:1}}
@keyframes calendar-cell{from{opacity:0;transform:scale(.35)}to{opacity:1;transform:scale(1)}}
@keyframes calendar-scan{from{transform:translateX(-100px)}to{transform:translateX(1130px)}}
@media(prefers-reduced-motion:reduce){.motion-rise,.motion-number,.motion-border,.motion-bar,.motion-packet,.motion-cursor,.motion-orbit,.motion-float,.motion-pulse,.motion-name,.scene-a,.scene-b,.calendar-cell,.calendar-glow,.calendar-scan{animation:none!important;transform:none}.motion-name{width:740px}.scene-a{opacity:1}.scene-b,.calendar-scan{display:none}.motion-rise,.motion-number,.motion-bar,.calendar-cell{opacity:1}}
`;

export function projectPreview(repo, { rect, line, C }) {
  const bar = (x, y, w, h, color = C.lime, cls = "") =>
    rect(x, y, w, h, color, 3, cls ? `class="${cls}"` : "");
  const frame =
    rect(24, 95, 552, 128, "#FFFCF4", 9, `stroke="${C.border}"`) +
    bar(38, 109, 5, 5) +
    bar(48, 109, 5, 5, C.border) +
    bar(58, 109, 5, 5, C.border) +
    line(24, 123, 576, 123);
  let a = "",
    b = "";
  if (repo === "chronoflow") {
    for (let i = 0; i < 3; i++) {
      const x = 39 + i * 178;
      a +=
        rect(x, 136, 164, 74, C.panel, 5) +
        bar(x + 10, 147, 65, 4, C.soft) +
        bar(x + 10, 160, 143, 16, "#DCE5F4") +
        bar(x + 10, 183, 105, 13, "#DCE5F4");
      b +=
        rect(x, 136, 164, 74, C.panel, 5) +
        bar(x + 10, 147, 65, 4, C.soft) +
        bar(
          x + 10,
          160,
          i === 1 ? 145 : 105,
          16,
          i === 1 ? C.lime : "#DCE5F4",
        ) +
        bar(x + 10, 183, 130, 13, "#DCE5F4");
    }
  } else if (repo === "Ecommerce-with-payment") {
    for (let i = 0; i < 3; i++) {
      const x = 40 + i * 177;
      a +=
        rect(x, 135, 160, 75, C.panel, 5) +
        rect(x + 10, 144, 48, 54, "#EDD07D", 5) +
        bar(x + 69, 147, 68, 5, C.soft) +
        bar(x + 69, 160, 43, 4, C.border) +
        bar(x + 69, 184, 70, 14, C.lime);
      b +=
        rect(x, 135, 160, 75, C.panel, 5) +
        rect(x + 10, 144, 48, 54, "#EDD07D", 5) +
        bar(x + 69, 147, 68, 5, C.soft) +
        bar(x + 69, 160, 43, 4, C.border) +
        bar(x + 69, 184, 70, 14, i === 1 ? C.soft : C.lime);
    }
  } else if (repo === "hospital_management") {
    a +=
      rect(40, 137, 168, 71, C.panel, 5) +
      bar(52, 150, 95, 5, C.soft) +
      bar(52, 165, 140, 4, C.border) +
      bar(52, 181, 78, 13, C.lime);
    b = a;
    for (let i = 0; i < 15; i++) {
      const x = 232 + (i % 5) * 62,
        y = 138 + Math.floor(i / 5) * 24;
      a += bar(x, y, 49, 17, i === 7 ? C.lime : C.panel);
      b += bar(x, y, 49, 17, i === 9 ? C.lime : C.panel);
    }
  } else if (repo === "URL-SHORTNER") {
    a =
      rect(40, 141, 300, 45, C.panel, 5) +
      bar(54, 155, 260, 5, C.soft) +
      bar(54, 168, 180, 4, C.border) +
      bar(365, 141, 190, 45, C.lime);
    b =
      rect(40, 141, 300, 45, C.panel, 5) +
      bar(54, 155, 146, 5, C.lime) +
      bar(54, 168, 92, 4, C.soft) +
      bar(365, 141, 190, 45, C.panel);
    a += bar(40, 198, 514, 4, C.border);
    b += bar(40, 198, 514, 4, C.lime, "motion-bar");
  } else {
    for (let i = 0; i < 3; i++) {
      const y = 135 + i * 25;
      a +=
        rect(40, y, 515, 20, C.panel, 4) +
        bar(48, y + 5, 10, 10, C.border) +
        bar(72, y + 7, 190 + i * 55, 5, C.soft) +
        bar(451, y + 5, 90, 10, C.border);
      b +=
        rect(40, y, 515, 20, C.panel, 4) +
        bar(48, y + 5, 10, 10, i === 1 ? C.lime : C.border) +
        bar(72, y + 7, 190 + i * 55, 5, i === 1 ? C.lime : C.soft) +
        bar(451, y + 5, 90, 10, C.border);
    }
  }
  return frame + `<g class="scene-a">${a}</g><g class="scene-b">${b}</g>`;
}

export function calendarArtwork(calendar, total, { text, rect, C, mono }) {
  const start = new Date(calendar[0].date + "T00:00:00Z");
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const colors = ["#E9DFC8", "#FFE58C", "#FFB34F", "#F57B4B", C.lime];
  let cells = "",
    months = "",
    lastMonth = -1;
  for (const day of calendar) {
    const d = new Date(day.date + "T00:00:00Z"),
      week = Math.floor((d - start) / 86400000 / 7),
      row = d.getUTCDay(),
      x = 55 + week * 21,
      y = 96 + row * 21;
    cells += `<g class="calendar-cell" style="--delay:${(week * 0.025 + row * 0.015).toFixed(3)}s"><title>${xml(day.date)}: ${day.count} contributions</title>${rect(x, y, 17, 17, colors[Math.min(4, day.level)], 4, day.count ? 'class="calendar-glow"' : "")}</g>`;
    if (d.getUTCMonth() !== lastMonth && d.getUTCDate() <= 7) {
      months += text(
        x,
        79,
        d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
        11,
        C.muted,
        mono,
      );
      lastMonth = d.getUTCMonth();
    }
  }
  return `${text(32, 35, "CONTRIBUTIONS / LAST 12 MONTHS", 13, C.lime, mono)}<g class="motion-number">${text(1168, 36, total + " contributions", 22, C.text, 'text-anchor="end" font-weight="700"')}</g>${months}${text(23, 126, "M", 11, C.muted, mono)}${text(23, 168, "W", 11, C.muted, mono)}${text(23, 210, "F", 11, C.muted, mono)}${cells}<svg x="55" y="92" width="1110" height="155" viewBox="0 0 1110 155"><rect class="calendar-scan" width="70" height="155" fill="${C.lime}" opacity=".055"/></svg>${text(32, 278, calendar[0].date + " — " + calendar.at(-1).date, 11, C.muted, mono)}${text(1168, 278, "GITHUB PUBLIC PROFILE", 11, C.muted, `${mono} text-anchor="end"`)}`;
}
