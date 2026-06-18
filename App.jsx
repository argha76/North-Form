import { useEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  WebGLRenderer,
} from "three";

const products = [
  {
    id: 1,
    name: "Arc Utility Jacket",
    category: "Outerwear / 01",
    price: 248,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=88",
    alt: "Model wearing a structured dark jacket",
    tone: "#d9d4cb",
  },
  {
    id: 2,
    name: "Negative Space Tee",
    category: "Essentials / 02",
    price: 84,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=88",
    alt: "Minimal black t-shirt",
    tone: "#e5e0d7",
  },
  {
    id: 3,
    name: "Column Trouser",
    category: "Tailoring / 03",
    price: 176,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=88",
    alt: "Editorial fashion look in neutral tones",
    tone: "#c7b9a4",
  },
  {
    id: 4,
    name: "Form Knit 02",
    category: "Knitwear / 04",
    price: 138,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=88",
    alt: "Folded neutral knitwear",
    tone: "#d8d0c2",
  },
];

const editorialImages = [
  {
    src: "https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&q=88",
    alt: "Fashion model in an architectural setting",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=88",
    alt: "Curated clothing rail",
  },
  {
    src: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=88",
    alt: "Modern fashion collection",
  },
];

const lookbookFrames = [
  {
    number: "01",
    title: "Transit",
    subtitle: "Between places",
    copy: "Soft armour for the hours when the city changes shape.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=90",
    alt: "Editorial fashion models in sculptural clothing",
  },
  {
    number: "02",
    title: "Signal",
    subtitle: "After dark",
    copy: "Reflective details, compact layers, and silhouettes that hold their ground.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=90",
    alt: "Portrait from the North Form campaign",
  },
  {
    number: "03",
    title: "Static",
    subtitle: "Beyond season",
    copy: "A permanent uniform built from texture, restraint, and deliberate imbalance.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=90",
    alt: "Streetwear editorial photographed outdoors",
  },
];

const Arrow = ({ diagonal = false }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={diagonal ? "M5 19 19 5M8 5h11v11" : "M5 12h14M14 7l5 5-5 5"} />
  </svg>
);

function AmbientCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    const pointer = { x: -1000, y: -1000 };
    let particles = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: width < 700 ? 24 : 46 }, (_, index) => ({
        x: (index * 137.5) % Math.max(width, 1),
        y: (index * 83.7) % Math.max(height, 1),
        vx: Math.sin(index * 1.7) * 0.16,
        vy: Math.cos(index * 1.3) * 0.16,
        size: index % 5 === 0 ? 2 : 1,
      }));
    };

    const onPointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 190 && distance > 1) {
          particle.vx -= (dx / distance) * 0.006;
          particle.vy -= (dy / distance) * 0.006;
        }
        particle.vx *= 0.992;
        particle.vy *= 0.992;
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        context.beginPath();
        context.fillStyle = `rgba(16,16,16,${particle.size === 2 ? 0.28 : 0.14})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();

        for (let neighborIndex = index + 1; neighborIndex < particles.length; neighborIndex += 1) {
          const neighbor = particles[neighborIndex];
          const lineDistance = Math.hypot(neighbor.x - particle.x, neighbor.y - particle.y);
          if (lineDistance < 95) {
            context.beginPath();
            context.strokeStyle = `rgba(16,16,16,${0.07 * (1 - lineDistance / 95)})`;
            context.moveTo(particle.x, particle.y);
            context.lineTo(neighbor.x, neighbor.y);
            context.stroke();
          }
        }
      });
      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas className="ambient-canvas" ref={canvasRef} aria-hidden="true" />;
}

function ThreeWorld() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      canvas.dataset.webgl = "unavailable";
      return undefined;
    }

    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 5.4);
    const world = new Group();
    scene.add(world);

    const mobile = window.innerWidth < 700;
    const sculptureGeometry = new SphereGeometry(1.05, mobile ? 34 : 54, mobile ? 24 : 40);
    const basePositions = sculptureGeometry.attributes.position.array.slice();
    const sculptureMaterial = new MeshPhysicalMaterial({
      color: 0xdfff45,
      roughness: 0.22,
      metalness: 0.28,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity: 0.92,
      side: DoubleSide,
    });
    const sculpture = new Mesh(sculptureGeometry, sculptureMaterial);
    sculpture.scale.set(1.25, 1.6, 0.72);
    world.add(sculpture);

    const cageGeometry = new IcosahedronGeometry(1.55, 2);
    const cageMaterial = new MeshBasicMaterial({ color: 0x101010, wireframe: true, transparent: true, opacity: 0.13 });
    const cage = new Mesh(cageGeometry, cageMaterial);
    cage.scale.set(1, 1.18, 1);
    world.add(cage);

    const knotGeometry = new TorusKnotGeometry(1.35, 0.028, mobile ? 100 : 180, 8, 2, 3);
    const knotMaterial = new MeshStandardMaterial({ color: 0x111111, metalness: 0.86, roughness: 0.2 });
    const knot = new Mesh(knotGeometry, knotMaterial);
    knot.rotation.x = Math.PI * 0.5;
    world.add(knot);

    const ringMaterial = new MeshBasicMaterial({ color: 0x101010, transparent: true, opacity: 0.24 });
    const rings = [0, 1, 2].map((index) => {
      const geometry = new TorusGeometry(1.88 + index * 0.22, 0.008, 6, 160);
      const ring = new Mesh(geometry, ringMaterial);
      ring.rotation.set(index * 0.72, index * 0.48, index * 0.9);
      world.add(ring);
      return ring;
    });

    const particleCount = mobile ? 130 : 320;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 2.4 + ((index * 19) % 100) / 32;
      const angle = index * 2.39996;
      particlePositions[index * 3] = Math.cos(angle) * radius;
      particlePositions[index * 3 + 1] = Math.sin(angle * 1.31) * radius * 0.7;
      particlePositions[index * 3 + 2] = Math.sin(angle) * radius - 2;
    }
    const particleGeometry = new BufferGeometry();
    particleGeometry.setAttribute("position", new BufferAttribute(particlePositions, 3));
    const particleMaterial = new PointsMaterial({ color: 0x101010, size: mobile ? 0.018 : 0.024, transparent: true, opacity: 0.32 });
    const particles = new Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const ambient = new HemisphereLight(0xffffff, 0x666666, 2.1);
    const keyLight = new DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(3, 4, 5);
    const pointerLight = new PointLight(0xdfff45, 12, 8);
    pointerLight.position.set(-2, 1, 3);
    scene.add(ambient, keyLight, pointerLight);

    const pointer = { x: 0, y: 0 };
    const scroll = { target: 0, current: 0 };
    let frame = 0;
    const startedAt = window.performance.now();
    const lime = new Color(0xdfff45);
    const violet = new Color(0x9fa8ff);

    const onPointerMove = (event) => {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    };
    const onScroll = () => {
      const distance = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scroll.target = window.scrollY / distance;
    };
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.2 : 1.55));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const render = () => {
      const elapsed = (window.performance.now() - startedAt) / 1000;
      scroll.current += (scroll.target - scroll.current) * 0.055;
      const positions = sculptureGeometry.attributes.position;
      for (let index = 0; index < positions.count; index += 1) {
        const offset = index * 3;
        const x = basePositions[offset];
        const y = basePositions[offset + 1];
        const z = basePositions[offset + 2];
        const wave = Math.sin(x * 4.2 + elapsed * 1.1) * 0.055 + Math.cos(y * 5.1 - elapsed * 0.82) * 0.045;
        const scale = 1 + wave;
        positions.setXYZ(index, x * scale, y * scale, z * scale);
      }
      positions.needsUpdate = true;
      sculptureGeometry.computeVertexNormals();
      sculptureMaterial.color.lerpColors(lime, violet, Math.sin(scroll.current * Math.PI) * 0.72);
      world.rotation.y = elapsed * 0.12 + scroll.current * Math.PI * 4 + pointer.x * 0.45;
      world.rotation.x = Math.sin(elapsed * 0.25) * 0.1 + scroll.current * 0.9 + pointer.y * 0.3;
      world.rotation.z = Math.sin(scroll.current * Math.PI * 3) * 0.22;
      world.position.x = Math.sin(scroll.current * Math.PI * 5) * 0.78 + pointer.x * 0.32;
      world.position.y = Math.cos(scroll.current * Math.PI * 3) * 0.34 - (scroll.current - 0.5) * 0.9 - pointer.y * 0.22;
      const worldScale = 1 - Math.sin(scroll.current * Math.PI) * 0.18;
      world.scale.setScalar(worldScale);
      cage.rotation.x = -elapsed * 0.08;
      cage.rotation.z = elapsed * 0.06;
      knot.rotation.z = elapsed * 0.16 - scroll.current * Math.PI * 2;
      rings.forEach((ring, index) => {
        ring.rotation.x += 0.0007 * (index + 1);
        ring.rotation.y -= 0.0005 * (index + 1);
      });
      particles.rotation.y = elapsed * 0.018 + scroll.current * 1.8;
      particles.rotation.x = pointer.y * 0.1;
      pointerLight.position.x += (pointer.x * 5 - pointerLight.position.x) * 0.05;
      pointerLight.position.y += (-pointer.y * 4 - pointerLight.position.y) * 0.05;
      camera.position.z = 5.4 - Math.sin(scroll.current * Math.PI) * 0.75;
      renderer.render(scene, camera);
      canvas.dataset.webgl = "ready";
      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };

    resize();
    onScroll();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      sculptureGeometry.dispose();
      sculptureMaterial.dispose();
      cageGeometry.dispose();
      cageMaterial.dispose();
      knotGeometry.dispose();
      knotMaterial.dispose();
      rings.forEach((ring) => ring.geometry.dispose());
      ringMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className="three-world" ref={canvasRef} aria-hidden="true" />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState("");
  const [email, setEmail] = useState("");
  const [activeLook, setActiveLook] = useState(0);
  const [showroomAngle, setShowroomAngle] = useState(0);
  const cursorRef = useRef(null);
  const productRailRef = useRef(null);
  const lookbookRef = useRef(null);
  const showroomDragRef = useRef({ active: false, moved: false, startX: 0, startAngle: 0 });

  useEffect(() => {
    let frame = 0;
    let finishTimer = 0;
    const startedAt = window.performance.now();
    const animateLoader = (now) => {
      const progress = Math.min((now - startedAt) / 1350, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setLoadCount(Math.round(eased * 100));
      if (progress < 1) frame = window.requestAnimationFrame(animateLoader);
      else finishTimer = window.setTimeout(() => setLoading(false), 160);
    };
    frame = window.requestAnimationFrame(animateLoader);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(finishTimer);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let previousY = window.scrollY;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const velocity = Math.max(-18, Math.min(18, y - previousY));
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        document.documentElement.style.setProperty("--scroll-shift", `${Math.min(y * 0.12, 115)}px`);
        document.documentElement.style.setProperty("--page-progress", `${(y / max) * 100}%`);
        document.documentElement.style.setProperty("--ticker-skew", `${velocity * -0.22}deg`);
        document.documentElement.style.setProperty("--scroll-velocity", `${velocity}`);
        if (lookbookRef.current) {
          const bounds = lookbookRef.current.getBoundingClientRect();
          const distance = Math.max(lookbookRef.current.offsetHeight - window.innerHeight, 1);
          const progress = Math.max(0, Math.min(1, -bounds.top / distance));
          lookbookRef.current.style.setProperty("--look-progress", progress.toFixed(4));
          const nextLook = Math.min(lookbookFrames.length - 1, Math.floor(progress * lookbookFrames.length));
          setActiveLook((current) => (current === nextLook ? current : nextLook));
        }
        setScrolled(y > 40);
        previousY = y;
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.14 }
    );
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let frame = 0;
    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      document.documentElement.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth - 0.5).toFixed(3)}`);
      document.documentElement.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight - 0.5).toFixed(3)}`);
      document.documentElement.style.setProperty("--pointer-px", `${(event.clientX / window.innerWidth - 0.5) * 18}px`);
      document.documentElement.style.setProperty("--pointer-py", `${(event.clientY / window.innerHeight - 0.5) * 14}px`);
    };
    const onPointerOver = (event) => {
      if (!cursorRef.current) return;
      const targetElement = event.target.closest("[data-cursor]");
      const label = cursorRef.current.querySelector("b");
      if (label) label.textContent = targetElement?.dataset.cursor || "";
      cursorRef.current.classList.toggle("has-label", Boolean(targetElement));
    };
    const follow = () => {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      frame = window.requestAnimationFrame(follow);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    frame = window.requestAnimationFrame(follow);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onPointerOver);
    };
  }, []);

  useEffect(() => {
    const magnetics = [...document.querySelectorAll(".magnetic")];
    const tilts = [...document.querySelectorAll(".tilt-card")];
    const magneticMove = (event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--mag-x", `${(event.clientX - bounds.left - bounds.width / 2) * 0.22}px`);
      event.currentTarget.style.setProperty("--mag-y", `${(event.clientY - bounds.top - bounds.height / 2) * 0.22}px`);
    };
    const magneticLeave = (event) => {
      event.currentTarget.style.setProperty("--mag-x", "0px");
      event.currentTarget.style.setProperty("--mag-y", "0px");
    };
    const tiltMove = (event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      event.currentTarget.style.setProperty("--tilt-x", `${y * -5}deg`);
      event.currentTarget.style.setProperty("--tilt-y", `${x * 7}deg`);
      event.currentTarget.style.setProperty("--shine-x", `${(x + 0.5) * 100}%`);
      event.currentTarget.style.setProperty("--shine-y", `${(y + 0.5) * 100}%`);
    };
    const tiltLeave = (event) => {
      event.currentTarget.style.setProperty("--tilt-x", "0deg");
      event.currentTarget.style.setProperty("--tilt-y", "0deg");
    };
    magnetics.forEach((element) => {
      element.addEventListener("pointermove", magneticMove);
      element.addEventListener("pointerleave", magneticLeave);
    });
    tilts.forEach((element) => {
      element.addEventListener("pointermove", tiltMove);
      element.addEventListener("pointerleave", tiltLeave);
    });
    return () => {
      magnetics.forEach((element) => {
        element.removeEventListener("pointermove", magneticMove);
        element.removeEventListener("pointerleave", magneticLeave);
      });
      tilts.forEach((element) => {
        element.removeEventListener("pointermove", tiltMove);
        element.removeEventListener("pointerleave", tiltLeave);
      });
    };
  }, [loading]);

  useEffect(() => {
    const locked = menuOpen || cartOpen || selectedProduct;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen, selectedProduct]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message) => setToast(message);

  const addToCart = (product, size = selectedSize) => {
    setCart((items) => [...items, { ...product, cartId: `${product.id}-${Date.now()}`, size }]);
    setSelectedProduct(null);
    showToast(`${product.name} added to bag`);
  };

  const scrollProducts = (direction) => {
    productRailRef.current?.scrollBy({ left: direction * 420, behavior: "smooth" });
  };

  const submitNewsletter = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setEmail("");
    showToast("You’re on the list — welcome in.");
  };

  const beginShowroomDrag = (event) => {
    showroomDragRef.current = { active: true, moved: false, startX: event.clientX, startAngle: showroomAngle };
    event.currentTarget.dataset.dragging = "true";
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const moveShowroom = (event) => {
    if (!showroomDragRef.current.active) return;
    const distance = event.clientX - showroomDragRef.current.startX;
    if (Math.abs(distance) > 6) showroomDragRef.current.moved = true;
    setShowroomAngle(showroomDragRef.current.startAngle + distance * 0.34);
  };

  const endShowroomDrag = (event) => {
    if (!showroomDragRef.current.active) return;
    showroomDragRef.current.active = false;
    event.currentTarget.dataset.dragging = "false";
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setShowroomAngle((angle) => Math.round(angle / 90) * 90);
  };

  const rotateShowroom = (direction) => setShowroomAngle((angle) => Math.round(angle / 90) * 90 + direction * 90);

  return (
    <div className="site-shell">
      <style>{styles}</style>
      <ThreeWorld />
      <div className="three-hud" aria-hidden="true"><span>WEBGL / LIVE</span><i /><span>SCROLL TO MORPH</span></div>

      <div className={`loader ${loading ? "is-loading" : "is-done"}`} aria-hidden={!loading}>
        <div className="loader-top"><div className="loader-mark">N/F</div><strong>{String(loadCount).padStart(3, "0")}</strong></div>
        <div className="loader-line"><span style={{ transform: `scaleX(${loadCount / 100})` }} /></div>
        <div className="loader-meta"><span>Independent uniform</span><span>Est. 2026</span></div>
      </div>

      <div className="site-grain" aria-hidden="true" />
      <div className="cursor" ref={cursorRef} aria-hidden="true"><span /><b /></div>
      <div className="progress-line" aria-hidden="true" />

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="North Form home">NØRTH/FORM</a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#shop">Shop</a>
          <a href="#campaign">Campaign</a>
          <a href="#about">About</a>
        </nav>
        <div className="header-actions">
          <button className="text-button magnetic" onClick={() => setCartOpen(true)}>
            Bag <span>[{String(cart.length).padStart(2, "0")}]</span>
          </button>
          <button
            className="menu-button magnetic"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <i /><i /><i /><i />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <AmbientCanvas />
          <div className="hero-kicker hero-enter">
            <span>Drop 04 / Reconstructed essentials</span>
            <span>London — Everywhere</span>
          </div>

          <div className="hero-stage" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <figure className="hero-frame frame-left tilt-card">
              <img src={editorialImages[0].src} alt="" />
              <figcaption>LOOK 04—A</figcaption>
            </figure>
            <figure className="hero-frame frame-center tilt-card">
              <img src={editorialImages[1].src} alt="" />
              <figcaption>THE NEW UNIFORM</figcaption>
            </figure>
            <figure className="hero-frame frame-right tilt-card">
              <img src={editorialImages[2].src} alt="" />
              <figcaption>OBJECT / FORM</figcaption>
            </figure>
            <div className="hero-sticker">
              <span>NEW</span>
              <small>Edition<br />04</small>
            </div>
          </div>

          <div className="hero-bottom">
            <h1 id="hero-title">
              <span className="hero-line"><span>Clothes for</span></span>
              <span className="hero-line"><span><em>after now.</em></span></span>
            </h1>
            <a className="round-link magnetic" data-cursor="GO" href="#shop" aria-label="Explore collection">
              <span>Explore<br />collection</span><Arrow diagonal />
            </a>
          </div>
        </section>

        <section className="ticker" aria-label="Brand principles">
          <div className="ticker-track">
            <span>PRECISION CUT</span><b>✳</b><span>LOW IMPACT</span><b>✳</b><span>MADE TO MOVE</span><b>✳</b>
            <span>PRECISION CUT</span><b>✳</b><span>LOW IMPACT</span><b>✳</b><span>MADE TO MOVE</span><b>✳</b>
          </div>
        </section>

        <section className="statement section-pad" id="about">
          <div className="section-label reveal"><span>01</span> Our position</div>
          <div className="statement-grid">
            <p className="statement-copy reveal">
              We make <span className="inline-chip">fewer things</span> with more intention—clothing that refuses the season and lives better with time.
            </p>
            <div className="statement-note reveal">
              <span className="rotating-mark">NØRTH<br />FORM</span>
              <p>Designed in London.<br />Made in limited runs.<br />Worn without permission.</p>
            </div>
          </div>
        </section>

        <section className="collection section-pad" id="shop">
          <div className="section-head reveal">
            <div className="section-label"><span>02</span> Current edition</div>
            <h2>Built for the<br /><i>in-between.</i></h2>
            <p>Transitional pieces. Strong lines. Soft structure.</p>
          </div>

          <div className="collection-grid">
            {products.slice(0, 3).map((product, index) => (
              <article className={`product-card product-${index + 1} reveal`} key={product.id}>
                <button className="product-image tilt-card" data-cursor="VIEW" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name}`}>
                  <img src={product.image} alt={product.alt} />
                  <span className="view-pill">Quick view <Arrow diagonal /></span>
                  <span className="image-index">0{index + 1}</span>
                </button>
                <div className="product-info">
                  <div><h3>{product.name}</h3><p>{product.category}</p></div>
                  <span>£{product.price}</span>
                </div>
              </article>
            ))}
          </div>

          <a className="large-link reveal" href="#all-pieces">
            <span>View all pieces</span><Arrow />
          </a>
        </section>

        <section className="campaign" id="campaign">
          <div className="campaign-photo reveal" data-cursor="FILM">
            <img
              src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1800&q=90"
              alt="Fashion editorial in a city setting"
            />
            <div className="campaign-caption"><span>Campaign 04</span><span>48.8566° N</span></div>
          </div>
          <div className="campaign-panel">
            <div className="section-label reveal"><span>03</span> The field study</div>
            <h2 className="reveal">No fixed<br /><em>address.</em></h2>
            <p className="reveal">A study of people in motion, photographed between the built world and the places it forgets.</p>
            <button className="pill-button magnetic reveal" onClick={() => showToast("Campaign film coming soon")}>Watch the film <Arrow /></button>
          </div>
        </section>

        <section className="motion-lookbook" ref={lookbookRef} aria-label="Campaign lookbook">
          <div className="lookbook-sticky">
            <div className="lookbook-copy">
              <div className="section-label"><span>04</span> Motion study</div>
              <div className="lookbook-titles" aria-live="polite">
                {lookbookFrames.map((frame, index) => (
                  <div className={`lookbook-title ${index === activeLook ? "is-active" : ""}`} key={frame.title}>
                    <small>{frame.subtitle}</small>
                    <h2>{frame.title}</h2>
                    <p>{frame.copy}</p>
                  </div>
                ))}
              </div>
              <div className="lookbook-progress">
                {lookbookFrames.map((frame, index) => (
                  <span className={index <= activeLook ? "is-active" : ""} key={frame.number} />
                ))}
              </div>
            </div>

            <div className="lookbook-visual" data-cursor="SCROLL">
              {lookbookFrames.map((frame, index) => (
                <figure
                  className={`lookbook-frame ${index === activeLook ? "is-active" : ""} ${index < activeLook ? "is-past" : ""}`}
                  style={{ "--frame-index": index }}
                  key={frame.title}
                >
                  <img src={frame.image} alt={frame.alt} />
                  <figcaption><span>NF / {frame.number}</span><span>{frame.subtitle}</span></figcaption>
                </figure>
              ))}
              <div className="lookbook-crosshair" aria-hidden="true"><i /><i /></div>
              <div className="lookbook-count"><strong>0{activeLook + 1}</strong><span>/ 03</span></div>
            </div>
          </div>
        </section>

        <section className="showroom" aria-labelledby="showroom-title">
          <div className="showroom-head reveal">
            <div className="section-label"><span>05</span> 360° object room</div>
            <h2 id="showroom-title">Drag the<br /><em>collection.</em></h2>
            <p>Four objects suspended in one continuous space. Drag to orbit, click to inspect.</p>
          </div>
          <div
            className="showroom-stage"
            data-cursor="DRAG"
            data-dragging="false"
            onPointerDown={beginShowroomDrag}
            onPointerMove={moveShowroom}
            onPointerUp={endShowroomDrag}
            onPointerCancel={endShowroomDrag}
          >
            <div className="showroom-floor" aria-hidden="true" />
            <div className="showroom-ring" style={{ "--ring-angle": `${showroomAngle}deg` }}>
              {products.map((product, index) => (
                <article className="showroom-card" style={{ "--card-angle": `${index * 90}deg` }} key={product.id}>
                  <button onClick={() => { if (!showroomDragRef.current.moved) setSelectedProduct(product); }} aria-label={`Explore ${product.name}`}>
                    <img src={product.image} alt={product.alt} draggable="false" />
                    <span className="showroom-card-meta"><small>0{index + 1} / 04</small><strong>{product.name}</strong><b>£{product.price}</b></span>
                  </button>
                </article>
              ))}
            </div>
            <div className="showroom-axis" aria-hidden="true"><i /><i /><span>N/F</span></div>
          </div>
          <div className="showroom-controls">
            <button className="magnetic" onClick={() => rotateShowroom(-1)} aria-label="Rotate showroom left">←</button>
            <span>Click + drag to rotate</span>
            <button className="magnetic" onClick={() => rotateShowroom(1)} aria-label="Rotate showroom right">→</button>
          </div>
        </section>

        <section className="all-pieces section-pad" id="all-pieces">
          <div className="rail-heading reveal">
            <div>
              <div className="section-label"><span>06</span> Objects to wear</div>
              <h2>Edition / 04</h2>
            </div>
            <div className="rail-controls">
              <button className="magnetic" onClick={() => scrollProducts(-1)} aria-label="Previous products">←</button>
              <button className="magnetic" onClick={() => scrollProducts(1)} aria-label="Next products">→</button>
            </div>
          </div>
          <div className="product-rail reveal" ref={productRailRef}>
            {[...products, ...products.slice(0, 2)].map((product, index) => (
              <article className="rail-card" key={`${product.id}-${index}`}>
                <button className="tilt-card" data-cursor="VIEW" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name}`}>
                  <img src={product.image} alt={product.alt} />
                  <span>+</span>
                </button>
                <div><h3>{product.name}</h3><p>£{product.price}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="process section-pad">
          <div className="section-label reveal"><span>07</span> How it is made</div>
          <div className="process-layout">
            <div className="process-intro reveal">
              <h2>Less, but<br /><em>far better.</em></h2>
              <p>Every choice has a consequence. Ours are cut, sewn, tested, and traced before they reach you.</p>
            </div>
            <div className="process-list">
              {[
                ["01", "Material", "Recycled and regenerative fibres selected for feel, strength, and a lighter footprint."],
                ["02", "Construction", "Small-run production with reinforced seams and repairable components."],
                ["03", "Afterlife", "Lifetime repairs, responsible returns, and a second life for every piece."],
              ].map(([number, title, text]) => (
                <article className="process-item reveal" key={number}>
                  <span>{number}</span><h3>{title}</h3><p>{text}</p><Arrow diagonal />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="quote-block">
          <p className="reveal">“The best piece in your wardrobe should be the one you reach for without thinking.”</p>
          <div className="quote-meta reveal"><span>N/F Design rule 01</span><span>Permanent collection</span></div>
        </section>

        <section className="newsletter section-pad">
          <div className="newsletter-orb" aria-hidden="true">04</div>
          <div className="section-label reveal"><span>08</span> Keep in contact</div>
          <h2 className="reveal">The next thing<br />arrives <em>quietly.</em></h2>
          <form className="newsletter-form reveal" onSubmit={submitNewsletter}>
            <label htmlFor="email">Email address</label>
            <div>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@somewhere.com" required />
              <button className="magnetic" type="submit" aria-label="Join newsletter"><Arrow /></button>
            </div>
          </form>
        </section>
      </main>

      <footer>
        <div className="footer-brand">NØRTH/<br />FORM</div>
        <div className="footer-grid">
          <div><span>Browse</span><a href="#shop">Shop all</a><a href="#campaign">Campaign</a><a href="#about">Our position</a></div>
          <div><span>Follow</span><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a><a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a></div>
          <div><span>Help</span><a href="#shipping">Shipping</a><a href="#returns">Returns</a><a href="mailto:studio@northform.example">Contact</a></div>
        </div>
        <div className="footer-base"><span>© 2026 NØRTH/FORM</span><span>Built for movement</span><a href="#top">Back to top ↑</a></div>
      </footer>

      <div className={`menu-overlay ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="overlay-head"><span>NØRTH/FORM</span><button onClick={() => setMenuOpen(false)}>Close ×</button></div>
        <nav>
          {[["Shop", "#shop"], ["Campaign", "#campaign"], ["About", "#about"], ["Contact", "mailto:studio@northform.example"]].map(([label, href], index) => (
            <a href={href} onClick={() => setMenuOpen(false)} key={label}><span>0{index + 1}</span>{label}<Arrow diagonal /></a>
          ))}
        </nav>
        <div className="overlay-foot"><span>London / Worldwide</span><span>Instagram · Pinterest · TikTok</span></div>
      </div>

      <aside className={`cart-drawer ${cartOpen ? "is-open" : ""}`} aria-hidden={!cartOpen}>
        <div className="cart-head"><h2>Your bag</h2><button onClick={() => setCartOpen(false)} aria-label="Close bag">×</button></div>
        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart"><span>0</span><p>Nothing here yet.<br />Good things take time.</p><button onClick={() => setCartOpen(false)}>Continue looking</button></div>
          ) : (
            cart.map((item) => (
              <article className="cart-item" key={item.cartId}>
                <img src={item.image} alt="" />
                <div><h3>{item.name}</h3><p>Size {item.size}</p><strong>£{item.price}</strong><button onClick={() => setCart((items) => items.filter((entry) => entry.cartId !== item.cartId))}>Remove</button></div>
              </article>
            ))
          )}
        </div>
        {cart.length > 0 && <div className="cart-checkout"><div><span>Total</span><strong>£{cart.reduce((sum, item) => sum + item.price, 0)}</strong></div><button onClick={() => showToast("Checkout is ready for backend integration")}>Checkout <Arrow /></button></div>}
      </aside>
      {(cartOpen || selectedProduct) && <button className="backdrop" onClick={() => { setCartOpen(false); setSelectedProduct(null); }} aria-label="Close overlay" />}

      {selectedProduct && (
        <div className="quick-view" role="dialog" aria-modal="true" aria-label={selectedProduct.name}>
          <button className="quick-close" onClick={() => setSelectedProduct(null)} aria-label="Close quick view">×</button>
          <div className="quick-image"><img src={selectedProduct.image} alt={selectedProduct.alt} /><span>Edition 04</span></div>
          <div className="quick-details">
            <p>{selectedProduct.category}</p>
            <h2>{selectedProduct.name}</h2>
            <strong>£{selectedProduct.price}</strong>
            <div className="size-row"><span>Select size</span><div>{["XS", "S", "M", "L", "XL"].map((size) => <button className={selectedSize === size ? "active" : ""} onClick={() => setSelectedSize(size)} key={size}>{size}</button>)}</div></div>
            <button className="add-button" onClick={() => addToCart(selectedProduct)}>Add to bag <Arrow /></button>
            <small>Complimentary delivery over £200 · 14 day returns</small>
          </div>
        </div>
      )}

      <div className={`toast ${toast ? "show" : ""}`} role="status"><span>✳</span>{toast}</div>
    </div>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&display=swap');

  :root { --ink:#101010; --paper:#f2f0e9; --lime:#dfff45; --soft:#dad8d0; --line:rgba(16,16,16,.18); --page-progress:0%; --scroll-shift:0px; --ticker-skew:0deg; --pointer-x:0; --pointer-y:0; --pointer-px:0px; --pointer-py:0px; --scroll-velocity:0; }
  * { box-sizing:border-box; }
  html { scroll-behavior:smooth; background:var(--paper); }
  body { margin:0; background:var(--paper); color:var(--ink); font-family:'DM Sans',sans-serif; cursor:none; }
  button, input { font:inherit; }
  button, a { color:inherit; }
  button { cursor:none; }
  a { text-decoration:none; }
  img { display:block; width:100%; }
  ::selection { background:var(--lime); color:#000; }
  .site-shell { overflow:clip; position:relative; }
  .three-world { position:fixed; z-index:3; inset:0; width:100%; height:100%; pointer-events:none; opacity:.72; filter:saturate(1.16) contrast(1.04); mask-image:radial-gradient(circle at 50% 48%,#000 0 34%,rgba(0,0,0,.92) 48%,transparent 78%); transition:opacity .5s; }
  .three-world[data-webgl="unavailable"] { display:none; }
  .three-hud { position:fixed; z-index:7; left:50%; top:92px; transform:translateX(-50%); display:flex; align-items:center; gap:8px; pointer-events:none; font-size:7px; letter-spacing:.16em; mix-blend-mode:difference; color:#fff; }
  .three-hud i { width:5px; height:5px; border-radius:50%; background:var(--lime); box-shadow:0 0 0 4px rgba(223,255,69,.18); animation:livePulse 1.6s ease-in-out infinite; }
  @keyframes livePulse { 50%{transform:scale(.5);opacity:.5} }
  main>section { transform-style:preserve-3d; }
  main>section>* { position:relative; z-index:5; }
  .site-grain { position:fixed; z-index:450; inset:-25%; width:150%; height:150%; pointer-events:none; opacity:.065; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E"); animation:grainShift .28s steps(2) infinite; mix-blend-mode:multiply; }
  @keyframes grainShift { 0%{transform:translate3d(0,0,0)} 25%{transform:translate3d(2%,-3%,0)} 50%{transform:translate3d(-3%,2%,0)} 75%{transform:translate3d(3%,4%,0)} 100%{transform:translate3d(-2%,-4%,0)} }
  .progress-line { position:fixed; z-index:98; top:0; left:0; width:var(--page-progress); height:3px; background:var(--lime); pointer-events:none; }
  .cursor { position:fixed; z-index:480; left:-18px; top:-18px; width:36px; height:36px; border:1px solid rgba(16,16,16,.55); border-radius:50%; pointer-events:none; transition:width .35s cubic-bezier(.16,1,.3,1),height .35s cubic-bezier(.16,1,.3,1),left .35s,top .35s,background .25s,border .25s; mix-blend-mode:difference; display:grid; place-items:center; }
  .cursor span { position:absolute; width:4px; height:4px; background:#fff; border-radius:50%; top:15px; left:15px; }
  .cursor b { color:#000; font:600 9px 'DM Sans'; letter-spacing:.08em; opacity:0; transition:opacity .2s; }
  .cursor.has-label { width:72px; height:72px; left:-36px; top:-36px; background:#fff; border-color:#fff; mix-blend-mode:normal; }
  .cursor.has-label span { opacity:0; }
  .cursor.has-label b { opacity:1; }
  body:has(a:hover,button:hover) .cursor:not(.has-label) { width:58px; height:58px; left:-29px; top:-29px; background:#fff; border-color:#fff; }
  .magnetic { --mag-x:0px; --mag-y:0px; transform:translate3d(var(--mag-x),var(--mag-y),0); transition:transform .45s cubic-bezier(.16,1,.3,1),background .3s,color .3s; }
  .tilt-card { --tilt-x:0deg; --tilt-y:0deg; --shine-x:50%; --shine-y:50%; transform-style:preserve-3d; transition:transform .55s cubic-bezier(.16,1,.3,1); }
  .loader { position:fixed; inset:0; z-index:500; padding:26px 30px; background:var(--lime); display:flex; flex-direction:column; justify-content:space-between; transition:transform .85s cubic-bezier(.76,0,.24,1),visibility .85s; }
  .loader.is-done { transform:translateY(-105%); visibility:hidden; transition-delay:.05s; }
  .loader-top { display:flex; justify-content:space-between; align-items:flex-start; }
  .loader-top strong { font:500 clamp(36px,7vw,96px)/.8 'Syne'; letter-spacing:-.08em; }
  .loader-mark { font:700 clamp(58px,12vw,180px)/.8 'Syne'; letter-spacing:-.1em; }
  .loader-line { height:1px; background:rgba(0,0,0,.25); overflow:hidden; }
  .loader-line span { display:block; width:100%; height:100%; background:#000; transform-origin:left; transition:transform .08s linear; }
  .loader-meta { display:flex; justify-content:space-between; text-transform:uppercase; font-size:11px; letter-spacing:.08em; }

  .site-header { position:fixed; z-index:100; top:16px; left:20px; right:20px; min-height:58px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; padding:0 12px 0 18px; border-radius:18px; transition:background .35s,box-shadow .35s,backdrop-filter .35s; }
  .site-header.is-scrolled { background:rgba(242,240,233,.82); backdrop-filter:blur(16px); box-shadow:0 8px 30px rgba(0,0,0,.08); }
  .brand { font:700 24px/1 'Syne'; letter-spacing:-.07em; }
  .desktop-nav { display:flex; gap:30px; font-size:12px; text-transform:uppercase; }
  .desktop-nav a { position:relative; }
  .desktop-nav a::after { content:''; position:absolute; left:0; right:100%; bottom:-4px; height:1px; background:currentColor; transition:right .25s; }
  .desktop-nav a:hover::after { right:0; }
  .header-actions { justify-self:end; display:flex; align-items:center; gap:16px; }
  .text-button,.menu-button { border:0; background:transparent; }
  .text-button { font-size:12px; text-transform:uppercase; padding:12px 6px; }
  .menu-button { width:42px; height:42px; border-radius:50%; background:var(--ink); padding:13px; display:grid; grid-template-columns:1fr 1fr; gap:4px; }
  .menu-button i { width:5px; height:5px; background:#fff; border-radius:50%; transition:transform .25s; }
  .menu-button:hover i:nth-child(1),.menu-button:hover i:nth-child(4) { transform:scale(.4); }

  .hero { position:relative; min-height:100svh; padding:100px 30px 22px; display:flex; flex-direction:column; justify-content:space-between; isolation:isolate; }
  .ambient-canvas { position:absolute; z-index:-1; inset:0; width:100%; height:100%; opacity:.9; }
  .hero-kicker { display:flex; justify-content:space-between; text-transform:uppercase; letter-spacing:.08em; font-size:10px; }
  .hero-stage { position:absolute; inset:105px 0 115px; }
  .orbit { position:absolute; border:1px solid rgba(16,16,16,.12); border-radius:50%; left:50%; top:48%; transform:translate(-50%,-50%); }
  .orbit-one { width:44vw; height:44vw; max-width:560px; max-height:560px; animation:orbitPulse 5s ease-in-out infinite; }
  .orbit-two { width:30vw; height:30vw; max-width:380px; max-height:380px; animation:orbitPulse 5s 1s ease-in-out infinite reverse; }
  @keyframes orbitPulse { 50%{transform:translate(-50%,-50%) scale(1.06);opacity:.45} }
  .hero-frame { position:absolute; margin:0; overflow:hidden; box-shadow:0 24px 70px rgba(0,0,0,.13); transition:transform .65s cubic-bezier(.16,1,.3,1),box-shadow .65s; perspective:1000px; }
  .hero-frame:hover { box-shadow:0 38px 90px rgba(0,0,0,.22); }
  .hero-frame img { height:100%; object-fit:cover; filter:saturate(.75); transition:transform .9s cubic-bezier(.16,1,.3,1),filter .5s; }
  .hero-frame:hover img { transform:scale(1.045); filter:saturate(1); }
  .hero-frame figcaption { position:absolute; bottom:8px; left:10px; font-size:9px; letter-spacing:.08em; background:rgba(242,240,233,.8); padding:4px 6px; }
  .frame-left { width:20vw; height:29vw; max-height:410px; left:22%; top:24%; transform:translate3d(calc(var(--pointer-px) * -1),calc((var(--pointer-py) * -1) - (var(--scroll-shift) * .35)),0) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) rotate(-8deg); z-index:1; }
  .frame-center { width:22vw; height:31vw; max-height:440px; left:40%; top:4%; transform:translate3d(calc(var(--pointer-px) * .4),calc((var(--pointer-py) * .55) - (var(--scroll-shift) * .7)),0) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) rotate(2deg); z-index:3; }
  .frame-right { width:18vw; height:25vw; max-height:350px; right:20%; top:29%; transform:translate3d(calc(var(--pointer-px) * .8),calc((var(--pointer-py) * -.3) - (var(--scroll-shift) * .18)),0) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) rotate(9deg); z-index:2; }
  .hero-sticker { position:absolute; z-index:5; width:102px; height:102px; border-radius:50%; background:var(--lime); left:61%; top:14%; display:flex; align-items:center; justify-content:center; gap:6px; animation:stickerFloat 3.2s ease-in-out infinite; }
  .hero-sticker span { font:700 23px 'Syne'; transform:rotate(-9deg); }
  .hero-sticker small { font-size:8px; text-transform:uppercase; line-height:1.1; }
  @keyframes stickerFloat { 50%{transform:translateY(-10px) rotate(4deg)} }
  .hero-bottom { position:relative; z-index:6; display:flex; align-items:flex-end; justify-content:space-between; }
  .hero h1 { margin:0; font:500 clamp(64px,8.8vw,148px)/.78 'Syne'; letter-spacing:-.09em; }
  .hero-line { display:block; overflow:hidden; padding-right:.08em; }
  .hero-line>span { display:block; transform:translateY(115%) rotate(3deg); transform-origin:left bottom; animation:lineRise 1.05s 1.48s forwards cubic-bezier(.16,1,.3,1); }
  .hero-line:nth-child(2)>span { animation-delay:1.62s; }
  @keyframes lineRise { to{transform:translateY(0) rotate(0)} }
  .hero h1 em,.section-head h2 i,.campaign-panel h2 em,.process-intro h2 em,.newsletter h2 em { font-family:Georgia,serif; font-weight:400; }
  .round-link { width:126px; height:126px; border-radius:50%; padding:22px; background:var(--ink); color:#fff; display:flex; flex-direction:column; justify-content:space-between; font-size:11px; text-transform:uppercase; transition:transform .45s cubic-bezier(.16,1,.3,1),background .35s,color .35s; animation:buttonBloom .8s 1.85s both cubic-bezier(.16,1,.3,1); }
  @keyframes buttonBloom { from{opacity:0;transform:translate3d(var(--mag-x),30px,0) scale(.72) rotate(-20deg)} }
  .round-link svg { width:26px; align-self:flex-end; }
  .round-link:hover { transform:translate3d(var(--mag-x),var(--mag-y),0) rotate(8deg); background:var(--lime); color:#000; }
  svg { fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
  .hero-enter { opacity:0; transform:translateY(34px); animation:heroIn .8s 1.45s forwards cubic-bezier(.16,1,.3,1); }
  .hero-bottom .hero-enter { animation-delay:1.6s; }
  @keyframes heroIn { to{opacity:1;transform:none} }

  .ticker { overflow:hidden; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:14px 0; background:var(--lime); transform:rotate(-1deg) scale(1.02) skewX(var(--ticker-skew)); transition:transform .18s ease-out; }
  .ticker-track { width:max-content; display:flex; align-items:center; gap:36px; font:600 15px 'Syne'; letter-spacing:.02em; animation:ticker 22s linear infinite; }
  .ticker-track b { font-size:18px; }
  @keyframes ticker { to{transform:translateX(-50%)} }
  .section-pad { padding:130px 30px; perspective:1600px; }
  .section-label { display:flex; gap:12px; align-items:center; font-size:10px; text-transform:uppercase; letter-spacing:.1em; }
  .section-label span { display:grid; place-items:center; width:28px; height:20px; border:1px solid currentColor; border-radius:50%; }
  .statement-grid { display:grid; grid-template-columns:4fr 1fr; gap:8vw; margin-top:90px; align-items:end; }
  .statement-copy { max-width:1100px; margin:0; font:400 clamp(38px,5.5vw,82px)/1.02 'Syne'; letter-spacing:-.055em; }
  .inline-chip { display:inline-block; font-family:Georgia,serif; font-style:italic; padding:2px 18px 8px; border-radius:999px; color:#fff; background:var(--ink); transform:rotate(-2deg); }
  .statement-note { display:flex; flex-direction:column; gap:44px; font-size:12px; line-height:1.5; }
  .rotating-mark { display:grid; place-items:center; width:96px; height:96px; border:1px solid var(--ink); border-radius:50%; text-align:center; font:700 13px/1 'Syne'; animation:spin 12s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }

  .collection { background:#e5e2da; }
  .section-head { display:grid; grid-template-columns:1fr 2fr 1fr; gap:30px; align-items:end; margin-bottom:80px; }
  .section-head h2,.rail-heading h2,.process-intro h2,.newsletter h2 { margin:0; font:500 clamp(58px,7.3vw,110px)/.86 'Syne'; letter-spacing:-.075em; }
  .section-head p { max-width:250px; font-size:13px; line-height:1.45; justify-self:end; }
  .collection-grid { display:grid; grid-template-columns:1.35fr .8fr .8fr; gap:22px; align-items:start; perspective:1500px; transform-style:preserve-3d; }
  .product-card { min-width:0; transform-style:preserve-3d; --card-y:0deg; }
  .product-card:nth-child(1) { --card-y:-2deg; }
  .product-card:nth-child(2) { --card-y:3deg; }
  .product-card:nth-child(3) { --card-y:-4deg; }
  .product-card.is-visible:hover { transform:translate3d(0,-12px,44px) rotateY(var(--card-y)); }
  .product-2 { margin-top:15vw; }
  .product-3 { margin-top:5vw; }
  .product-image { width:100%; padding:0; border:0; background:#ccc; position:relative; overflow:hidden; transform:perspective(1200px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)); }
  .product-image::after,.rail-card>button::after { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(circle at var(--shine-x) var(--shine-y),rgba(255,255,255,.26),transparent 36%); opacity:0; transition:opacity .35s; mix-blend-mode:soft-light; }
  .product-image:hover::after,.rail-card>button:hover::after { opacity:1; }
  .product-1 .product-image { aspect-ratio:1.04; }
  .product-2 .product-image,.product-3 .product-image { aspect-ratio:.76; }
  .product-image img { height:100%; object-fit:cover; transition:transform .7s cubic-bezier(.16,1,.3,1),filter .4s; filter:saturate(.75); }
  .product-image:hover img { transform:scale(1.045); filter:saturate(1); }
  .view-pill { position:absolute; right:14px; bottom:14px; background:var(--lime); border-radius:999px; padding:10px 13px; font-size:10px; text-transform:uppercase; display:flex; align-items:center; gap:8px; transform:translateY(70px); transition:transform .35s; }
  .view-pill svg { width:14px; }
  .product-image:hover .view-pill { transform:none; }
  .image-index { position:absolute; top:14px; left:14px; color:white; font-size:11px; }
  .product-info { display:flex; justify-content:space-between; gap:14px; padding-top:14px; }
  .product-info h3,.rail-card h3 { font-size:16px; font-weight:500; margin:0 0 5px; }
  .product-info p,.rail-card p { margin:0; font-size:10px; text-transform:uppercase; color:#5d5d59; }
  .product-info>span { font-size:13px; }
  .large-link { display:flex; align-items:center; justify-content:space-between; margin-top:90px; padding:22px 0 12px; border-bottom:2px solid var(--ink); font:500 clamp(34px,5vw,72px) 'Syne'; letter-spacing:-.05em; transform-style:preserve-3d; }
  .large-link.is-visible:hover { transform:translate3d(0,-6px,35px) rotateX(-2deg); }
  .large-link svg { width:54px; transition:transform .35s; }
  .large-link:hover svg { transform:translateX(10px); }

  .campaign { min-height:900px; display:grid; grid-template-columns:1.45fr 1fr; background:var(--ink); color:#fff; }
  .campaign-photo { position:relative; margin:30px 0 30px 30px; overflow:hidden; }
  .campaign-photo img { height:100%; object-fit:cover; filter:grayscale(1) contrast(1.08); transition:filter .6s,transform 1s; }
  .campaign-photo:hover img { filter:grayscale(0); transform:scale(1.02); }
  .campaign-caption { position:absolute; inset:auto 18px 16px; display:flex; justify-content:space-between; text-transform:uppercase; font-size:9px; letter-spacing:.1em; }
  .campaign-panel { padding:110px 7vw; display:flex; flex-direction:column; justify-content:center; }
  .campaign-panel h2 { font:500 clamp(62px,7.5vw,118px)/.83 'Syne'; letter-spacing:-.08em; margin:90px 0 50px; }
  .campaign-panel>p { font-size:17px; max-width:410px; line-height:1.45; color:#aaa; }
  .pill-button { align-self:flex-start; margin-top:35px; border:1px solid #777; background:transparent; color:#fff; border-radius:999px; padding:15px 20px; display:flex; gap:25px; align-items:center; text-transform:uppercase; font-size:10px; transition:background .3s,color .3s; }
  .pill-button svg { width:18px; }
  .pill-button:hover { background:var(--lime); color:#000; border-color:var(--lime); }

  .motion-lookbook { --look-progress:0; position:relative; height:340vh; background:#b9bec0; color:var(--ink); }
  .lookbook-sticky { position:sticky; top:0; height:100vh; min-height:700px; display:grid; grid-template-columns:.82fr 1.18fr; padding:28px; overflow:hidden; }
  .lookbook-sticky::before { content:'N/F—FIELD NOTES'; position:absolute; left:28px; bottom:20px; font:700 clamp(70px,12vw,190px)/.72 'Syne'; letter-spacing:-.09em; color:rgba(16,16,16,.07); white-space:nowrap; transform:translateX(calc(var(--look-progress) * -14vw)); }
  .lookbook-copy { position:relative; z-index:3; display:flex; flex-direction:column; padding:18px 5vw 42px 2px; }
  .lookbook-titles { position:relative; flex:1; display:flex; align-items:center; }
  .lookbook-title { position:absolute; inset:auto 0; opacity:0; transform:translateY(45px); pointer-events:none; transition:opacity .6s,transform .7s cubic-bezier(.16,1,.3,1); }
  .lookbook-title.is-active { opacity:1; transform:none; pointer-events:auto; }
  .lookbook-title small { display:block; margin-bottom:12px; text-transform:uppercase; font-size:10px; letter-spacing:.12em; }
  .lookbook-title h2 { margin:0; font:500 clamp(70px,10vw,150px)/.78 'Syne'; letter-spacing:-.09em; }
  .lookbook-title p { max-width:330px; margin:32px 0 0; font-size:14px; line-height:1.5; }
  .lookbook-progress { display:flex; gap:8px; }
  .lookbook-progress span { flex:1; height:3px; background:rgba(16,16,16,.18); position:relative; overflow:hidden; }
  .lookbook-progress span::after { content:''; position:absolute; inset:0; background:var(--ink); transform:scaleX(0); transform-origin:left; transition:transform .65s cubic-bezier(.16,1,.3,1); }
  .lookbook-progress span.is-active::after { transform:scaleX(1); }
  .lookbook-visual { position:relative; z-index:2; height:calc(100vh - 56px); min-height:644px; overflow:hidden; background:#8c9294; perspective:1300px; transform-style:preserve-3d; }
  .lookbook-frame { position:absolute; inset:0; margin:0; clip-path:inset(100% 0 0 0); transform:translateZ(-150px) scale(1.08) rotateY(16deg) rotate(calc((var(--frame-index) - 1) * 1.5deg)); transform-origin:left center; transition:clip-path .9s cubic-bezier(.76,0,.24,1),transform 1.2s cubic-bezier(.16,1,.3,1),filter .7s; }
  .lookbook-frame.is-active { clip-path:inset(0 0 0 0); transform:translateZ(0) scale(1) rotateY(0) rotate(0); z-index:2; }
  .lookbook-frame.is-past { clip-path:inset(0 0 100% 0); transform:translateZ(-120px) scale(.92) rotateY(-18deg); transform-origin:right center; z-index:3; }
  .lookbook-frame img { width:100%; height:100%; object-fit:cover; filter:grayscale(.85) contrast(1.06); transition:filter .8s,transform 1.8s cubic-bezier(.16,1,.3,1); }
  .lookbook-frame.is-active img { filter:grayscale(.05) contrast(1.02); transform:scale(1.025); }
  .lookbook-frame figcaption { position:absolute; z-index:2; left:16px; right:16px; bottom:14px; display:flex; justify-content:space-between; color:#fff; font-size:9px; text-transform:uppercase; letter-spacing:.1em; }
  .lookbook-crosshair { position:absolute; z-index:5; left:50%; top:50%; width:82px; height:82px; border:1px solid rgba(255,255,255,.55); border-radius:50%; transform:translate(-50%,-50%) rotate(calc(var(--look-progress) * 180deg)); pointer-events:none; }
  .lookbook-crosshair i { position:absolute; background:rgba(255,255,255,.55); }
  .lookbook-crosshair i:first-child { width:112px; height:1px; left:-15px; top:40px; }
  .lookbook-crosshair i:last-child { width:1px; height:112px; left:40px; top:-15px; }
  .lookbook-count { position:absolute; z-index:6; top:15px; right:15px; width:84px; height:84px; border-radius:50%; background:var(--lime); display:grid; place-items:center; }
  .lookbook-count strong { font:500 30px 'Syne'; letter-spacing:-.06em; }
  .lookbook-count span { position:absolute; bottom:9px; font-size:8px; }

  .showroom { position:relative; min-height:1100px; padding:105px 30px 45px; background:radial-gradient(circle at 50% 48%,#353535 0,#181818 45%,#0b0b0b 76%); color:#fff; overflow:hidden; perspective:1800px; }
  .showroom::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px); background-size:6vw 6vw; transform:perspective(700px) rotateX(62deg) scale(1.7) translateY(18%); transform-origin:center bottom; opacity:.48; }
  .showroom-head { display:grid; grid-template-columns:1fr 2fr 1fr; align-items:end; gap:30px; }
  .showroom-head h2 { margin:0; font:500 clamp(70px,8.4vw,132px)/.8 'Syne'; letter-spacing:-.09em; text-align:center; }
  .showroom-head h2 em { font-family:Georgia,serif; font-weight:400; }
  .showroom-head>p { max-width:240px; margin:0 0 10px auto; color:#9d9d9d; font-size:12px; line-height:1.5; }
  .showroom-stage { position:relative; height:690px; margin-top:20px; perspective:1500px; perspective-origin:50% 42%; touch-action:pan-y; user-select:none; cursor:grab; }
  .showroom-stage[data-dragging="true"] { cursor:grabbing; }
  .showroom-ring { position:absolute; left:50%; top:48%; width:min(25vw,350px); height:min(35vw,500px); transform-style:preserve-3d; transform:translate3d(-50%,-50%,0) rotateX(-7deg) rotateY(var(--ring-angle)); transition:transform .9s cubic-bezier(.16,1,.3,1); }
  .showroom-stage[data-dragging="true"] .showroom-ring { transition:none; }
  .showroom-card { position:absolute; inset:0; transform-style:preserve-3d; transform:rotateY(var(--card-angle)) translateZ(clamp(280px,32vw,500px)); backface-visibility:hidden; }
  .showroom-card button { position:absolute; inset:0; width:100%; padding:0; border:1px solid rgba(255,255,255,.28); background:#222; overflow:hidden; box-shadow:0 34px 80px rgba(0,0,0,.45); transform:translateZ(0); transition:transform .45s cubic-bezier(.16,1,.3,1),box-shadow .45s; }
  .showroom-card button:hover { transform:translateZ(28px) scale(1.025); box-shadow:0 45px 100px rgba(0,0,0,.6); }
  .showroom-card img { width:100%; height:100%; object-fit:cover; filter:saturate(.7) contrast(1.06); pointer-events:none; transition:filter .5s,transform .8s; }
  .showroom-card button:hover img { filter:saturate(1); transform:scale(1.035); }
  .showroom-card-meta { position:absolute; inset:auto 0 0; padding:55px 14px 14px; display:grid; grid-template-columns:1fr auto; gap:5px; color:#fff; text-align:left; background:linear-gradient(transparent,rgba(0,0,0,.86)); }
  .showroom-card-meta small { grid-column:1/-1; font-size:8px; letter-spacing:.12em; }
  .showroom-card-meta strong { font:500 15px 'Syne'; }
  .showroom-card-meta b { font-size:11px; font-weight:400; }
  .showroom-floor { position:absolute; left:50%; top:60%; width:850px; height:850px; border:1px solid rgba(255,255,255,.11); border-radius:50%; transform:translate(-50%,-50%) rotateX(72deg) translateZ(-220px); box-shadow:inset 0 0 100px rgba(223,255,69,.07); }
  .showroom-floor::before,.showroom-floor::after { content:''; position:absolute; border:1px solid rgba(255,255,255,.08); border-radius:50%; inset:16%; }
  .showroom-floor::after { inset:34%; }
  .showroom-axis { position:absolute; z-index:6; left:50%; top:48%; width:126px; height:126px; border:1px solid rgba(223,255,69,.6); border-radius:50%; transform:translate(-50%,-50%) translateZ(130px); display:grid; place-items:center; pointer-events:none; }
  .showroom-axis i { position:absolute; background:rgba(223,255,69,.6); }
  .showroom-axis i:first-child { width:170px; height:1px; }
  .showroom-axis i:nth-child(2) { width:1px; height:170px; }
  .showroom-axis span { display:grid; place-items:center; width:54px; height:54px; border-radius:50%; background:var(--lime); color:#000; font:700 12px 'Syne'; }
  .showroom-controls { display:flex; justify-content:center; align-items:center; gap:18px; }
  .showroom-controls button { width:48px; height:48px; border-radius:50%; border:1px solid #777; background:rgba(0,0,0,.2); color:#fff; }
  .showroom-controls button:hover { background:var(--lime); color:#000; border-color:var(--lime); }
  .showroom-controls span { font-size:9px; text-transform:uppercase; letter-spacing:.12em; }

  .rail-heading { display:flex; justify-content:space-between; align-items:end; margin-bottom:54px; }
  .rail-heading h2 { margin-top:45px; }
  .rail-controls { display:flex; gap:8px; }
  .rail-controls button { width:46px; height:46px; border-radius:50%; border:1px solid var(--ink); background:transparent; transition:background .25s,color .25s; }
  .rail-controls button:hover { background:var(--ink); color:#fff; }
  .product-rail { display:flex; gap:18px; overflow:auto; scrollbar-width:none; scroll-snap-type:x mandatory; padding-right:20vw; }
  .product-rail::-webkit-scrollbar { display:none; }
  .rail-card { flex:0 0 min(31vw,420px); scroll-snap-align:start; }
  .rail-card>button { width:100%; aspect-ratio:.78; padding:0; border:0; position:relative; overflow:hidden; background:#ddd; transform:perspective(1200px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)); }
  .rail-card img { height:100%; object-fit:cover; transition:transform .6s; }
  .rail-card>button:hover img { transform:scale(1.04); }
  .rail-card>button span { position:absolute; right:12px; bottom:12px; width:38px; height:38px; display:grid; place-items:center; background:var(--paper); border-radius:50%; font-size:20px; }
  .rail-card>div { display:flex; justify-content:space-between; align-items:start; padding-top:12px; }
  .rail-card>div p { font-size:13px; color:var(--ink); }

  .process { background:var(--lime); }
  .process-layout { display:grid; grid-template-columns:1fr 1.25fr; gap:10vw; margin-top:90px; }
  .process-intro { position:sticky; top:130px; align-self:start; }
  .process-intro p { max-width:390px; margin-top:35px; font-size:15px; line-height:1.5; }
  .process-list { border-top:1px solid rgba(0,0,0,.3); perspective:1100px; transform-style:preserve-3d; }
  .process-item { position:relative; display:grid; grid-template-columns:50px 1fr 1.5fr 28px; gap:16px; padding:32px 0 58px; border-bottom:1px solid rgba(0,0,0,.3); }
  .process-item>span { font-size:10px; }
  .process-item h3 { margin:0; font:500 25px 'Syne'; }
  .process-item p { margin:0; font-size:12px; line-height:1.5; max-width:300px; }
  .process-item svg { width:22px; transition:transform .3s; }
  .process-item:hover svg { transform:rotate(45deg); }
  .process-item.is-visible:hover { transform:translate3d(12px,-4px,32px) rotateY(-2deg); }

  .quote-block { min-height:92vh; background:var(--ink); color:#fff; padding:90px 30px 28px; display:flex; flex-direction:column; justify-content:space-between; }
  .quote-block>p { max-width:1200px; margin:0; font:400 clamp(56px,8.6vw,132px)/.92 'Syne'; letter-spacing:-.07em; }
  .quote-meta { display:flex; justify-content:space-between; border-top:1px solid #555; padding-top:14px; font-size:10px; text-transform:uppercase; letter-spacing:.08em; }
  .newsletter { position:relative; min-height:760px; display:flex; flex-direction:column; justify-content:space-between; }
  .newsletter h2 { margin:90px 0; max-width:1000px; }
  .newsletter-orb { position:absolute; right:11vw; top:16%; width:150px; height:150px; display:grid; place-items:center; border-radius:50%; background:#c8c6bd; font:600 52px 'Syne'; animation:stickerFloat 4s ease-in-out infinite; }
  .newsletter-form { width:min(720px,70vw); align-self:flex-end; }
  .newsletter-form label { font-size:10px; text-transform:uppercase; }
  .newsletter-form>div { display:flex; border-bottom:2px solid var(--ink); }
  .newsletter-form input { flex:1; min-width:0; border:0; background:transparent; padding:18px 0; outline:none; font:400 24px 'Syne'; }
  .newsletter-form button { width:60px; border:0; background:transparent; }
  .newsletter-form svg { width:30px; }

  footer { position:relative; z-index:8; background:var(--ink); color:#fff; padding:55px 30px 22px; perspective:1400px; }
  .footer-brand { font:700 clamp(90px,17vw,270px)/.67 'Syne'; letter-spacing:-.1em; transform:rotateX(9deg) translateZ(35px); transform-origin:center bottom; transition:transform .8s cubic-bezier(.16,1,.3,1); }
  .footer-brand:hover { transform:rotateX(0) translateZ(80px); }
  .footer-grid { margin:100px 0 65px; display:grid; grid-template-columns:repeat(3,1fr); width:55%; margin-left:auto; }
  .footer-grid div { display:flex; flex-direction:column; gap:8px; }
  .footer-grid span { color:#777; font-size:9px; text-transform:uppercase; margin-bottom:12px; }
  .footer-grid a { font-size:13px; width:max-content; }
  .footer-grid a:hover { color:var(--lime); }
  .footer-base { display:flex; justify-content:space-between; padding-top:15px; border-top:1px solid #444; font-size:9px; text-transform:uppercase; letter-spacing:.08em; }

  .menu-overlay { position:fixed; inset:0; z-index:300; background:var(--lime); padding:25px 30px; display:flex; flex-direction:column; transform:translateY(-105%); visibility:hidden; transition:transform .75s cubic-bezier(.76,0,.24,1),visibility .75s; }
  .menu-overlay.is-open { transform:none; visibility:visible; }
  .overlay-head,.overlay-foot { display:flex; justify-content:space-between; font-size:11px; text-transform:uppercase; }
  .overlay-head>span { font:700 24px 'Syne'; letter-spacing:-.07em; }
  .overlay-head button { border:0; background:transparent; text-transform:uppercase; }
  .menu-overlay nav { margin:auto 0; display:flex; flex-direction:column; }
  .menu-overlay nav a { display:grid; grid-template-columns:70px 1fr 70px; align-items:center; border-bottom:1px solid rgba(0,0,0,.25); font:500 clamp(55px,8vw,120px)/1 'Syne'; letter-spacing:-.07em; padding:8px 0; }
  .menu-overlay nav a>span { font:400 10px 'DM Sans'; letter-spacing:0; }
  .menu-overlay nav a svg { width:45px; justify-self:end; transition:transform .35s; }
  .menu-overlay nav a:hover svg { transform:rotate(45deg); }

  .backdrop { position:fixed; inset:0; z-index:210; border:0; background:rgba(0,0,0,.55); backdrop-filter:blur(5px); }
  .cart-drawer { position:fixed; z-index:230; right:0; top:0; bottom:0; width:min(480px,100%); background:var(--paper); transform:translateX(105%); visibility:hidden; transition:transform .6s cubic-bezier(.76,0,.24,1),visibility .6s; display:flex; flex-direction:column; }
  .cart-drawer.is-open { transform:none; visibility:visible; }
  .cart-head { display:flex; align-items:center; justify-content:space-between; padding:24px; border-bottom:1px solid var(--line); }
  .cart-head h2 { margin:0; font:500 28px 'Syne'; }
  .cart-head button,.quick-close { width:42px; height:42px; border-radius:50%; border:1px solid var(--ink); background:transparent; font-size:22px; }
  .cart-content { flex:1; overflow:auto; padding:22px; }
  .empty-cart { height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; }
  .empty-cart>span { font:500 130px/1 'Syne'; color:#d4d1c9; }
  .empty-cart p { font:400 20px/1.3 'Syne'; }
  .empty-cart button { border:0; border-bottom:1px solid; background:transparent; padding:6px 0; font-size:11px; text-transform:uppercase; }
  .cart-item { display:grid; grid-template-columns:125px 1fr; gap:18px; padding-bottom:20px; margin-bottom:20px; border-bottom:1px solid var(--line); }
  .cart-item img { height:155px; object-fit:cover; }
  .cart-item h3 { margin:4px 0; font:500 17px 'Syne'; }
  .cart-item p { margin:0 0 22px; font-size:11px; }
  .cart-item strong { display:block; font-size:13px; }
  .cart-item button { border:0; background:transparent; text-decoration:underline; padding:12px 0 0; font-size:10px; }
  .cart-checkout { padding:22px; border-top:1px solid var(--line); }
  .cart-checkout>div { display:flex; justify-content:space-between; margin-bottom:16px; }
  .cart-checkout>button,.add-button { width:100%; border:0; background:var(--ink); color:#fff; padding:17px 18px; display:flex; justify-content:space-between; text-transform:uppercase; font-size:11px; }
  .cart-checkout svg,.add-button svg { width:19px; }

  .quick-view { position:fixed; z-index:240; left:50%; top:50%; width:min(900px,90vw); max-height:90vh; transform:translate(-50%,-50%); background:var(--paper); display:grid; grid-template-columns:1fr 1fr; overflow:auto; animation:quickIn .45s cubic-bezier(.16,1,.3,1); }
  @keyframes quickIn { from{opacity:0;transform:translate(-50%,-46%) scale(.96)} }
  .quick-close { position:absolute; z-index:2; right:16px; top:16px; background:var(--paper); }
  .quick-image { position:relative; min-height:600px; }
  .quick-image img { height:100%; object-fit:cover; }
  .quick-image>span { position:absolute; left:14px; bottom:14px; padding:7px 9px; background:var(--lime); font-size:9px; text-transform:uppercase; }
  .quick-details { padding:70px 45px 35px; display:flex; flex-direction:column; }
  .quick-details>p { font-size:10px; text-transform:uppercase; }
  .quick-details h2 { font:500 46px/.95 'Syne'; letter-spacing:-.05em; margin:28px 0 14px; }
  .quick-details>strong { font-size:16px; font-weight:400; }
  .size-row { margin:auto 0 24px; }
  .size-row>span { display:block; font-size:10px; text-transform:uppercase; margin-bottom:10px; }
  .size-row>div { display:flex; }
  .size-row button { flex:1; height:44px; border:1px solid var(--line); background:transparent; margin-right:-1px; font-size:11px; }
  .size-row button.active { background:var(--ink); color:#fff; }
  .quick-details small { text-align:center; margin-top:13px; font-size:9px; color:#777; }
  .toast { position:fixed; z-index:400; left:50%; bottom:24px; transform:translate(-50%,100px); opacity:0; background:var(--ink); color:#fff; border-radius:999px; padding:14px 20px; display:flex; align-items:center; gap:10px; font-size:11px; transition:transform .4s,opacity .4s; }
  .toast.show { transform:translate(-50%,0); opacity:1; }
  .toast span { color:var(--lime); }
  .reveal { opacity:0; transform:translate3d(0,55px,-110px) rotateX(8deg); transform-origin:center bottom; transition:opacity .9s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1); }
  .reveal.is-visible { opacity:1; transform:none; }

  @media (max-width:900px) {
    body { cursor:auto; }
    button { cursor:pointer; }
    .cursor { display:none; }
    .three-world { opacity:.52; mask-image:radial-gradient(circle at 50% 46%,#000 0 28%,rgba(0,0,0,.86) 48%,transparent 74%); }
    .three-hud { top:82px; }
    .site-header { grid-template-columns:1fr auto; }
    .desktop-nav { display:none; }
    .hero { padding:92px 18px 18px; min-height:900px; }
    .hero-kicker span:last-child { display:none; }
    .hero-stage { inset:130px 0 270px; }
    .frame-left { width:38vw;height:55vw;left:5%;top:25%; }
    .frame-center { width:45vw;height:64vw;left:28%;top:2%; }
    .frame-right { width:34vw;height:48vw;right:2%;top:38%; }
    .hero-sticker { left:auto;right:10%;top:10%;width:78px;height:78px; }
    .hero h1 { font-size:15vw; line-height:.82; }
    .round-link { width:94px;height:94px;padding:16px;font-size:8px; }
    .section-pad { padding:90px 18px; }
    .statement-grid { grid-template-columns:1fr; margin-top:60px; }
    .statement-note { flex-direction:row; align-items:center; }
    .section-head { grid-template-columns:1fr; }
    .section-head p { justify-self:start; }
    .collection-grid { grid-template-columns:1fr 1fr; }
    .product-1 { grid-column:span 2; }
    .product-2 { margin-top:12vw; }
    .product-3 { margin-top:0; }
    .campaign { grid-template-columns:1fr; }
    .campaign-photo { height:70vh; margin:18px; }
    .campaign-panel { padding:90px 18px; }
    .campaign-panel h2 { margin:65px 0 35px; }
    .motion-lookbook { height:300vh; }
    .lookbook-sticky { display:block; padding:12px; min-height:100svh; }
    .lookbook-copy { position:absolute; z-index:7; inset:0; padding:24px 24px 30px; color:#fff; pointer-events:none; }
    .lookbook-copy>.section-label { mix-blend-mode:difference; }
    .lookbook-titles { align-items:flex-end; padding-bottom:55px; }
    .lookbook-title { bottom:55px; }
    .lookbook-title h2 { font-size:18vw; }
    .lookbook-title p { max-width:270px; margin-top:18px; font-size:12px; }
    .lookbook-progress { position:absolute; left:24px; right:24px; bottom:25px; }
    .lookbook-progress span { background:rgba(255,255,255,.3); }
    .lookbook-progress span::after { background:#fff; }
    .lookbook-visual { width:100%; height:calc(100vh - 24px); min-height:0; }
    .lookbook-sticky::before { display:none; }
    .lookbook-count { width:68px; height:68px; }
    .showroom { min-height:950px; padding:90px 18px 35px; }
    .showroom-head { grid-template-columns:1fr; text-align:left; }
    .showroom-head h2 { text-align:left; font-size:14vw; }
    .showroom-head>p { margin:0; }
    .showroom-stage { height:590px; margin-top:5px; perspective:1000px; }
    .showroom-ring { width:44vw; height:62vw; }
    .showroom-card { transform:rotateY(var(--card-angle)) translateZ(38vw); }
    .showroom-floor { width:580px; height:580px; }
    .rail-card { flex-basis:65vw; }
    .process-layout { grid-template-columns:1fr; }
    .process-intro { position:static; }
    .newsletter-orb { width:95px;height:95px;font-size:34px;right:8vw; }
    .footer-grid { width:100%; }
    .quick-view { grid-template-columns:1fr; width:92vw; max-height:90vh; }
    .quick-image { min-height:43vh; }
    .quick-details { padding:34px 22px 24px; }
    .size-row { margin:35px 0 20px; }
  }
  @media (max-width:560px) {
    .site-header { left:8px;right:8px;top:8px; }
    .brand { font-size:20px; }
    .text-button { font-size:10px; }
    .hero { min-height:790px; }
    .hero-stage { inset:140px 0 285px; }
    .frame-left { width:47vw;height:68vw;left:-5%; }
    .frame-center { width:53vw;height:77vw;left:24%; }
    .frame-right { width:42vw;height:57vw;right:-7%;top:45%; }
    .hero-sticker { right:3%; }
    .hero-bottom { align-items:flex-end; }
    .hero h1 { font-size:16.5vw; }
    .round-link { width:80px;height:80px; }
    .round-link svg { width:18px; }
    .statement-copy { font-size:38px; }
    .inline-chip { padding:0 10px 5px; }
    .section-head h2,.rail-heading h2,.process-intro h2,.newsletter h2 { font-size:55px; }
    .collection-grid { gap:10px; }
    .product-info { display:block; }
    .product-info>span { display:block;margin-top:8px; }
    .campaign { min-height:0; }
    .campaign-photo { height:60vh; }
    .campaign-panel h2 { font-size:65px; }
    .lookbook-title h2 { font-size:20vw; }
    .lookbook-title p { max-width:235px; }
    .lookbook-crosshair { width:60px; height:60px; }
    .lookbook-crosshair i:first-child { width:82px; left:-11px; top:29px; }
    .lookbook-crosshair i:last-child { height:82px; left:29px; top:-11px; }
    .showroom { min-height:900px; }
    .showroom-head h2 { font-size:17vw; }
    .showroom-stage { height:560px; }
    .showroom-ring { width:58vw; height:78vw; }
    .showroom-card { transform:rotateY(var(--card-angle)) translateZ(52vw); }
    .showroom-axis { width:86px; height:86px; }
    .showroom-axis i:first-child { width:118px; }
    .showroom-axis i:nth-child(2) { height:118px; }
    .showroom-controls span { font-size:8px; }
    .rail-heading { align-items:center; }
    .rail-controls { display:none; }
    .rail-card { flex-basis:78vw; }
    .process-item { grid-template-columns:32px 1fr 24px; padding-bottom:35px; }
    .process-item p { grid-column:2/3; }
    .process-item svg { grid-column:3;grid-row:1; }
    .quote-block { min-height:75vh;padding:70px 18px 22px; }
    .quote-block>p { font-size:53px; }
    .newsletter { min-height:650px; }
    .newsletter-form { width:100%; }
    .newsletter-form input { font-size:18px; }
    .newsletter-orb { top:12%; }
    footer { padding:45px 18px 18px; }
    .footer-brand { font-size:25vw; }
    .footer-grid { grid-template-columns:1fr 1fr; gap:40px; margin:70px 0; }
    .footer-base span:nth-child(2) { display:none; }
    .menu-overlay { padding:20px 18px; }
    .menu-overlay nav a { grid-template-columns:35px 1fr 32px; font-size:15vw; }
    .menu-overlay nav a svg { width:27px; }
    .overlay-foot span:last-child { display:none; }
    .quick-details h2 { font-size:35px; }
  }
  @media (prefers-reduced-motion:reduce) {
    html { scroll-behavior:auto; }
    *,*::before,*::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
    .reveal { opacity:1;transform:none; }
    .three-world { opacity:.38; }
  }
`;

export default App;
