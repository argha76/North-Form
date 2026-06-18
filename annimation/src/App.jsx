import React, { useEffect, useRef, useState } from "react";

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

const Arrow = ({ diagonal = false }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={diagonal ? "M5 19 19 5M8 5h11v11" : "M5 12h14M14 7l5 5-5 5"} />
  </svg>
);

function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState("");
  const [email, setEmail] = useState("");
  const cursorRef = useRef(null);
  const productRailRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        document.documentElement.style.setProperty("--scroll-shift", `${Math.min(y * 0.12, 115)}px`);
        document.documentElement.style.setProperty("--page-progress", `${(y / max) * 100}%`);
        setScrolled(y > 40);
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
    const onMove = (event) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

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

  return (
    <div className="site-shell">
      <style>{styles}</style>

      <div className={`loader ${loading ? "is-loading" : "is-done"}`} aria-hidden={!loading}>
        <div className="loader-mark">N/F</div>
        <div className="loader-line"><span /></div>
        <div className="loader-meta"><span>Independent uniform</span><span>Est. 2026</span></div>
      </div>

      <div className="cursor" ref={cursorRef} aria-hidden="true"><span /></div>
      <div className="progress-line" aria-hidden="true" />

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="North Form home">NØRTH/FORM</a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#shop">Shop</a>
          <a href="#campaign">Campaign</a>
          <a href="#about">About</a>
        </nav>
        <div className="header-actions">
          <button className="text-button" onClick={() => setCartOpen(true)}>
            Bag <span>[{String(cart.length).padStart(2, "0")}]</span>
          </button>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <i /><i /><i /><i />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-kicker hero-enter">
            <span>Drop 04 / Reconstructed essentials</span>
            <span>London — Everywhere</span>
          </div>

          <div className="hero-stage" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <figure className="hero-frame frame-left">
              <img src={editorialImages[0].src} alt="" />
              <figcaption>LOOK 04—A</figcaption>
            </figure>
            <figure className="hero-frame frame-center">
              <img src={editorialImages[1].src} alt="" />
              <figcaption>THE NEW UNIFORM</figcaption>
            </figure>
            <figure className="hero-frame frame-right">
              <img src={editorialImages[2].src} alt="" />
              <figcaption>OBJECT / FORM</figcaption>
            </figure>
            <div className="hero-sticker">
              <span>NEW</span>
              <small>Edition<br />04</small>
            </div>
          </div>

          <div className="hero-bottom">
            <h1 id="hero-title" className="hero-enter">Clothes for<br /><em>after now.</em></h1>
            <a className="round-link hero-enter" href="#shop" aria-label="Explore collection">
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
                <button className="product-image" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name}`}>
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
          <div className="campaign-photo reveal">
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
            <button className="pill-button reveal" onClick={() => showToast("Campaign film coming soon")}>Watch the film <Arrow /></button>
          </div>
        </section>

        <section className="all-pieces section-pad" id="all-pieces">
          <div className="rail-heading reveal">
            <div>
              <div className="section-label"><span>04</span> Objects to wear</div>
              <h2>Edition / 04</h2>
            </div>
            <div className="rail-controls">
              <button onClick={() => scrollProducts(-1)} aria-label="Previous products">←</button>
              <button onClick={() => scrollProducts(1)} aria-label="Next products">→</button>
            </div>
          </div>
          <div className="product-rail reveal" ref={productRailRef}>
            {[...products, ...products.slice(0, 2)].map((product, index) => (
              <article className="rail-card" key={`${product.id}-${index}`}>
                <button onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name}`}>
                  <img src={product.image} alt={product.alt} />
                  <span>+</span>
                </button>
                <div><h3>{product.name}</h3><p>£{product.price}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="process section-pad">
          <div className="section-label reveal"><span>05</span> How it is made</div>
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
          <div className="section-label reveal"><span>06</span> Keep in contact</div>
          <h2 className="reveal">The next thing<br />arrives <em>quietly.</em></h2>
          <form className="newsletter-form reveal" onSubmit={submitNewsletter}>
            <label htmlFor="email">Email address</label>
            <div>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@somewhere.com" required />
              <button type="submit" aria-label="Join newsletter"><Arrow /></button>
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

  :root { --ink:#101010; --paper:#f2f0e9; --lime:#dfff45; --soft:#dad8d0; --line:rgba(16,16,16,.18); --page-progress:0%; --scroll-shift:0px; }
  * { box-sizing:border-box; }
  html { scroll-behavior:smooth; background:var(--paper); }
  body { margin:0; background:var(--paper); color:var(--ink); font-family:'DM Sans',sans-serif; cursor:none; }
  button, input { font:inherit; }
  button, a { color:inherit; }
  button { cursor:none; }
  a { text-decoration:none; }
  img { display:block; width:100%; }
  ::selection { background:var(--lime); color:#000; }
  .site-shell { overflow:hidden; }
  .progress-line { position:fixed; z-index:98; top:0; left:0; width:var(--page-progress); height:3px; background:var(--lime); pointer-events:none; }
  .cursor { position:fixed; z-index:200; left:-18px; top:-18px; width:36px; height:36px; border:1px solid rgba(16,16,16,.55); border-radius:50%; pointer-events:none; transition:width .25s,height .25s,background .25s,border .25s; mix-blend-mode:difference; }
  .cursor span { position:absolute; width:4px; height:4px; background:#fff; border-radius:50%; top:15px; left:15px; }
  body:has(a:hover,button:hover) .cursor { width:58px; height:58px; left:-29px; top:-29px; background:#fff; border-color:#fff; }
  .loader { position:fixed; inset:0; z-index:500; padding:26px 30px; background:var(--lime); display:flex; flex-direction:column; justify-content:space-between; transition:transform .85s cubic-bezier(.76,0,.24,1),visibility .85s; }
  .loader.is-done { transform:translateY(-105%); visibility:hidden; transition-delay:.05s; }
  .loader-mark { font:700 clamp(58px,12vw,180px)/.8 'Syne'; letter-spacing:-.1em; }
  .loader-line { height:1px; background:rgba(0,0,0,.25); overflow:hidden; }
  .loader-line span { display:block; width:100%; height:100%; background:#000; transform-origin:left; animation:loadLine 1.25s cubic-bezier(.76,0,.24,1); }
  .loader-meta { display:flex; justify-content:space-between; text-transform:uppercase; font-size:11px; letter-spacing:.08em; }
  @keyframes loadLine { from{transform:scaleX(0)} to{transform:scaleX(1)} }

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

  .hero { position:relative; min-height:100svh; padding:100px 30px 22px; display:flex; flex-direction:column; justify-content:space-between; }
  .hero-kicker { display:flex; justify-content:space-between; text-transform:uppercase; letter-spacing:.08em; font-size:10px; }
  .hero-stage { position:absolute; inset:105px 0 115px; }
  .orbit { position:absolute; border:1px solid rgba(16,16,16,.12); border-radius:50%; left:50%; top:48%; transform:translate(-50%,-50%); }
  .orbit-one { width:44vw; height:44vw; max-width:560px; max-height:560px; animation:orbitPulse 5s ease-in-out infinite; }
  .orbit-two { width:30vw; height:30vw; max-width:380px; max-height:380px; animation:orbitPulse 5s 1s ease-in-out infinite reverse; }
  @keyframes orbitPulse { 50%{transform:translate(-50%,-50%) scale(1.06);opacity:.45} }
  .hero-frame { position:absolute; margin:0; overflow:hidden; box-shadow:0 24px 70px rgba(0,0,0,.13); transition:transform .8s cubic-bezier(.16,1,.3,1); }
  .hero-frame img { height:100%; object-fit:cover; filter:saturate(.75); transition:transform .9s cubic-bezier(.16,1,.3,1),filter .5s; }
  .hero-frame:hover img { transform:scale(1.045); filter:saturate(1); }
  .hero-frame figcaption { position:absolute; bottom:8px; left:10px; font-size:9px; letter-spacing:.08em; background:rgba(242,240,233,.8); padding:4px 6px; }
  .frame-left { width:20vw; height:29vw; max-height:410px; left:22%; top:24%; transform:translateY(calc(var(--scroll-shift) * -.35)) rotate(-8deg); z-index:1; }
  .frame-center { width:22vw; height:31vw; max-height:440px; left:40%; top:4%; transform:translateY(calc(var(--scroll-shift) * -.7)) rotate(2deg); z-index:3; }
  .frame-right { width:18vw; height:25vw; max-height:350px; right:20%; top:29%; transform:translateY(calc(var(--scroll-shift) * -.18)) rotate(9deg); z-index:2; }
  .hero-sticker { position:absolute; z-index:5; width:102px; height:102px; border-radius:50%; background:var(--lime); left:61%; top:14%; display:flex; align-items:center; justify-content:center; gap:6px; animation:stickerFloat 3.2s ease-in-out infinite; }
  .hero-sticker span { font:700 23px 'Syne'; transform:rotate(-9deg); }
  .hero-sticker small { font-size:8px; text-transform:uppercase; line-height:1.1; }
  @keyframes stickerFloat { 50%{transform:translateY(-10px) rotate(4deg)} }
  .hero-bottom { position:relative; z-index:6; display:flex; align-items:flex-end; justify-content:space-between; }
  .hero h1 { margin:0; font:500 clamp(64px,8.8vw,148px)/.78 'Syne'; letter-spacing:-.09em; }
  .hero h1 em,.section-head h2 i,.campaign-panel h2 em,.process-intro h2 em,.newsletter h2 em { font-family:Georgia,serif; font-weight:400; }
  .round-link { width:126px; height:126px; border-radius:50%; padding:22px; background:var(--ink); color:#fff; display:flex; flex-direction:column; justify-content:space-between; font-size:11px; text-transform:uppercase; transition:transform .35s,background .35s,color .35s; }
  .round-link svg { width:26px; align-self:flex-end; }
  .round-link:hover { transform:rotate(8deg); background:var(--lime); color:#000; }
  svg { fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
  .hero-enter { opacity:0; transform:translateY(34px); animation:heroIn .8s 1.45s forwards cubic-bezier(.16,1,.3,1); }
  .hero-bottom .hero-enter { animation-delay:1.6s; }
  @keyframes heroIn { to{opacity:1;transform:none} }

  .ticker { overflow:hidden; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:14px 0; background:var(--lime); transform:rotate(-1deg) scale(1.02); }
  .ticker-track { width:max-content; display:flex; align-items:center; gap:36px; font:600 15px 'Syne'; letter-spacing:.02em; animation:ticker 22s linear infinite; }
  .ticker-track b { font-size:18px; }
  @keyframes ticker { to{transform:translateX(-50%)} }
  .section-pad { padding:130px 30px; }
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
  .collection-grid { display:grid; grid-template-columns:1.35fr .8fr .8fr; gap:22px; align-items:start; }
  .product-card { min-width:0; }
  .product-2 { margin-top:15vw; }
  .product-3 { margin-top:5vw; }
  .product-image { width:100%; padding:0; border:0; background:#ccc; position:relative; overflow:hidden; }
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
  .large-link { display:flex; align-items:center; justify-content:space-between; margin-top:90px; padding:22px 0 12px; border-bottom:2px solid var(--ink); font:500 clamp(34px,5vw,72px) 'Syne'; letter-spacing:-.05em; }
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

  .rail-heading { display:flex; justify-content:space-between; align-items:end; margin-bottom:54px; }
  .rail-heading h2 { margin-top:45px; }
  .rail-controls { display:flex; gap:8px; }
  .rail-controls button { width:46px; height:46px; border-radius:50%; border:1px solid var(--ink); background:transparent; transition:background .25s,color .25s; }
  .rail-controls button:hover { background:var(--ink); color:#fff; }
  .product-rail { display:flex; gap:18px; overflow:auto; scrollbar-width:none; scroll-snap-type:x mandatory; padding-right:20vw; }
  .product-rail::-webkit-scrollbar { display:none; }
  .rail-card { flex:0 0 min(31vw,420px); scroll-snap-align:start; }
  .rail-card>button { width:100%; aspect-ratio:.78; padding:0; border:0; position:relative; overflow:hidden; background:#ddd; }
  .rail-card img { height:100%; object-fit:cover; transition:transform .6s; }
  .rail-card>button:hover img { transform:scale(1.04); }
  .rail-card>button span { position:absolute; right:12px; bottom:12px; width:38px; height:38px; display:grid; place-items:center; background:var(--paper); border-radius:50%; font-size:20px; }
  .rail-card>div { display:flex; justify-content:space-between; align-items:start; padding-top:12px; }
  .rail-card>div p { font-size:13px; color:var(--ink); }

  .process { background:var(--lime); }
  .process-layout { display:grid; grid-template-columns:1fr 1.25fr; gap:10vw; margin-top:90px; }
  .process-intro { position:sticky; top:130px; align-self:start; }
  .process-intro p { max-width:390px; margin-top:35px; font-size:15px; line-height:1.5; }
  .process-list { border-top:1px solid rgba(0,0,0,.3); }
  .process-item { position:relative; display:grid; grid-template-columns:50px 1fr 1.5fr 28px; gap:16px; padding:32px 0 58px; border-bottom:1px solid rgba(0,0,0,.3); }
  .process-item>span { font-size:10px; }
  .process-item h3 { margin:0; font:500 25px 'Syne'; }
  .process-item p { margin:0; font-size:12px; line-height:1.5; max-width:300px; }
  .process-item svg { width:22px; transition:transform .3s; }
  .process-item:hover svg { transform:rotate(45deg); }

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

  footer { background:var(--ink); color:#fff; padding:55px 30px 22px; }
  .footer-brand { font:700 clamp(90px,17vw,270px)/.67 'Syne'; letter-spacing:-.1em; }
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
  .reveal { opacity:0; transform:translateY(40px); transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1); }
  .reveal.is-visible { opacity:1; transform:none; }

  @media (max-width:900px) {
    body { cursor:auto; }
    button { cursor:pointer; }
    .cursor { display:none; }
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
  }
`;

export default App;
