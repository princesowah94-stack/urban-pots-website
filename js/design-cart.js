const STORAGE_KEY = 'urbanpots_designs';

// ── GET ALL DESIGNS ───────────────────────────────────────
export function getDesigns() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading designs:', e);
    return [];
  }
}

// ── ADD DESIGN ─────────────────────────────────────────────
export function addDesign(design) {
  try {
    const designs = getDesigns();
    const newDesign = {
      id: crypto.randomUUID(),
      ...design,
      timestamp: Date.now()
    };
    designs.push(newDesign);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    return newDesign;
  } catch (e) {
    console.error('Error adding design:', e);
    return null;
  }
}

// ── UPDATE DESIGN ──────────────────────────────────────────
export function updateDesign(id, updates) {
  try {
    const designs = getDesigns();
    const design = designs.find(d => d.id === id);
    if (!design) return null;

    Object.assign(design, updates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    return design;
  } catch (e) {
    console.error('Error updating design:', e);
    return null;
  }
}

// ── DELETE DESIGN ──────────────────────────────────────────
export function deleteDesign(id) {
  try {
    const designs = getDesigns().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    return true;
  } catch (e) {
    console.error('Error deleting design:', e);
    return false;
  }
}

// ── CLEAR ALL DESIGNS ──────────────────────────────────────
export function clearDesigns() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing designs:', e);
    return false;
  }
}

// ── GET DESIGN BY ID ───────────────────────────────────────
export function getDesign(id) {
  const designs = getDesigns();
  return designs.find(d => d.id === id) || null;
}

// ── FORMAT DIMENSIONS FOR DISPLAY ──────────────────────────
export function formatDimensions(design) {
  const { shape, dimensions } = design;

  if (shape === 'straight') {
    return `${dimensions.length} × ${dimensions.width} × ${dimensions.height}mm`;
  } else if (shape === 'cylindrical') {
    if (dimensions.diameterMajor && dimensions.diameterMinor) {
      return `${dimensions.diameterMajor}×${dimensions.diameterMinor}mm (oval) × ${dimensions.height}mm`;
    }
    return `Ø${dimensions.diameter} × ${dimensions.height}mm`;
  }

  return 'Unknown shape';
}

// ── CALCULATE TOTAL QUANTITY ──────────────────────────────
export function getTotalQuantity() {
  return getDesigns().reduce((sum, design) => sum + (design.quantity || 1), 0);
}

// ── VALIDATE DESIGN OBJECT ────────────────────────────────
export function validateDesign(design) {
  const { shape, dimensions, material, colour, quantity } = design;

  if (!['straight', 'cylindrical'].includes(shape)) return false;
  if (!dimensions || typeof dimensions !== 'object') return false;
  if (!['fibre-cement', 'fibreglass'].includes(material)) return false;
  if (!colour || typeof colour !== 'string') return false;
  if (typeof quantity !== 'number' || quantity < 1 || quantity > 50) return false;

  if (shape === 'straight') {
    const { length, width, height } = dimensions;
    if (!length || !width || !height) return false;
    if (length < 300 || length > 3000) return false;
    if (width < 200 || width > 1500) return false;
    if (height < 200 || height > 1200) return false;
  } else if (shape === 'cylindrical') {
    const { diameter, height } = dimensions;
    if (!diameter || !height) return false;
    if (diameter < 200 || diameter > 2000) return false;
    if (height < 200 || height > 1200) return false;
  }

  return true;
}
