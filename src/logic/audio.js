/* D-R!VE Audio Feedback */
const AC = { c: null };
function getCtx() { if (!AC.c) AC.c = new (window.AudioContext || window.webkitAudioContext)(); return AC.c; }

export function sH() {
  try { const c = getCtx(), o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.type = "sine"; o.frequency.setValueAtTime(880, c.currentTime); o.frequency.exponentialRampToValueAtTime(1320, c.currentTime + .06); g.gain.setValueAtTime(.04, c.currentTime); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .12); o.start(c.currentTime); o.stop(c.currentTime + .12); } catch (e) {}
}

export function sC() {
  try { const c = getCtx(), o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.type = "triangle"; o.frequency.setValueAtTime(660, c.currentTime); o.frequency.exponentialRampToValueAtTime(1100, c.currentTime + .04); o.frequency.exponentialRampToValueAtTime(880, c.currentTime + .1); g.gain.setValueAtTime(.07, c.currentTime); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .15); o.start(c.currentTime); o.stop(c.currentTime + .15); } catch (e) {}
}
