// Delegated sparkles: attach a single listener to document and create
// particles appended to document.body using fixed positioning. This avoids
// stacking-context / overflow issues when particles are children of the
// hovered element.

// particles will be white-only for a cleaner look
const COLORS = ['#ffffff'];

// track particles by owner id so we can clear them when the cursor leaves
let ownerCounter = 1;
const ownerMap = new Map();
const blockedOwners = new Set();

function createBodyParticle(px, py, ownerId) {
  // if owner was cleared, skip creating new particles
  if (ownerId && blockedOwners.has(ownerId)) return;
  const p = document.createElement('span');
  p.className = 'sparkle-particle';
  // make particles very small: 1-3px
  const size = 1 + Math.floor(Math.random() * 3); // 1-3px
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  // position fixed (viewport coords)
  p.style.left = `${Math.round(px - size / 2)}px`;
  p.style.top = `${Math.round(py - size / 2)}px`;
  p.style.position = 'fixed';
  p.style.background = COLORS[0];
  // tiny horizontal drift: -10..10px
  const tx = (Math.random() - 0.5) * 20; // -10..10px
  p.style.setProperty('--tx', `${tx}px`);
  p.style.borderRadius = Math.random() > 0.5 ? '50%' : '22%';
  // moderate: around 3.0 - 3.8 seconds (fade in, slight fall, fade out)
  const duration = 3000 + Math.floor(Math.random() * 800); // 3000-3800ms
  p.style.animation = `sparkle-fall ${duration}ms ease-out`;

  // tag with owner and add to tracking map
  if (ownerId) {
    p.dataset.sparkleOwner = ownerId;
    if (!ownerMap.has(ownerId)) ownerMap.set(ownerId, new Set());
    ownerMap.get(ownerId).add(p);
  }

  document.body.appendChild(p);
  setTimeout(() => {
    if (p && p.parentNode) p.parentNode.removeChild(p);
    if (ownerId && ownerMap.has(ownerId)) ownerMap.get(ownerId).delete(p);
  }, duration + 80);
}

function clearParticlesByOwner(ownerId) {
  if (!ownerId) return;
  blockedOwners.add(ownerId);
  const set = ownerMap.get(ownerId);
  if (!set) return;
  const fadeDuration = 700; // ms
  for (const p of Array.from(set)) {
    try {
      if (p) {
        // add fadeout class so CSS transitions handle smooth disappearance
        p.classList.add('sparkle-fadeout');
        // ensure we remove after the fade
        setTimeout(() => {
          if (p && p.parentNode) p.parentNode.removeChild(p);
        }, fadeDuration + 50);
      }
    } catch (e) {
      // in case removing class fails, fall back to immediate removal
      if (p && p.parentNode) p.parentNode.removeChild(p);
    }
    set.delete(p);
  }
  ownerMap.delete(ownerId);
}

export function clearAllSparkles() {
  for (const ownerId of Array.from(ownerMap.keys())) {
    clearParticlesByOwner(ownerId);
  }
}

let delegatedBound = false;
export function attachSparkles() {
  if (typeof document === 'undefined' || delegatedBound) return;
  delegatedBound = true;
  // pointerover is fired when the pointer enters an element; use it to
  // catch dynamic elements too. Debounce per-target to avoid spam.
  // track last spawn per element to prevent spam
  const lastSpawn = new WeakMap();
  // map element -> interval id for continuous spawning while hovered
  const intervalMap = new WeakMap();

  document.addEventListener('pointerover', (ev) => {
    const target = ev.target;
    const el = target.closest && target.closest('.sparkle-hover');
    if (!el) return;
    // ensure element has a fresh owner id for its particles
    // if the element was previously cleared (blocked), give it a new id
    if (!el.__sparkleId || blockedOwners.has(el.__sparkleId)) {
      el.__sparkleId = `sparkle-${ownerCounter++}`;
    }

    // if we already have a continuous spawn interval for this element, do nothing
    if (intervalMap.get(el)) return;

    // start continuous spawning while hovered
    const spawnBatch = () => {
      // rate limit per element: roughly once per spawnBatch call
      const rect = el.getBoundingClientRect();
      const count = Math.max(8, Math.min(40, Math.floor(rect.width / 6)));
      for (let i = 0; i < count; i++) {
        const x = rect.left + (rect.width / (count - 1 || 1)) * i;
        const y = rect.bottom + (4 + Math.random() * 8);
        const delay = Math.random() * 120;
        setTimeout(() => createBodyParticle(x, y, el.__sparkleId), delay);
      }
    };

    // immediate first batch
    spawnBatch();
    // then continue spawning every 650ms while hovered
    const id = setInterval(spawnBatch, 650);
    intervalMap.set(el, id);
  }, { passive: true });

  // remove particles when pointer leaves the element
  document.addEventListener('pointerout', (ev) => {
    const target = ev.target;
    const el = target.closest && target.closest('.sparkle-hover');
    if (!el) return;
    // clear continuous spawn interval if present
    const id = intervalMap.get(el);
    if (id) {
      clearInterval(id);
      intervalMap.delete(el);
    }
    if (el.__sparkleId) clearParticlesByOwner(el.__sparkleId);
  }, { passive: true });

  // also auto-run once if called after DOM ready
  // no-op here; binding is enough
}

// auto-bind on import in browser
if (typeof window !== 'undefined') {
  // give framework a tick to render
  window.requestAnimationFrame(() => attachSparkles());
}
