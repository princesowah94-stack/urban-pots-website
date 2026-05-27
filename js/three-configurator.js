// ── THREE.JS SCENE SETUP ───────────────────────────────────
export function setupScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF7F7F3);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(10, 8, 10);
  camera.lookAt(0, 2, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting (warm, architectural)
  const ambientLight = new THREE.AmbientLight(0xFFF8F0, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xFFF5E6, 2.2);
  directionalLight.position.set(8, 12, 6);
  directionalLight.target.position.set(0, 2, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
  scene.add(directionalLight.target);

  const hemisphereLight = new THREE.HemisphereLight(0xF7F3EE, 0x8C7B6A, 0.4);
  scene.add(hemisphereLight);

  // Ground plane (24×24 units)
  const groundGeom = new THREE.PlaneGeometry(24, 24);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0xEDE8E1,
    roughness: 0.85,
    metalness: 0,
  });
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.enablePan = false;

  // CSS2DRenderer (for dimension labels)
  const labelRenderer = new THREE.CSS2DRenderer();
  labelRenderer.setSize(container.clientWidth, container.clientHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0';
  container.appendChild(labelRenderer.domElement);

  return { scene, camera, renderer, controls, labelRenderer, ground };
}

// ── STRAIGHT EDGE CONFIGURATOR CLASS ───────────────────────
export class StraightEdgeConfigurator {
  constructor(sceneSetup) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.renderer = sceneSetup.renderer;
    this.controls = sceneSetup.controls;
    this.labelRenderer = sceneSetup.labelRenderer;

    // Default dimensions (in scene units, 1 unit = 100mm)
    this.dims = { L: 6, W: 4, H: 4.5 };
    this.T = 0.5; // Wall thickness (50mm)

    // Material and colour
    this.material = new THREE.MeshStandardMaterial({
      color: 0xF2EFE9,
      roughness: 0.88,
      metalness: 0.02,
    });

    // Container for planter panels
    this.planterGroup = new THREE.Group();
    this.scene.add(this.planterGroup);

    // Labels array
    this.labels = [];

