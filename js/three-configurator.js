import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Color palette: Colorbond + Dulux
const COLORBOND_DULUX_COLORS = [
  { name: 'Lexicon Half', hex: '#F2EFE9', code: 'Dulux Lexicon Half' },
  { name: 'Antique White', hex: '#D5D0C8', code: 'Dulux Antique White' },
  { name: 'Stone', hex: '#C9B99A', code: 'Dulux Dune' },
  { name: 'Sage', hex: '#7A8C5E', code: 'Urban Pots Sage' },
  { name: 'Monument', hex: '#4A4A48', code: 'Dulux Monument' },
  { name: 'Domino', hex: '#1C1A18', code: 'Dulux Domino' },
];

// Material properties
const MATERIAL_PROPS = {
  'fibre-cement': { roughness: 0.88, metalness: 0.02 },
  'fibreglass': { roughness: 0.35, metalness: 0.05 },
};

// Preset sizes
const PRESETS = {
  'straight-edge': [
    { name: 'Small', length: 600, width: 400, height: 450, thickness: 50 },
    { name: 'Medium', length: 900, width: 450, height: 500, thickness: 50 },
    { name: 'Large', length: 1200, width: 600, height: 600, thickness: 50 },
    { name: 'XL', length: 1800, width: 600, height: 600, thickness: 50 },
  ],
  'cylindrical': [
    { name: 'Small', height: 450 },
    { name: 'Medium', height: 550 },
    { name: 'Large', height: 700 },
    { name: 'XL', height: 900 },
  ],
};

// Base prices (in cents AUD)
const BASE_PRICES = {
  'straight-edge': {
    'fibre-cement': 18500,
    'fibreglass': 22000,
  },
  'cylindrical': {
    'fibre-cement': 15000,
    'fibreglass': 18500,
  },
};

const THICKNESS_INCREMENT = 500;
const RGB_COLOUR_COST = 2500;

