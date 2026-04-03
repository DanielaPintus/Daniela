/* D-R!VE LocalStorage Abstraction Layer */
export const LS = "drive_";

export function lsGet(k, fb = null) {
  try { const v = localStorage.getItem(LS + k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; }
}

export function lsSet(k, v) {
  try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) {}
}

export function lsDel(k) {
  try { localStorage.removeItem(LS + k); } catch (e) {}
}