    this.buildPlanter();
    this.animate();
  }

  buildPlanter() {
    // Clear existing geometry and labels
    this.planterGroup.clear();
    this.labels.forEach(label => label.element.parentNode?.removeChild(label.element));
    this.labels = [];

    const { L, W, H } = this.dims;
    const T = this.T;

    // Front wall
    const frontGeom = new THREE.BoxGeometry(L, H, T);
    const front = new THREE.Mesh(frontGeom, this.material);
    front.position.set(0, H / 2, W / 2 - T / 2);
    front.castShadow = true;
    this.planterGroup.add(front);

    // Back wall
    const backGeom = new THREE.BoxGeometry(L, H, T);
    const back = new THREE.Mesh(backGeom, this.material);
    back.position.set(0, H / 2, -W / 2 + T / 2);
    back.castShadow = true;
    this.planterGroup.add(back);

    // Left wall
    const leftGeom = new THREE.BoxGeometry(T, H, W - 2 * T);
    const left = new THREE.Mesh(leftGeom, this.material);
    left.position.set(-L / 2 + T / 2, H / 2, 0);
    left.castShadow = true;
    this.planterGroup.add(left);

    // Right wall
    const rightGeom = new THREE.BoxGeometry(T, H, W - 2 * T);
    const right = new THREE.Mesh(rightGeom, this.material);
    right.position.set(L / 2 - T / 2, H / 2, 0);
    right.castShadow = true;
    this.planterGroup.add(right);

    // Base
    const baseGeom = new THREE.BoxGeometry(L, T, W);
    const base = new THREE.Mesh(baseGeom, this.material);
    base.position.set(0, T / 2, 0);
    base.castShadow = true;
    this.planterGroup.add(base);

    // Soil cap (dark material)
    const soilCapMat = new THREE.MeshStandardMaterial({ color: 0x5C4033 });
    const soilCapGeom = new THREE.BoxGeometry(L - 2 * T, 0.04, W - 2 * T);
    const soilCap = new THREE.Mesh(soilCapGeom, soilCapMat);
    soilCap.position.set(0, H - T - 0.02, 0);
    this.planterGroup.add(soilCap);

    // Add dimension labels
    this.addLabels();
  }

  addLabels() {
    const { L, W, H } = this.dims;
    const T = this.T;

    // Length label (bottom-front edge)
    const lengthLabel = this.createLabel(`${Math.round(L * 100)}mm`);
    lengthLabel.position.set(0, -0.5, W / 2 + 0.8);
    this.planterGroup.add(lengthLabel);
    this.labels.push({ element: lengthLabel.element, object: lengthLabel });

    // Width label (bottom-right edge)
    const widthLabel = this.createLabel(`${Math.round(W * 100)}mm`);
    widthLabel.position.set(L / 2 + 0.8, -0.5, 0);
    this.planterGroup.add(widthLabel);
    this.labels.push({ element: widthLabel.element, object: widthLabel });

    // Height label (left-front edge top)
    const heightLabel = this.createLabel(`${Math.round(H * 100)}mm`);
    heightLabel.position.set(-L / 2 - 0.8, H / 2, W / 2 - T / 2);
    this.planterGroup.add(heightLabel);
    this.labels.push({ element: heightLabel.element, object: heightLabel });
  }

  createLabel(text) {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.backgroundColor = 'rgba(28, 26, 24, 0.9)';
    div.style.color = '#fff';
    div.style.padding = '0.35rem 0.75rem';
    div.style.borderRadius = '2px';
    div.style.fontSize = '0.7rem';
    div.style.fontWeight = '600';
    div.style.pointerEvents = 'none';
    div.style.whiteSpace = 'nowrap';

    const label = new THREE.CSS2DObject(div);
    label.element = div;
    return label;
  }

  setDimensions(length, width, height) {
    const newL = length / 100;
    const newW = width / 100;
    const newH = height / 100;

    gsap.to(this.dims, {
      L: newL,
      W: newW,
      H: newH,
      duration: 0.55,
      ease: 'power2.out',
      onUpdate: () => this.buildPlanter(),
    });
  }

  setMaterial(material) {
    const props = material === 'fibre-cement'
      ? { roughness: 0.88, metalness: 0.02 }
      : { roughness: 0.35, metalness: 0.05 };

    this.material.roughness = props.roughness;
    this.material.metalness = props.metalness;
  }

  setColour(hex) {
    this.material.color.set(hex);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.sceneSetup.camera);
    this.labelRenderer.render(this.scene, this.sceneSetup.camera);
  }
}

// ── CYLINDRICAL CONFIGURATOR CLASS ──────────────────────────
export class CylindricalConfigurator {
  constructor(sceneSetup) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.renderer = sceneSetup.renderer;
    this.controls = sceneSetup.controls;
    this.labelRenderer = sceneSetup.labelRenderer;

    // Default dimensions (in scene units)
    this.dims = { D: 5, H: 4.5 }; // D = diameter in units (500mm), H = height
    this.T = 0.5; // Wall thickness (50mm)

    // Material and colour
    this.material = new THREE.MeshStandardMaterial({
      color: 0xF2EFE9,
      roughness: 0.88,
      metalness: 0.02,
    });

    // Container for planter
    this.planterGroup = new THREE.Group();
    this.scene.add(this.planterGroup);

    // Labels array
    this.labels = [];

