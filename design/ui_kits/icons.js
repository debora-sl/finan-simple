// Shared Lucide-style inline icons for the UI kits (stroke 2, 24px grid).
window.CFIcon = (function () {
  const I = (paths, props = {}) => ({ size = 20, ...rest } = {}) =>
    React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', ...props, ...rest },
      paths.map((d, i) => React.createElement('path', { key: i, d })));
  const C = (els) => ({ size = 20, ...rest } = {}) =>
    React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', ...rest }, els);
  return {
    home: I(['m3 9.5 9-7 9 7', 'M9 22V12h6v10', 'M5 11v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9']),
    list: I(['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01']),
    bills: I(['M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3Z', 'M8 8h8', 'M8 12h8']),
    chart: I(['M3 3v18h18', 'M18 17V9', 'M13 17V5', 'M8 17v-3']),
    target: C([React.createElement('circle',{key:0,cx:12,cy:12,r:9}),React.createElement('circle',{key:1,cx:12,cy:12,r:5}),React.createElement('circle',{key:2,cx:12,cy:12,r:1})]),
    settings: C([React.createElement('circle',{key:0,cx:12,cy:12,r:3}),React.createElement('path',{key:1,d:'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z'})]),
    wallet: I(['M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7', 'M16 12h.01']),
    up: I(['M16 7h6v6', 'm22 7-8.5 8.5-5-5L2 17']),
    down: I(['M16 17h6v-6', 'm22 17-8.5-8.5-5 5L2 7']),
    piggy: I(['M19 9a4 4 0 0 0-4-4H9a6 6 0 0 0-6 6 5 5 0 0 0 2 4v3h3v-2h4v2h3v-2.5A5 5 0 0 0 20 11h1V8l-2 1Z', 'M15 9h.01']),
    plus: I(['M12 5v14', 'M5 12h14']),
    bell: I(['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'M10.3 21a1.94 1.94 0 0 0 3.4 0']),
    search: C([React.createElement('circle',{key:0,cx:11,cy:11,r:8}),React.createElement('path',{key:1,d:'m21 21-4.3-4.3'})]),
    chevronDown: I(['m6 9 6 6 6-6']),
    calendar: C([React.createElement('rect',{key:0,x:3,y:4,width:18,height:18,rx:2}),React.createElement('path',{key:1,d:'M16 2v4M8 2v4M3 10h18'})]),
    moon: I(['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z']),
    sun: C([React.createElement('circle',{key:0,cx:12,cy:12,r:4}),React.createElement('path',{key:1,d:'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'})]),
    menu: I(['M3 6h18', 'M3 12h18', 'M3 18h18']),
    arrowDownLeft: I(['M17 7 7 17', 'M17 17H7V7']),
    arrowUpRight: I(['M7 17 17 7', 'M7 7h10v10']),
    x: I(['M18 6 6 18', 'M6 6l12 12']),
    check: I(['M20 6 9 17l-5-5']),
  };
})();