class StraightEdgeConfigurator {
  constructor(containerId, onUpdate) {
    this.containerId = containerId;
    this.onUpdate = onUpdate;
    this.dims = { L: 600, W: 400, H: 450, T: 50 };
    this.material = 'fibre-cement';
    this.colour = COLORBOND_DULUX_COLORS[0].hex;
    this.isRGB = false;
    this.init();
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) throw new Error(`[Configurator] Canvas container #${this.containerId} not found`);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfaf8f3);

    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.set(10, 8, 10);
    this.camera.lookAt(0, 2, 0);

    const ambientLight = new THREE.AmbientLight(0xFFF8F0, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFF5E6, 2.2);
    directionalLight.position.set(8, 12, 6);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xF7F3EE, 0x8C7B6A, 0.4);
    this.scene.add(hemisphereLight);

    const groundGeo = new THREE.PlaneGeometry(24, 24);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xE8E3DA, roughness: 0.8, metalness: 0 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.planterGroup = new THREE.Group();
    this.scene.add(this.planterGroup);

    this.planterMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.colour),
      ...MATERIAL_PROPS[this.material],
    });

    this.soilMaterial = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.9, metalness: 0 });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minPolarAngle = 0.2;
    this.controls.maxPolarAngle = Math.PI / 2.1;
    this.controls.enablePan = false;
    this.controls.enableZoom = false; // let the mouse wheel scroll the page instead of trapping it to zoom

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(container.clientWidth, container.clientHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(this.labelRenderer.domElement);

    this.rebuildPlanter();
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  rebuildPlanter() {
    while (this.planterGroup.children.length > 0) {
      const child = this.planterGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      this.planterGroup.remove(child);
    }

    const L = this.dims.L / 100;
    const W = this.dims.W / 100;
    const H = this.dims.H / 100;
    const T = this.dims.T / 100;

    const frontGeo = new THREE.BoxGeometry(L, H, T);
    const front = new THREE.Mesh(frontGeo, this.planterMaterial);
    front.position.y = H / 2;
    front.position.z = W / 2 - T / 2;
    front.castShadow = true;
    this.planterGroup.add(front);

    const backGeo = new THREE.BoxGeometry(L, H, T);
    const back = new THREE.Mesh(backGeo, this.planterMaterial);
    back.position.y = H / 2;
    back.position.z = -W / 2 + T / 2;
    back.castShadow = true;
    this.planterGroup.add(back);

    const leftGeo = new THREE.BoxGeometry(T, H, W - 2 * T);
    const left = new THREE.Mesh(leftGeo, this.planterMaterial);
    left.position.x = -L / 2 + T / 2;
    left.position.y = H / 2;
    left.castShadow = true;
    this.planterGroup.add(left);

    const rightGeo = new THREE.BoxGeometry(T, H, W - 2 * T);
    const right = new THREE.Mesh(rightGeo, this.planterMaterial);
    right.position.x = L / 2 - T / 2;
    right.position.y = H / 2;
    right.castShadow = true;
    this.planterGroup.add(right);

    const baseGeo = new THREE.BoxGeometry(L, T, W);
    const base = new THREE.Mesh(baseGeo, this.planterMaterial);
    base.position.y = T / 2;
    base.castShadow = true;
    this.planterGroup.add(base);

    const soilCapGeo = new THREE.PlaneGeometry(L - 2 * T, W - 2 * T);
    const soilCap = new THREE.Mesh(soilCapGeo, this.soilMaterial);
    soilCap.position.y = H - T - 0.02;
    soilCap.rotation.x = -Math.PI / 2;
    this.planterGroup.add(soilCap);

    this.updateLabels(L, W, H);
    if (this.onUpdate) {
      this.onUpdate({
        length: this.dims.L,
        width: this.dims.W,
        height: this.dims.H,
        thickness: this.dims.T,
        material: this.material,
        colour: this.colour,
        price: this.calculatePrice(),
      });
    }
  }

  updateLabels(L, W, H) {
    this.planterGroup.children.forEach(child => {
      if (child instanceof CSS2DObject) this.planterGroup.remove(child);
    });

    const lengthDiv = document.createElement('div');
    lengthDiv.textContent = `${this.dims.L} mm`;
    lengthDiv.style.color = '#5C5B57';
    lengthDiv.style.fontSize = '12px';
    lengthDiv.style.fontWeight = 'bold';
    const lengthLabel = new CSS2DObject(lengthDiv);
    lengthLabel.position.set(0, -0.5, W / 2 + 0.5);
    this.planterGroup.add(lengthLabel);

    const widthDiv = document.createElement('div');
    widthDiv.textContent = `${this.dims.W} mm`;
    widthDiv.style.color = '#5C5B57';
    widthDiv.style.fontSize = '12px';
    widthDiv.style.fontWeight = 'bold';
    const widthLabel = new CSS2DObject(widthDiv);
    widthLabel.position.set(L / 2 + 0.5, -0.5, 0);
    this.planterGroup.add(widthLabel);

    const heightDiv = document.createElement('div');
    heightDiv.textContent = `${this.dims.H} mm`;
    heightDiv.style.color = '#5C5B57';
    heightDiv.style.fontSize = '12px';
    heightDiv.style.fontWeight = 'bold';
    const heightLabel = new CSS2DObject(heightDiv);
    heightLabel.position.set(-L / 2 - 0.5, H / 2, W / 2 - T);
    this.planterGroup.add(heightLabel);
  }

  calculatePrice() {
    const basePrice = BASE_PRICES['straight-edge'][this.material];
    const thicknessLevels = (this.dims.T - 25) / 25;
    const thicknessCost = thicknessLevels * THICKNESS_INCREMENT;
    const rgbCost = this.isRGB ? RGB_COLOUR_COST : 0;
    return basePrice + thicknessCost + rgbCost;
  }

  setDimension(key, value) {
    this.dims[key] = value;
    this.rebuildPlanter();
  }

  setMaterial(material) {
    this.material = material;
    this.planterMaterial.roughness = MATERIAL_PROPS[material].roughness;
    this.planterMaterial.metalness = MATERIAL_PROPS[material].metalness;
    if (this.onUpdate) {
      this.onUpdate({
        length: this.dims.L,
        width: this.dims.W,
        height: this.dims.H,
        thickness: this.dims.T,
        material: this.material,
        colour: this.colour,
        price: this.calculatePrice(),
      });
    }
  }

  setColour(hex, isRGB = false) {
    this.colour = hex;
    this.isRGB = isRGB;
    this.planterMaterial.color.setHex(parseInt(hex.replace('#', ''), 16));
    if (this.onUpdate) {
      this.onUpdate({
        length: this.dims.L,
        width: this.dims.W,
        height: this.dims.H,
        thickness: this.dims.T,
        material: this.material,
        colour: this.colour,
        price: this.calculatePrice(),
      });
    }
  }

  applyPreset(presetName) {
    const preset = PRESETS['straight-edge'].find(p => p.name === presetName);
    if (preset) {
      this.dims.L = preset.length;
      this.dims.W = preset.width;
      this.dims.H = preset.height;
      this.dims.T = preset.thickness;
      this.rebuildPlanter();
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const container = document.getElementById(this.containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
  }
}

class CylindricalConfigurator {
  constructor(containerId, onUpdate) {
    this.containerId = containerId;
    this.onUpdate = onUpdate;
    this.dims = { H: 450 };
    this.material = 'fibre-cement';
    this.colour = COLORBOND_DULUX_COLORS[0].hex;
    this.isRGB = false;
    this.init();
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) throw new Error(`[Configurator] Canvas container #${this.containerId} not found`);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfaf8f3);

    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.set(10, 8, 10);
    this.camera.lookAt(0, 2, 0);

    const ambientLight = new THREE.AmbientLight(0xFFF8F0, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFF5E6, 2.2);
    directionalLight.position.set(8, 12, 6);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xF7F3EE, 0x8C7B6A, 0.4);
    this.scene.add(hemisphereLight);

    const groundGeo = new THREE.PlaneGeometry(24, 24);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xE8E3DA, roughness: 0.8, metalness: 0 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.cylinderGroup = new THREE.Group();
    this.scene.add(this.cylinderGroup);

    this.cylinderMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.colour),
      side: THREE.DoubleSide,
      ...MATERIAL_PROPS[this.material],
    });

    this.soilMaterial = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.9, metalness: 0 });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minPolarAngle = 0.2;
    this.controls.maxPolarAngle = Math.PI / 2.1;
    this.controls.enablePan = false;
    this.controls.enableZoom = false; // let the mouse wheel scroll the page instead of trapping it to zoom

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(container.clientWidth, container.clientHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(this.labelRenderer.domElement);

    this.rebuildCylinder();
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  rebuildCylinder() {
    while (this.cylinderGroup.children.length > 0) {
      const child = this.cylinderGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      this.cylinderGroup.remove(child);
    }

    const H = this.dims.H / 100;
    const radius = 2.5;
    const thickness = 0.5;
    const innerR = radius - thickness;

    // Outer wall — open-ended tube
    const outerGeo = new THREE.CylinderGeometry(radius, radius, H, 48, 1, true);
    const outer = new THREE.Mesh(outerGeo, this.cylinderMaterial);
    outer.position.y = H / 2;
    outer.castShadow = true;
    this.cylinderGroup.add(outer);

    // Inner wall — open-ended tube from base up to rim, shows the hollow cavity
    const innerGeo = new THREE.CylinderGeometry(innerR, innerR, H - thickness, 48, 1, true);
    const inner = new THREE.Mesh(innerGeo, this.cylinderMaterial);
    inner.position.y = thickness + (H - thickness) / 2;
    this.cylinderGroup.add(inner);

    // Top rim — flat ring capping the wall thickness
    const rimGeo = new THREE.RingGeometry(innerR, radius, 48);
    const rim = new THREE.Mesh(rimGeo, this.cylinderMaterial);
    rim.position.y = H;
    rim.rotation.x = -Math.PI / 2;
    this.cylinderGroup.add(rim);

    // Solid base disc at the bottom
    const baseGeo = new THREE.CylinderGeometry(radius, radius, thickness, 48);
    const base = new THREE.Mesh(baseGeo, this.cylinderMaterial);
    base.position.y = thickness / 2;
    base.castShadow = true;
    this.cylinderGroup.add(base);

    // Soil fill, recessed below the rim so the pot reads as hollow
    const soilCapGeo = new THREE.CircleGeometry(innerR, 48);
    const soilCap = new THREE.Mesh(soilCapGeo, this.soilMaterial);
    soilCap.position.y = H - thickness;
    soilCap.rotation.x = -Math.PI / 2;
    this.cylinderGroup.add(soilCap);

    this.updateLabels(H);
    if (this.onUpdate) {
      this.onUpdate({
        height: this.dims.H,
        material: this.material,
        colour: this.colour,
        price: this.calculatePrice(),
      });
    }
  }

  updateLabels(H) {
    this.cylinderGroup.children.forEach(child => {
      if (child instanceof CSS2DObject) this.cylinderGroup.remove(child);
    });

    const heightDiv = document.createElement('div');
    heightDiv.textContent = `${this.dims.H} mm`;
    heightDiv.style.color = '#5C5B57';
    heightDiv.style.fontSize = '12px';
    heightDiv.style.fontWeight = 'bold';
    const heightLabel = new CSS2DObject(heightDiv);
    heightLabel.position.set(-3.5, H / 2, 0);
    this.cylinderGroup.add(heightLabel);
  }

  calculatePrice() {
    const basePrice = BASE_PRICES['cylindrical'][this.material];
    const rgbCost = this.isRGB ? RGB_COLOUR_COST : 0;
    return basePrice + rgbCost;
  }

  setHeight(value) {
    this.dims.H = value;
    this.rebuildCylinder();
  }

  setMaterial(material) {
    this.material = material;
    this.cylinderMaterial.roughness = MATERIAL_PROPS[material].roughness;
    this.cylinderMaterial.metalness = MATERIAL_PROPS[material].metalness;
    if (this.onUpdate) {
      this.onUpdate({
        height: this.dims.H,
        material: this.material,
        colour: this.colour,
        price: this.calculatePrice(),
      });
    }
  }

  setColour(hex, isRGB = false) {
    this.colour = hex;
    this.isRGB = isRGB;
    this.cylinderMaterial.color.setHex(parseInt(hex.replace('#', ''), 16));
    if (this.onUpdate) {
      this.onUpdate({
        height: this.dims.H,
        material: this.material,
        colour: this.colour,
        price: this.calculatePrice(),
      });
    }
  }

  applyPreset(presetName) {
    const preset = PRESETS['cylindrical'].find(p => p.name === presetName);
    if (preset) {
      this.dims.H = preset.height;
      this.rebuildCylinder();
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    const container = document.getElementById(this.containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
  }
}

export { StraightEdgeConfigurator, CylindricalConfigurator, COLORBOND_DULUX_COLORS, PRESETS, BASE_PRICES, THICKNESS_INCREMENT, RGB_COLOUR_COST };