    this.buildPlanter();
    this.animate();
  }

  buildPlanter() {
    // Clear existing geometry and labels
    this.planterGroup.clear();
    this.labels.forEach(label => label.element.parentNode?.removeChild(label.element));
    this.labels = [];

    const { D, H } = this.dims;
    const T = this.T;
    const R = D / 2; // Radius
    const innerR = R - T; // Inner radius

    // Wall (using LatheGeometry for hollow cylinder)
    const points = [
      new THREE.Vector2(innerR, 0),
      new THREE.Vector2(R, 0),
      new THREE.Vector2(R, H - T),
      new THREE.Vector2(innerR, H - T),
      new THREE.Vector2(innerR, 0),
    ];

    const wallGeom = new THREE.LatheGeometry(points, 32);
    const wall = new THREE.Mesh(wallGeom, this.material);
    wall.scale.y = 1;
    wall.castShadow = true;
    this.planterGroup.add(wall);

    // Base
    const baseGeom = new THREE.CylinderGeometry(R, R, T, 32);
    const base = new THREE.Mesh(baseGeom, this.material);
    base.position.y = T / 2;
    base.castShadow = true;
    this.planterGroup.add(base);

    // Soil cap
    const soilCapMat = new THREE.MeshStandardMaterial({ color: 0x5C4033 });
    const soilCapGeom = new THREE.CylinderGeometry(innerR, innerR, 0.04, 32);
    const soilCap = new THREE.Mesh(soilCapGeom, soilCapMat);
    soilCap.position.y = H - T - 0.02;
    this.planterGroup.add(soilCap);

    // Add dimension labels
    this.addLabels();
  }

  addLabels() {
    const { D, H } = this.dims;

    // Diameter label
    const diamLabel = this.createLabel(`Ø${Math.round(D * 100)}mm`);
    diamLabel.position.set(D / 2 + 0.8, -0.5, 0);
    this.planterGroup.add(diamLabel);
    this.labels.push({ element: diamLabel.element, object: diamLabel });

    // Height label
    const heightLabel = this.createLabel(`${Math.round(H * 100)}mm`);
    heightLabel.position.set(-(D / 2) - 0.8, H / 2, 0);
    this.planterGroup.add(heightLabel);
    this.labels.push({ element: heightLabel.element, object: heightLabel });
  }

  createLabel(text) {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.backgroundColor = 'rgba(28, 26, 24, 0.9)';
    div.style.color = '#fff';
    div.style.padding = '0.35rem 0.75rem';
    div.style.borderRadius = '2px';
    div.style.fontSize = '0.7rem';
    div.style.fontWeight = '600';
    div.style.pointerEvents = 'none';
    div.style.whiteSpace = 'nowrap';

    const label = new THREE.CSS2DObject(div);
    label.element = div;
    return label;
  }

  setDimensions(diameter, height) {
    const newD = diameter / 100;
    const newH = height / 100;

    gsap.to(this.dims, {
      D: newD,
      H: newH,
      duration: 0.55,
      ease: 'power2.out',
      onUpdate: () => this.buildPlanter(),
    });
  }

  setMaterial(material) {
    const props = material === 'fibre-cement'
      ? { roughness: 0.88, metalness: 0.02 }
      : { roughness: 0.35, metalness: 0.05 };

    this.material.roughness = props.roughness;
    this.material.metalness = props.metalness;
  }

  setColour(hex) {
    this.material.color.set(hex);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.sceneSetup.camera);
    this.labelRenderer.render(this.scene, this.sceneSetup.camera);
  }
}

// ── COLOUR PALETTE ──────────────────────────────────────────
export const COLORS = [
  { name: 'Lexicon Half', hex: '#F2EFE9', code: 'Dulux Lexicon Half' },
  { name: 'Antique White', hex: '#D5D0C8', code: 'Dulux Antique White USA' },
  { name: 'Stone', hex: '#C9B99A', code: 'Dulux Dune' },
  { name: 'Sage', hex: '#7A8C5E', code: 'Urban Pots Sage' },
  { name: 'Monument', hex: '#4A4A48', code: 'Dulux Monument' },
  { name: 'Domino', hex: '#1C1A18', code: 'Dulux Domino' },
];

// ── MATERIAL PROPERTIES ─────────────────────────────────────
export const MATERIAL_PROPS = {
  'fibre-cement': { roughness: 0.88, metalness: 0.02 },
  'fibreglass': { roughness: 0.35, metalness: 0.05 },
};

// ── PRESET SIZES ────────────────────────────────────────────
export const PRESETS = {
  straight: [
    { name: 'Small', L: 600, W: 400, H: 450 },
    { name: 'Medium', L: 900, W: 450, H: 500 },
    { name: 'Large', L: 1200, W: 600, H: 600 },
    { name: 'XL', L: 1800, W: 600, H: 600 },
  ],
  cylindrical: [
    { name: 'Small', D: 600, H: 450 },
    { name: 'Medium', D: 800, H: 500 },
    { name: 'Large', D: 1200, H: 600 },
    { name: 'XL', D: 1600, H: 600 },
  ],
};
