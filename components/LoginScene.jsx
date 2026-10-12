"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Box from "@mui/material/Box";
import { useColorScheme, useTheme } from "@mui/material/styles";

// Soft round sprite, used for the halo and for node points
function makeDotTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

/* Glowing orb: bright rim (fresnel) with colour bands that drift along the surface */
const ORB_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const ORB_FRAG = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uTime;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.4);
    float drift = 0.5 + 0.5 * sin(vPos.y * 1.8 + uTime * 0.8);
    float bands = 0.5 + 0.5 * sin(vPos.y * 14.0 - uTime * 1.5);
    vec3 col = mix(uA, uB, drift);
    float a = (fres * 0.95 + 0.10 + bands * 0.06) * uStrength;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

/* Background dust: each particle twinkles on its own phase */
const DUST_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uScale;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vColor = aColor;
    vTw = 0.5 + 0.5 * sin(uTime * 1.4 + aPhase);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const DUST_FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.6);
    gl_FragColor = vec4(vColor, a * (0.25 + 0.75 * vTw) * uOpacity);
    #include <colorspace_fragment>
  }
`;

export default function LoginScene() {
  const mountRef = useRef(null);
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const scheme = mode === "system" ? systemMode : mode; // undefined until hydrated

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !scheme) return;

    const palette = theme.colorSchemes?.[scheme]?.palette ?? theme.palette;
    const isDark = scheme === "dark";
    const primary = new THREE.Color(palette.primary.main);
    const secondary = new THREE.Color(palette.secondary.main);
    const blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // No WebGL: the page still works without the backdrop
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 1.4s ease";
    mount.appendChild(renderer.domElement);
    const fadeIn = setTimeout(() => (renderer.domElement.style.opacity = "1"), 30);

    const disposables = [];
    const track = (item) => (disposables.push(item), item);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 16;

    const world = new THREE.Group(); // placed and scaled per viewport
    const pivot = new THREE.Group(); // pointer parallax + slow turn
    world.add(pivot);
    scene.add(world);

    const dot = track(makeDotTexture());

    // Wide halo behind everything
    const halo = new THREE.Sprite(
      track(new THREE.SpriteMaterial({
        map: dot, color: primary, transparent: true, depthWrite: false,
        opacity: isDark ? 0.55 : 0.28, blending,
      }))
    );
    halo.scale.set(11, 11, 1);
    world.add(halo);

    // Glowing orb
    const orbMat = track(new THREE.ShaderMaterial({
      uniforms: {
        uA: { value: primary }, uB: { value: secondary },
        uTime: { value: 0 }, uStrength: { value: isDark ? 1 : 0.85 },
      },
      vertexShader: ORB_VERT,
      fragmentShader: ORB_FRAG,
      transparent: true,
      depthWrite: false,
      blending,
    }));
    const orb = new THREE.Mesh(track(new THREE.SphereGeometry(1.55, 64, 64)), orbMat);

    // Geodesic shell with glowing nodes
    const shellGeo = track(new THREE.IcosahedronGeometry(2.1, 2));
    const shell = new THREE.LineSegments(
      track(new THREE.WireframeGeometry(shellGeo)),
      track(new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: isDark ? 0.3 : 0.5, blending }))
    );
    shell.add(new THREE.Points(
      shellGeo,
      track(new THREE.PointsMaterial({ color: primary, size: 0.2, map: dot, transparent: true, depthWrite: false, blending }))
    ));

    // Small counter-rotating crystal inside the orb
    const crystal = new THREE.LineSegments(
      track(new THREE.WireframeGeometry(track(new THREE.IcosahedronGeometry(0.9, 0)))),
      track(new THREE.LineBasicMaterial({ color: isDark ? 0xffffff : secondary, transparent: true, opacity: 0.9, blending }))
    );
    pivot.add(orb, shell, crystal);

    // Orbit rings, two satellites each
    const rings = [
      { r: 3.2, tilt: [1.2, 0.3], speed: 0.25 },
      { r: 3.9, tilt: [0.4, 1.1], speed: -0.18 },
      { r: 4.6, tilt: [1.9, 0.8], speed: 0.12 },
    ].map(({ r, tilt, speed }) => {
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.set(tilt[0], tilt[1], 0);
      const spin = new THREE.Group();

      spin.add(new THREE.Mesh(
        track(new THREE.TorusGeometry(r, 0.012, 8, 200)),
        track(new THREE.MeshBasicMaterial({ color: secondary, transparent: true, opacity: isDark ? 0.45 : 0.6, blending }))
      ));

      [[0, primary, 0.55], [Math.PI, secondary, 0.35]].forEach(([angle, color, size]) => {
        const g = track(new THREE.BufferGeometry());
        g.setAttribute("position", new THREE.BufferAttribute(
          new Float32Array([Math.cos(angle) * r, Math.sin(angle) * r, 0]), 3));
        spin.add(new THREE.Points(
          g,
          track(new THREE.PointsMaterial({ color, size, map: dot, transparent: true, depthWrite: false, blending }))
        ));
      });

      tiltGroup.add(spin);
      pivot.add(tiltGroup);
      return { spin, speed };
    });

    // Twinkling dust
    const COUNT = 900;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const size = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const radius = 5.5 + Math.random() * 4.5;
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      pos.set([radius * s * Math.cos(a), radius * u, radius * s * Math.sin(a)], i * 3);
      const c = primary.clone().lerp(secondary, Math.random());
      col.set([c.r, c.g, c.b], i * 3);
      size[i] = 0.08 + Math.random() * 0.16;
      phase[i] = Math.random() * Math.PI * 2;
    }
    const dustGeo = track(new THREE.BufferGeometry());
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    dustGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    dustGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    dustGeo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const dustMat = track(new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uScale: { value: 400 }, uOpacity: { value: isDark ? 1 : 0.9 } },
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthWrite: false,
      blending,
    }));
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Pointer parallax
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    let baseScale = 1;
    const size2 = new THREE.Vector2();

    function resize() {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.getDrawingBufferSize(size2);
      dustMat.uniforms.uScale.value = size2.y * 0.5;

      const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const visW = visH * camera.aspect;
      const desktop = w >= 900;

      // Desktop: sit in the left (brand) half, a little above center. Mobile: centered.
      const available = desktop ? visW * 0.5 : visW;
      baseScale = Math.min(1, available / 10.5) * (desktop ? 0.85 : 0.9);
      world.scale.setScalar(baseScale);
      world.position.set(desktop ? -visW * 0.24 : 0, desktop ? visH * 0.1 : 0, 0);

      if (reduceMotion) renderer.render(scene, camera);
    }

    const clock = new THREE.Clock();
    let raf = 0;

    function frame() {
      const t = clock.getElapsedTime();
      pointer.x += (target.x - pointer.x) * 0.04;
      pointer.y += (target.y - pointer.y) * 0.04;

      // One intro moment: the scene swells into place
      const k = Math.min(t / 1.8, 1);
      world.scale.setScalar(baseScale * (0.7 + 0.3 * (1 - Math.pow(1 - k, 3))));

      pivot.rotation.y = t * 0.12 + pointer.x * 0.5;
      pivot.rotation.x = pointer.y * 0.3 + Math.sin(t * 0.3) * 0.1;
      pivot.scale.setScalar(1 + Math.sin(t * 1.2) * 0.02);
      shell.rotation.y = t * 0.1;
      crystal.rotation.set(t * 0.15, -t * 0.25, 0);
      dust.rotation.y = t * 0.015;
      rings.forEach(({ spin, speed }) => (spin.rotation.z = t * speed));

      camera.position.x = pointer.x * 0.6;
      camera.position.y = -pointer.y * 0.4;
      orbMat.uniforms.uTime.value = t;
      dustMat.uniforms.uTime.value = t;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduceMotion) raf = requestAnimationFrame(frame);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    if (!reduceMotion) {
      window.addEventListener("pointermove", onMove);
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      clearTimeout(fadeIn);
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [scheme, theme]);

  return (
    <Box
      ref={mountRef}
      aria-hidden="true"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: { xs: 0.5, md: 1 },
      }}
    />
  );
}