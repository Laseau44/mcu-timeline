import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Ref } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { passages, universes } from '../data/universes';

export interface SceneHandle { reset: () => void; zoom: (factor: number) => void; }
interface Props { selected: string; onSelect: (id: string) => void; links: boolean; moving: boolean; mode: 'orbit' | 'pan'; sceneRef: Ref<SceneHandle>; }
const nodePositions = universes.map(u => new THREE.Vector3(u.position[0] / 95, -u.position[1] / 95, u.position[2] / 120));

// A folded, variable-width ribbon: one continuous surface rather than a HUD graphic.
function ribbonGeometry(phase: number, width: number) {
  const vertices: number[] = [], indices: number[] = [];
  const n = 220, slices = 10;
  for (let i = 0; i <= n; i++) {
    const t = i / n * Math.PI * 2;
    const center = new THREE.Vector3(Math.cos(t) * (2.1 + .48 * Math.cos(t * 3 + phase)), Math.sin(t) * (2.1 + .48 * Math.cos(t * 3 + phase)), Math.sin(t * 3 + phase) * .9);
    for (let j = 0; j <= slices; j++) {
      const v = (j / slices - .5) * width * (.7 + .3 * Math.cos(t * 3));
      const twist = t * 1.5 + phase;
      vertices.push(center.x + Math.cos(t) * Math.cos(twist) * v, center.y + Math.sin(t) * Math.cos(twist) * v, center.z + Math.sin(twist) * v);
      if (i < n && j < slices) { const a = i * (slices + 1) + j, b = a + slices + 1; indices.push(a, b, a + 1, b, b + 1, a + 1); }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
}

export default function SpectralScene({ selected, onSelect, links, moving, mode, sceneRef }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const options = useRef({ selected, links, moving, mode });
  const api = useRef<SceneHandle>({ reset: () => {}, zoom: () => {} });
  const [failed, setFailed] = useState(false);
  useImperativeHandle(sceneRef, () => ({ reset: () => api.current.reset(), zoom: factor => api.current.zoom(factor) }), []);
  useEffect(() => { options.current = { selected, links, moving, mode }; }, [selected, links, moving, mode]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cleanup = () => {};
    let disposed = false;
    // Starting asynchronously also makes initialization failures render a usable fallback.
    Promise.resolve().then(() => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x08090b, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = .95;
      element.prepend(renderer.domElement);
      cleanup = () => { renderer.dispose(); renderer.domElement.remove(); };
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, .1, 80);
      camera.position.set(0, .5, 12.4);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.dampingFactor = .08;
      controls.minDistance = 5; controls.maxDistance = 23;
      controls.rotateSpeed = .65; controls.zoomSpeed = .7;
      controls.saveState();
      // Long studio lights create crisp, sculptural reflections against the black void.
      const environment = new THREE.Scene();
      environment.background = new THREE.Color(0x050608);
      const panels = [
        { position: [-5, 2, 3], size: [2, 12], color: 0xe8f0ff },
        { position: [5, 0, 2], size: [1, 11], color: 0x8faedc },
        { position: [0, 6, -2], size: [9, 1.3], color: 0xffffff },
        { position: [-2, -4, 4], size: [6, .8], color: 0xb8a5de },
        { position: [1, 1, -6], size: [2, 9], color: 0xd8edeb },
      ].map(p => {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...p.size as [number, number]), new THREE.MeshBasicMaterial({ color: new THREE.Color(p.color).multiplyScalar(3), side: THREE.DoubleSide }));
        mesh.position.set(...p.position as [number, number, number]); mesh.lookAt(0, 0, 0); environment.add(mesh); return mesh;
      });
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTarget = pmrem.fromScene(environment, .01);
      scene.environment = envTarget.texture;
      panels.forEach(p => { p.geometry.dispose(); p.material.dispose(); }); pmrem.dispose();
      scene.add(new THREE.HemisphereLight(0xe7edff, 0x17151c, .4));
      const light = new THREE.DirectionalLight(0xf1f7ff, 3); light.position.set(-3, 5, 4); scene.add(light);
      const rim = new THREE.DirectionalLight(0x7b9bbf, 2); rim.position.set(4, -1, -3); scene.add(rim);
      const world = new THREE.Group(); scene.add(world);
      const sculpture = new THREE.Group(); sculpture.rotation.set(.15, -.35, -.5); world.add(sculpture);
      const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe1e7f2, metalness: 1, roughness: .075, clearcoat: 1, iridescence: .4, iridescenceIOR: 1.35, iridescenceThicknessRange: [150, 420], side: THREE.DoubleSide });
      const darkChrome = chrome.clone(); darkChrome.color.set(0x697b91); darkChrome.roughness = .24;
      const glass = new THREE.MeshPhysicalMaterial({ color: 0xcbdbe6, metalness: 0, roughness: .04, transmission: .85, thickness: .1, ior: 1.45, iridescence: 1, iridescenceThicknessRange: [200, 500], transparent: true, opacity: .25, depthWrite: false, side: THREE.DoubleSide });
      const mainRibbon = new THREE.Mesh(ribbonGeometry(0, .9), chrome); sculpture.add(mainRibbon);
      const second = new THREE.Mesh(ribbonGeometry(1.8, .7), darkChrome); second.rotation.set(.7, .8, .9); second.scale.setScalar(.93); sculpture.add(second);
      const membrane = new THREE.Mesh(ribbonGeometry(.8, 1.3), glass); membrane.rotation.set(-.6, .2, -.7); membrane.scale.setScalar(1.07); sculpture.add(membrane);
      const surface = membrane.geometry.getAttribute('position');
      for (let j = 0; j <= 10; j += 2) {
        const points = Array.from({ length: 221 }, (_, i) => new THREE.Vector3().fromBufferAttribute(surface, i * 11 + j));
        const filament = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xb0c2d9, transparent: true, opacity: j === 0 || j === 10 ? .55 : .18 }));
        membrane.add(filament);
      }
      // Narrow structural ribs and hairline filaments echo the reference's chrome spines.
      const spine = new THREE.CatmullRomCurve3(Array.from({ length: 80 }, (_, i) => { const a = i / 79 * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * 2.25, Math.sin(a) * 2.25, Math.sin(3 * a) * .8); }), true);
      const wire = new THREE.Mesh(new THREE.TubeGeometry(spine, 180, .018, 6, true), chrome); sculpture.add(wire);
      const finGeometry = new THREE.BoxGeometry(.025, .28, .24);
      for (let i = 0; i < 54; i++) {
        const t = i / 54, fin = new THREE.Mesh(finGeometry, i % 4 === 0 ? darkChrome : chrome);
        fin.position.copy(spine.getPoint(t)); fin.lookAt(spine.getPoint((t + .008) % 1));
        fin.rotateZ(t * Math.PI * 5); fin.scale.y = .55 + Math.sin(t * Math.PI * 6) ** 2 * 1.9; sculpture.add(fin);
      }
      for (let i = 0; i < 7; i++) {
        const path = new THREE.CatmullRomCurve3(Array.from({ length: 110 }, (_, j) => { const a = j / 109 * Math.PI * 2; const r = 2.6 + i * .055; return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * .55, Math.sin(a * 2 + i * .22) * .85); }), true);
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(path.getPoints(160)), new THREE.LineBasicMaterial({ color: i % 3 === 0 ? 0xb1b4cd : 0x78858d, transparent: true, opacity: .24 }));
        line.rotation.set(i * .22, i * .31, .4); sculpture.add(line);
      }
      const nodeGeometry = new THREE.SphereGeometry(.095, 20, 16);
      const nodes = universes.map((u, index) => {
        const material = new THREE.MeshStandardMaterial({ color: 0xdce1ed, metalness: .5, roughness: .15, emissive: 0x3c4c64, emissiveIntensity: .5 });
        const mesh = new THREE.Mesh(nodeGeometry, material); mesh.position.copy(nodePositions[index]); mesh.userData.id = u.id; world.add(mesh); return mesh;
      });
      const crossing = new THREE.Group(); world.add(crossing);
      passages.forEach(link => {
        const a = nodePositions[universes.findIndex(u => u.id === link.from)], b = nodePositions[universes.findIndex(u => u.id === link.to)];
        const curve = new THREE.QuadraticBezierCurve3(a, a.clone().lerp(b, .5).add(new THREE.Vector3(0, .25, 1)), b);
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(45)), new THREE.LineBasicMaterial({ color: 0xc8bfea, transparent: true, opacity: .45 })); crossing.add(line);
      });
      const raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
      let down: { x: number; y: number } | null = null;
      const pointerDown = (event: PointerEvent) => { down = { x: event.clientX, y: event.clientY }; };
      const pointerUp = (event: PointerEvent) => {
        if (!down || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
        raycaster.setFromCamera(mouse, camera);
        const hit = raycaster.intersectObjects(nodes)[0]; if (hit) onSelect(hit.object.userData.id);
        down = null;
      };
      renderer.domElement.addEventListener('pointerdown', pointerDown);
      renderer.domElement.addEventListener('pointerup', pointerUp);
      const lost = (event: Event) => { event.preventDefault(); cleanup(); setFailed(true); };
      renderer.domElement.addEventListener('webglcontextlost', lost);
      let width = 1, height = 1, visible = true, frame = 0, last = 0;
      const resize = new ResizeObserver(() => {
        width = element.clientWidth; height = element.clientHeight;
        renderer.setSize(width, height); camera.aspect = width / height;
        camera.fov = width < 500 ? 51 : 38; camera.updateProjectionMatrix();
      }); resize.observe(element);
      const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); visibility.observe(element);
      const vec = new THREE.Vector3();
      const draw = (time: number) => {
        frame = requestAnimationFrame(draw);
        if (!visible || document.hidden || time - last < 32) return;
        const delta = Math.min((time - last) / 1000, .1); last = time;
        const settings = options.current;
        controls.mouseButtons.LEFT = settings.mode === 'pan' ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
        controls.touches.ONE = settings.mode === 'pan' ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
        if (settings.moving) sculpture.rotation.y += delta * .07;
        crossing.visible = settings.links;
        controls.update(); world.updateMatrixWorld(true);
        nodes.forEach((node, i) => {
          const active = settings.selected === universes[i].id;
          node.scale.setScalar(active ? 1.65 : 1);
          node.material.emissiveIntensity = active ? 2.2 : .25;
          const label = labels.current[i];
          if (!label) return;
          node.getWorldPosition(vec); vec.project(camera);
          label.style.left = `${(vec.x * .5 + .5) * width}px`;
          label.style.top = `${(-vec.y * .5 + .5) * height}px`;
          label.style.visibility = vec.z > 1 || vec.x < -1.05 || vec.x > 1.05 || vec.y < -1.05 || vec.y > 1.05 ? 'hidden' : 'visible';
        });
        renderer.render(scene, camera);
      };
      api.current = { reset: () => { controls.reset(); sculpture.rotation.set(.15, -.35, -.5); }, zoom: factor => { camera.position.sub(controls.target).multiplyScalar(factor).clampLength(5,23).add(controls.target); controls.update(); } };
      frame = requestAnimationFrame(draw);
      cleanup = () => {
        cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect(); controls.dispose();
        renderer.domElement.removeEventListener('pointerdown', pointerDown); renderer.domElement.removeEventListener('pointerup', pointerUp); renderer.domElement.removeEventListener('webglcontextlost', lost);
        const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
        scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.Line) { geometries.add(object.geometry); const ms = Array.isArray(object.material) ? object.material : [object.material]; ms.forEach(m => materials.add(m)); } });
        geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); envTarget.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => { cleanup(); if (!disposed) setFailed(true); });
    return () => { disposed = true; cleanup(); };
  }, [onSelect]);

  return <div ref={host} className={`spectral-scene ${failed ? 'scene-unavailable' : ''}`} tabIndex={0} role="group" aria-label="Sculpture interactive du multivers. Glisser pour tourner, molette pour zoomer. Utilisez les boutons ou Tab pour explorer." onKeyDown={event => { if (event.key === '+' || event.key === '=') { event.preventDefault(); api.current.zoom(.85); } if (event.key === '-') { event.preventDefault(); api.current.zoom(1.15); } if (event.key === '0') api.current.reset(); }}>
    {failed && <div className="scene-fallback"><span>La vue 3D n’est pas disponible dans ce navigateur.</span><p>Les univers et leurs films restent accessibles dans l’index.</p></div>}
    {!failed && <div className="scene-labels">{universes.map((u, index) => <button ref={element => { labels.current[index] = element; }} key={u.id} className={selected === u.id ? 'selected' : ''} onClick={() => onSelect(u.id)} aria-label={`Explorer ${u.code} : ${u.name}`} aria-pressed={selected === u.id}><i/><span>{u.code.replace('TERRE-', '')}</span>{selected === u.id && <small>{u.id === 'mcu' ? 'MCU' : u.name}</small>}</button>)}</div>}
  </div>;
}
