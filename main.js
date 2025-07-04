// --- Solar System Data ---
const PLANETS = [
  { name: "Mercury", color: 0xb1b1b1, size: 0.38, distance: 6, speed: 4.15 },
  { name: "Venus",   color: 0xeeddaa, size: 0.95, distance: 8, speed: 1.62 },
  { name: "Earth",   color: 0x3399ff, size: 1.00, distance: 10, speed: 1.00 },
  { name: "Mars",    color: 0xff5533, size: 0.53, distance: 12, speed: 0.53 },
  { name: "Jupiter", color: 0xffcc99, size: 11.2, distance: 16, speed: 0.08 },
  { name: "Saturn",  color: 0xffe599, size: 9.45, distance: 20, speed: 0.03 },
  { name: "Uranus",  color: 0x99ffff, size: 4.00, distance: 24, speed: 0.012 },
  { name: "Neptune", color: 0x3366ff, size: 3.88, distance: 28, speed: 0.006 }
];

// --- Scene Setup ---
const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111122);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 60, 0); // Top-down view
camera.lookAt(0, 10, 0);       // Look at planets level

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// --- Lighting ---
const sunLight = new THREE.PointLight(0xffffff, 2, 0);
sunLight.position.set(0, 10, 0);
scene.add(sunLight);

const ambient = new THREE.AmbientLight(0x222233, 0.5);
scene.add(ambient);

// --- Sun ---
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffee88 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 10, 0);
scene.add(sun);

// --- Planets ---
const planetMeshes = [];
const planetData = [];
PLANETS.forEach((p) => {
  const geometry = new THREE.SphereGeometry(p.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: p.color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  planetMeshes.push(mesh);
  planetData.push({
    ...p,
    angle: Math.random() * Math.PI * 2,
    speed: p.speed,
    mesh
  });
});

// --- Controls UI ---
const controlsDiv = document.getElementById('controls');
controlsDiv.innerHTML = `<h3>Planet Speeds</h3>`;
PLANETS.forEach((p, i) => {
  controlsDiv.innerHTML += `
    <label for="speed-${i}">${p.name}</label>
    <input type="range" id="speed-${i}" min="0.1" max="10" step="0.01" value="${p.speed}">
    <span id="speed-val-${i}">${p.speed}</span><br/>
  `;
});
controlsDiv.innerHTML += `<button id="pauseBtn">Pause</button>`;

// --- Speed Control Logic ---
PLANETS.forEach((p, i) => {
  const slider = document.getElementById(`speed-${i}`);
  const valSpan = document.getElementById(`speed-val-${i}`);
  slider.addEventListener('input', (e) => {
    planetData[i].speed = parseFloat(e.target.value);
    valSpan.textContent = e.target.value;
  });
});

// --- Pause/Resume ---
let paused = false;
const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
});

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);
  if (!paused) {
    planetData.forEach((p) => {
      p.angle += 0.01 * p.speed / p.distance;
      const x = Math.cos(p.angle) * p.distance;
      const z = Math.sin(p.angle) * p.distance;
      const y = 10; // Top vertical position
      p.mesh.position.set(x, y, z);
      p.mesh.rotation.y += 0.01;
    });
  }
  renderer.render(scene, camera);
}
animate();

// --- Responsive Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Background Stars ---
function addStars(numStars = 300) {
  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * 600;
    const y = (Math.random() - 0.5) * 600;
    const z = (Math.random() - 0.5) * 600;
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}
addStars();
