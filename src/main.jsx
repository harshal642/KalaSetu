import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const demoMarkets = [
  {
    id: 1,
    name: "Maharashtra Handicraft Expo",
    type: "Exhibition",
    location: "Pune, Maharashtra",
    categories: ["Warli", "Tribal Art", "Wall Art"],
    min: 500,
    max: 3000,
    season: "Sep–Nov",
    score: 92,
    reason: [
      "Category/craft match",
      "Maharashtra location fit",
      "Price band fits",
      "Handmade wall art accepted"
    ]
  },
  {
    id: 2,
    name: "Heritage Home Boutique",
    type: "Boutique",
    location: "Mumbai, Maharashtra",
    categories: ["Wall Art", "Home Decor", "Handmade"],
    min: 700,
    max: 2500,
    season: "Year-round",
    score: 87,
    reason: [
      "Use-case fit: home decor",
      "Location fit",
      "Price band fits"
    ]
  },
  {
    id: 3,
    name: "IndieCraft Gift Collective",
    type: "Gift Shop",
    location: "Nashik, Maharashtra",
    categories: ["Handmade", "Tribal Art", "Gifts"],
    min: 300,
    max: 1800,
    season: "Year-round",
    score: 81,
    reason: [
      "Craft/category fit",
      "Small-batch products accepted",
      "Price band fits"
    ]
  },
  {
    id: 4,
    name: "Deccan Tourism Craft Fair",
    type: "Tourism Market",
    location: "Aurangabad, Maharashtra",
    categories: ["Tribal Art", "Souvenir", "Handicraft"],
    min: 200,
    max: 1500,
    season: "Oct–Jan",
    score: 76,
    reason: [
      "Tourism use-case fit",
      "Regional craft fit"
    ]
  }
];

const products = [
  {
    id: 1,
    title: "Traditional Warli Wall Painting",
    category: "Tribal Art / Wall Art",
    craft: "Warli",
    material: "Natural pigments on handmade canvas",
    price: 850,
    image: "🎨",
    status: "Published",
    tags: [
      "Warli",
      "tribal art",
      "handmade",
      "Maharashtra",
      "wall decor"
    ]
  },
  {
    id: 2,
    title: "Handwoven Bamboo Basket",
    category: "Bamboo Craft",
    craft: "Bamboo Weaving",
    material: "Bamboo",
    price: 650,
    image: "🧺",
    status: "Published",
    tags: [
      "bamboo",
      "handmade",
      "eco-friendly"
    ]
  },
  {
    id: 3,
    title: "Handcrafted Terracotta Pot",
    category: "Pottery",
    craft: "Terracotta",
    material: "Natural clay",
    price: 480,
    image: "🏺",
    status: "Draft",
    tags: [
      "pottery",
      "terracotta",
      "home decor"
    ]
  }
];

function App() {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem("shilpsetu_profile");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [screen, setScreen] = useState(() => {
    try {
      return localStorage.getItem("shilpsetu_profile") ? "dashboard" : "onboarding";
    } catch {
      return "onboarding";
    }
  });

  const [product, setProduct] = useState(products[0]);

  const [photo, setPhoto] = useState(null);

  const [analyzing, setAnalyzing] = useState(false);

  const [toast, setToast] = useState("");

  const [saved, setSaved] = useState([]);

  const [enquired, setEnquired] = useState([]);

  const [costs, setCosts] = useState({
    material: 300,
    labor: 200,
    other: 50
  });

  const [language, setLanguage] = useState(() => profile?.language || "English");

  const base =
    Number(costs.material || 0) +
    Number(costs.labor || 0) +
    Number(costs.other || 0);

  const priceMin =
    Math.round((base * 1.25) / 50) * 50;

  const priceMax =
    Math.round((base * 1.55) / 50) * 50;

  const notify = (msg) => {
    setToast(msg);

    setTimeout(() => {
      setToast("");
    }, 2600);
  };

  const saveProfile = (profileData) => {
    localStorage.setItem("shilpsetu_profile", JSON.stringify(profileData));
    setProfile(profileData);
    setLanguage(profileData.language || "English");
    setScreen("dashboard");
    notify(`Welcome, ${profileData.name}`);
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setPhoto(imageUrl);

    setProduct((p) => ({
      ...p,
      image: imageUrl
    }));
  };

  const runAnalysis = () => {
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);

      setProduct({
        id: 99,
        title: "Traditional Warli Wall Painting",
        category: "Tribal Art / Wall Art",
        craft: "Warli",
        material: "Not specified — confirm with artisan",
        price: 850,
        image: photo || "🎨",
        status: "AI Draft",
        tags: [
          "Warli",
          "tribal art",
          "handmade",
          "Maharashtra",
          "wall decor"
        ],
        confidence: { title: 96, category: 94, craft: 98, material: 42, description: 91, tags: 93 }
      });

      setScreen("review");
    }, 1400);
  };

  const publish = () => {
    setProduct((p) => ({
      ...p,
      status: "Published",
      price:
        Number(p.price) ||
        priceMin ||
        850
    }));

    notify("Product approved and published");

    setScreen("matches");
  };

  const matches = useMemo(() => {
    return demoMarkets
      .map((m) => {
        const price = Number(
          product.price || 850
        );

        let score = m.score;

        if (
          price < m.min ||
          price > m.max
        ) {
          score -= 15;
        }

        return {
          ...m,
          score: Math.max(20, score)
        };
      })
      .sort(
        (a, b) =>
          b.score - a.score
      );
  }, [product.price]);

  return (
    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            क
          </div>

          <div>
            <strong>
              KalaSetu
            </strong>

            <span>
              AI for artisans
            </span>
          </div>

        </div>

        <div className="role-pill">
          ARTISAN MODE
        </div>

        <nav>

          <Nav
            icon="⌂"
            label="Dashboard"
            active={
              screen === "dashboard"
            }
            onClick={() =>
              setScreen("dashboard")
            }
          />

          <Nav
            icon="＋"
            label="Add Product"
            active={[
              "add",
              "review",
              "price"
            ].includes(screen)}
            onClick={() =>
              setScreen("add")
            }
          />

          <Nav
            icon="▣"
            label="My Products"
            active={
              screen === "products"
            }
            onClick={() =>
              setScreen("products")
            }
          />

          <Nav
            icon="◎"
            label="Market Opportunities"
            active={[
              "matches",
              "opportunity"
            ].includes(screen)}
            onClick={() =>
              setScreen("matches")
            }
          />

          <Nav
            icon="♡"
            label="Saved & Follow-up"
            active={
              screen === "saved"
            }
            onClick={() =>
              setScreen("saved")
            }
          />

        </nav>

        <div className="sidebar-bottom">

          <div className="language">

            <span>
              Language
            </span>

            <select
              value={language}
              onChange={(e) => {
                const value = e.target.value;
                setLanguage(value);
                if (profile) {
                  const updated = { ...profile, language: value };
                  setProfile(updated);
                  localStorage.setItem("shilpsetu_profile", JSON.stringify(updated));
                }
              }}
            >
              <option>
                English
              </option>

              <option>
                हिन्दी
              </option>

              <option>
                मराठी
              </option>
            </select>

          </div>

          <div className="profile-mini">

            <div className="avatar">
              {(profile?.name || "Artisan").split(/\s+/).slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
            </div>

            <div>
              <b>{profile?.name || "Artisan"}</b>
              <span>{profile?.craft || "Traditional Artisan"}</span>
            </div>

          </div>

        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <div>

            <div className="eyebrow">
              DIGITAL ARTISAN ASSISTANT
            </div>

            <h1>
              {screen === "dashboard"
                ? `Good morning, ${profile?.name || "Artisan"} 👋`
                : screen === "add"
                ? "Create a market-ready catalog"
                : screen === "review"
                ? "Review AI catalog"
                : screen === "price"
                ? "Transparent price guidance"
                : screen === "products"
                ? "My products"
                : screen === "matches"
                ? "Market opportunities"
                : screen === "opportunity"
                ? "Opportunity details"
                : "Saved & follow-up"}
            </h1>

          </div>

          <div className="top-actions">

            <span className="sync-dot">
              ● Online
            </span>

            <button className="icon-btn">
              🔔
            </button>

            <div className="avatar">
              {(profile?.name || "Artisan").split(/\s+/).slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
            </div>

          </div>

        </header>

        {screen === "onboarding" && (
          <Onboarding onComplete={saveProfile} />
        )}

        {screen === "dashboard" && (
          <Dashboard
            profile={profile}
            onAdd={() =>
              setScreen("add")
            }
            onMatches={() =>
              setScreen("matches")
            }
          />
        )}

        {screen === "add" && (
          <AddProduct
            photo={photo}
            onPhoto={handlePhoto}
            analyzing={analyzing}
            onAnalyze={runAnalysis}
          />
        )}

        {screen === "review" && (
          <Review
            product={product}
            setProduct={setProduct}
            onBack={() =>
              setScreen("add")
            }
            onNext={() =>
              setScreen("price")
            }
          />
        )}

        {screen === "price" && (
          <Price
            costs={costs}
            setCosts={setCosts}
            base={base}
            min={priceMin}
            max={priceMax}
            product={product}
            onBack={() =>
              setScreen("review")
            }
            onPublish={publish}
          />
        )}

        {screen === "products" && (
          <Products
            onAdd={() =>
              setScreen("add")
            }
          />
        )}

        {screen === "matches" && (
          <Matches
            matches={matches}
            onOpen={(m) => {
              setProduct((p) => ({
                ...p,
                selectedMarket: m
              }));

              setScreen(
                "opportunity"
              );
            }}
          />
        )}

        {screen === "opportunity" && (
          <Opportunity
            market={
              product.selectedMarket ||
              matches[0]
            }
            saved={saved}
            enquired={enquired}
            setSaved={setSaved}
            setEnquired={
              setEnquired
            }
            notify={notify}
            onBack={() =>
              setScreen("matches")
            }
          />
        )}

        {screen === "saved" && (
          <Saved
            saved={saved}
            enquired={enquired}
            onOpen={(m) => {
              setProduct((p) => ({
                ...p,
                selectedMarket: m
              }));

              setScreen(
                "opportunity"
              );
            }}
          />
        )}

        {toast && (
          <div className="toast">
            ✓ {toast}
          </div>
        )}

      </main>

    </div>
  );
}


function Onboarding({ onComplete }) {
  const [form, setForm] = useState({ name: "", craft: "", location: "", language: "English", contact: "WhatsApp" });
  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.craft.trim() || !form.location.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    onComplete({ ...form, name: form.name.trim(), craft: form.craft.trim(), location: form.location.trim() });
  };

  return (
    <div className="content onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-brand">
          <div className="brand-mark">क</div>
          <div><strong>KalaSetu</strong><span>AI for artisans</span></div>
        </div>
        <div className="onboarding-header">
          <span className="ai-badge">✦ ARTISAN ONBOARDING</span>
          <h1>Welcome to KalaSetu 👋</h1>
          <p>Let's create your artisan profile so we can find the right markets for your craft.</p>
        </div>
        <form className="onboarding-card" onSubmit={submit}>
          <div className="profile-avatar">👤</div>
          <div className="onboarding-section"><h3>Tell us about yourself</h3><p>This information helps us personalize market recommendations.</p></div>
          <label className="field"><span>Artisan name *</span><input value={form.name} placeholder="e.g. Meera Kumari" onChange={(e) => update("name", e.target.value)} /></label>
          <label className="field"><span>Craft type *</span><input value={form.craft} placeholder="e.g. Warli Painting" onChange={(e) => update("craft", e.target.value)} /></label>
          <label className="field"><span>Village / City *</span><input value={form.location} placeholder="e.g. Palghar, Maharashtra" onChange={(e) => update("location", e.target.value)} /></label>
          <div className="form-row">
            <label className="field"><span>Preferred language</span><select value={form.language} onChange={(e) => update("language", e.target.value)}><option>English</option><option>हिन्दी</option><option>मराठी</option></select></label>
            <label className="field"><span>Contact preference</span><select value={form.contact} onChange={(e) => update("contact", e.target.value)}><option>WhatsApp</option><option>Phone</option><option>Email</option></select></label>
          </div>
          <div className="privacy-note">🔒<div><b>Your information stays under your control.</b><span>Contact details are only shared with your approval when you enquire about an opportunity.</span></div></div>
          <button className="primary full" type="submit">Create my profile →</button>
        </form>
        <p className="onboarding-footer">Your profile is saved on this device.</p>
      </div>
    </div>
  );
}


function Nav({
  icon,
  label,
  active,
  onClick
}) {
  return (
    <button
      className={`nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <span>
        {icon}
      </span>

      {label}
    </button>
  );
}


function Dashboard({
  profile,
  onAdd,
  onMatches
}) {
  return (
    <div className="content">

      <section className="hero-card">

        <div>

          <span className="ai-badge">
            ✦ AI ASSISTANT
          </span>

          <h2>
            Turn your craft into a market opportunity.
          </h2>

          <p>
            Take a photo. We organize
            the catalog, guide your price,
            and find markets that fit.
          </p>

          <button
            className="primary"
            onClick={onAdd}
          >
            ＋ Add a product
          </button>

        </div>

        <div className="hero-art">

          <div className="orbit">
            ✦
          </div>

          <div className="craft-emoji">
            🎨
          </div>

          <span className="floating f1">
            AI Catalog
          </span>

          <span className="floating f2">
            92% Match
          </span>

          <span className="floating f3">
            ₹700–₹900
          </span>

        </div>

      </section>


      <div className="section-head">

        <div>
          <h3>
            Your progress
          </h3>

          <p>
            One simple journey from craft to market.
          </p>
        </div>

      </div>


      <div className="steps">

        <Step
          n="01"
          title="Create catalog"
          desc="Photo → title, description & tags"
          done
        />

        <Step
          n="02"
          title="Price guidance"
          desc="Cost-based transparent range"
          done
        />

        <Step
          n="03"
          title="Find markets"
          desc="Ranked opportunities with reasons"
          active
        />

        <Step
          n="04"
          title="Contact"
          desc="Save, enquire or follow up"
        />

      </div>


      <div className="grid-2">

        <section className="panel">

          <div className="panel-head">

            <div>

              <h3>
                Recent product
              </h3>

              <p>
                Your latest AI-assisted catalog
              </p>

            </div>

            <button
              className="text-btn"
              onClick={() =>
                onAdd()
              }
            >
              Add new
            </button>

          </div>


          <div className="product-row">

            <div className="product-thumb">
              🎨
            </div>

            <div className="grow">

              <b>
                Traditional Warli Wall Painting
              </b>

              <span>
                {profile?.craft || "Traditional Craft"} · {profile?.location || "India"}
              </span>

              <div className="tags">

                <em>
                  Warli
                </em>

                <em>
                  Handmade
                </em>

                <em>
                  Wall Decor
                </em>

              </div>

            </div>

            <strong>
              ₹850
            </strong>

          </div>

        </section>


        <section className="panel">

          <div className="panel-head">

            <div>

              <h3>
                Top market match
              </h3>

              <p>
                Explainable recommendations
              </p>

            </div>

          </div>


          <div className="match-mini">

            <div className="score">
              92
              <small>
                %
              </small>
            </div>

            <div className="grow">

              <b>
                Maharashtra Handicraft Expo
              </b>

              <span>
                Exhibition · Pune
              </span>

              <p>
                ✓ Craft match
                &nbsp;
                ✓ Location fit
                &nbsp;
                ✓ Price fit
              </p>

            </div>

            <button
              className="circle-btn"
              onClick={onMatches}
            >
              →
            </button>

          </div>

        </section>

      </div>

    </div>
  );
}


function Step({
  n,
  title,
  desc,
  done,
  active
}) {
  return (
    <div
      className={`step ${
        active ? "current" : ""
      }`}
    >

      <div
        className={`step-icon ${
          done ? "done" : ""
        }`}
      >
        {done ? "✓" : n}
      </div>

      <div>

        <b>
          {title}
        </b>

        <span>
          {desc}
        </span>

      </div>

    </div>
  );
}


function AddProduct({
  photo,
  onPhoto,
  analyzing,
  onAnalyze
}) {
  return (
    <div className="content narrow">

      <div className="flow-note">

        <span>
          1
        </span>

        <div>

          <b>
            Capture or upload
          </b>

          <p>
            No need to type a long listing.
            Start with one product photo.
          </p>

        </div>

      </div>


      <div className="upload-card">

        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={onPhoto}
          hidden
        />

        {photo ? (
          <img
            className="preview"
            src={photo}
            alt="Uploaded product"
          />
        ) : (
          <div className="upload-empty">

            <div className="camera">
              ⌾
            </div>

            <h3>
              Add your product photo
            </h3>

            <p>
              Use a clear photo of the complete product.
            </p>

          </div>
        )}

        <label
          htmlFor="photo"
          className="secondary"
        >
          {photo
            ? "Change photo"
            : "Choose photo"}
        </label>

      </div>


      <div className="voice-card">

        <div className="mic">
          🎙
        </div>

        <div>

          <b>
            Prefer speaking?
          </b>

          <span>
            Say what you know in Marathi,
            Hindi or English.
          </span>

        </div>

        <button className="secondary">
          Try voice
        </button>

      </div>


      <div className="action-bar">

        <button className="ghost">
          Save draft
        </button>

        <button
          className="primary"
          disabled={analyzing}
          onClick={onAnalyze}
        >
          {analyzing
            ? "✦ AI is analyzing…"
            : "✦ Analyze with AI"}
        </button>

      </div>

    </div>
  );
}


function Review({ product, setProduct, onBack, onNext }) {
  const confidence = product.confidence || {};
  const update = (key, value) => setProduct({ ...product, [key]: value });

  return (
    <div className="content narrow">
      <div className="ai-processing">
        <div className="spark">✦</div>
        <div>
          <b>AI-assisted catalog generated</b>
          <span>AI has organized the photo into a draft catalog. Review before publishing.</span>
        </div>
        <span className="confidence">AI draft</span>
      </div>

      <div className="ai-insights">
        <div><span>✓</span><b>Product detected</b><small>Traditional wall art</small></div>
        <div><span>✓</span><b>Craft identified</b><small>Warli style</small></div>
        <div><span>!</span><b>Material uncertain</b><small>Needs artisan confirmation</small></div>
      </div>

      <div className="review-grid">
        <div className="image-card">
          {product.image?.startsWith("blob:") ? <img src={product.image} alt="Product" /> : <span>{product.image}</span>}
        </div>

        <div className="form-panel">
          <AICatalogField label="Product title" value={product.title} confidence={confidence.title} onChange={v => update("title", v)} />
          <AICatalogField label="Category" value={product.category} confidence={confidence.category} onChange={v => update("category", v)} />
          <AICatalogField label="Craft type" value={product.craft} confidence={confidence.craft} onChange={v => update("craft", v)} />

          <AICatalogField
            label="Material"
            value={product.material}
            confidence={confidence.material}
            uncertain={confidence.material < 70}
            onChange={v => update("material", v)}
          />

          <label className="field">
            <span>Description <em className="ai-label">AI generated</em></span>
            <textarea
              value={product.description || "Handcrafted traditional Warli wall art featuring traditional visual motifs. Review and edit the description before publishing."}
              onChange={e => update("description", e.target.value)}
            />
            <small className="confidence-text">{confidence.description || 91}% confidence</small>
          </label>

          <label className="field">
            <span>Tags <em className="ai-label">AI suggested</em></span>
            <input
              value={(product.tags || []).join(", ")}
              onChange={e => update("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
            />
            <small className="confidence-text">{confidence.tags || 93}% confidence</small>
          </label>

          <div className="human-note">🛡️ <b>Human-in-the-loop:</b> AI suggests; you decide. Low-confidence information is flagged for your confirmation and is never automatically published.</div>
        </div>
      </div>

      <div className="review-approval">
        <div><b>Ready to review?</b><span>Check the highlighted AI suggestions and correct anything that is wrong.</span></div>
        <span className="draft-status">● AI Draft — not published</span>
      </div>

      <div className="action-bar">
        <button className="ghost" onClick={onBack}>← Back</button>
        <button className="primary" onClick={onNext}>Approve & continue to price →</button>
      </div>
    </div>
  );
}

function AICatalogField({ label, value, confidence = 0, uncertain, onChange }) {
  const level = confidence >= 85 ? "high" : confidence >= 70 ? "medium" : "low";
  return (
    <label className={`field ai-field ${uncertain ? "uncertain" : ""}`}>
      <span>{label} <em className="ai-label">AI suggested</em></span>
      <div className="field-with-confidence">
        <input value={value || ""} onChange={e => onChange(e.target.value)} />
        <span className={`confidence-pill ${level}`}>{uncertain ? "⚠ Confirm" : `${confidence}%`}</span>
      </div>
      <small className={`confidence-text ${level}`}>
        {uncertain ? "AI is not fully confident — please confirm this field." : `${confidence}% confidence`}
      </small>
    </label>
  );
}


function Field({
  label,
  value,
  onChange
}) {
  return (
    <label className="field">

      <span>
        {label}
      </span>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />

    </label>
  );
}


function Price({
  costs,
  setCosts,
  base,
  min,
  max,
  onBack,
  onPublish,
  product
}) {

  // FIXED SYNTAX ERROR
  const update = (k, v) =>
    setCosts({
      ...costs,
      [k]: v
    });

  return (
    <div className="content narrow">

      <div className="price-layout">

        <div className="panel">

          <div className="panel-head">

            <div>

              <h3>
                Your costs
              </h3>

              <p>
                Transparent inputs — no black-box price.
              </p>

            </div>

          </div>


          <Cost
            label="Material cost"
            value={costs.material}
            onChange={(v) =>
              update(
                "material",
                v
              )
            }
          />

          <Cost
            label="Labor cost"
            value={costs.labor}
            onChange={(v) =>
              update(
                "labor",
                v
              )
            }
          />

          <Cost
            label="Other / overhead"
            value={costs.other}
            onChange={(v) =>
              update(
                "other",
                v
              )
            }
          />


          <div className="base-cost">

            <span>
              Estimated base cost
            </span>

            <b>
              ₹{base}
            </b>

          </div>

        </div>


        <div className="suggested-price">

          <span className="ai-badge">
            ✦ AI PRICE GUIDANCE
          </span>

          <h3>
            Suggested selling range
          </h3>

          <div className="price-range">

            ₹{min || 700}

            <span>
              —
            </span>

            ₹{max || 900}

          </div>

          <p>
            Based on your declared costs
            and a configurable margin.
            This is{" "}
            <b>
              guidance, not a guaranteed market price.
            </b>
          </p>


          <div className="formula">

            <span>
              Base cost
            </span>

            <b>
              ₹{base}
            </b>

            <span>
              Margin band
            </span>

            <b>
              25–55%
            </b>

          </div>

        </div>

      </div>


      <div className="action-bar">

        <button
          className="ghost"
          onClick={onBack}
        >
          ← Back
        </button>

        <button
          className="primary"
          onClick={onPublish}
        >
          Approve & publish →
        </button>

      </div>

    </div>
  );
}


function Cost({
  label,
  value,
  onChange
}) {
  return (
    <label className="cost">

      <span>
        {label}
      </span>

      <div>

        <span>
          ₹
        </span>

        <input
          type="number"
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
        />

      </div>

    </label>
  );
}


function Products({
  onAdd
}) {
  return (
    <div className="content">

      <div className="toolbar">

        <div>

          <p>
            3 products in your catalog
          </p>

        </div>

        <button
          className="primary"
          onClick={onAdd}
        >
          ＋ Add product
        </button>

      </div>


      <div className="product-grid">

        {products.map((p) => (

          <div
            className="product-card"
            key={p.id}
          >

            <div className="product-art">
              {p.image}
            </div>

            <div className="product-info">

              <span className="status">
                {p.status}
              </span>

              <h3>
                {p.title}
              </h3>

              <span>
                {p.category}
              </span>


              <div className="card-bottom">

                <b>
                  ₹{p.price}
                </b>

                <button className="text-btn">
                  View catalog →
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


function Matches({
  matches,
  onOpen
}) {
  return (
    <div className="content">

      <div className="match-banner">

        <div>

          <span className="ai-badge">
            ✦ EXPLAINABLE MATCHING
          </span>

          <h2>
            We found markets that fit your product.
          </h2>

          <p>
            Recommendations use category/craft,
            material/use-case, location, price,
            market requirements and season.
          </p>

        </div>


        <div className="weight-wheel">

          6

          <br />

          <small>
            signals
          </small>

        </div>

      </div>


      <div className="section-head">

        <div>

          <h3>
            Ranked opportunities
          </h3>

          <p>
            Choose where you want to approach —
            the artisan stays in control.
          </p>

        </div>

        <span className="result-count">
          {matches.length} matches
        </span>

      </div>


      <div className="market-list">

        {matches.map(
          (m, i) => (

            <button
              className="market-card"
              key={m.id}
              onClick={() =>
                onOpen(m)
              }
            >

              <div className="rank">
                {i + 1}
              </div>


              <div className="market-icon">

                {m.type ===
                "Exhibition"
                  ? "🎪"
                  : m.type ===
                    "Boutique"
                  ? "🏬"
                  : m.type ===
                    "Gift Shop"
                  ? "🎁"
                  : "🧭"}

              </div>


              <div className="grow">

                <div className="market-title">

                  <b>
                    {m.name}
                  </b>

                  <span>
                    {m.type}
                  </span>

                </div>


                <span>
                  {m.location} ·{" "}
                  {m.season}
                </span>


                <div className="reason-row">

                  {m.reason
                    .slice(0, 3)
                    .map((r) => (

                      <em key={r}>
                        ✓ {r}
                      </em>

                    ))}

                </div>

              </div>


              <div className="match-score">

                <strong>
                  {m.score}%
                </strong>

                <span>
                  match
                </span>

              </div>


              <span className="arrow">
                →
              </span>

            </button>

          )
        )}

      </div>

    </div>
  );
}


function Opportunity({
  market,
  saved,
  enquired,
  setSaved,
  setEnquired,
  notify,
  onBack
}) {

  const isSaved =
    saved.some(
      (x) =>
        x.id === market.id
    );

  const isEnq =
    enquired.some(
      (x) =>
        x.id === market.id
    );

  return (
    <div className="content narrow">

      <button
        className="back-link"
        onClick={onBack}
      >
        ← Back to opportunities
      </button>


      <div className="opportunity">

        <div className="opportunity-head">

          <div className="big-market-icon">
            🎪
          </div>


          <div>

            <span className="ai-badge">
              VERIFIED DEMO OPPORTUNITY
            </span>

            <h2>
              {market.name}
            </h2>

            <span>
              {market.type} ·{" "}
              {market.location}
            </span>

          </div>


          <div className="big-score">

            {market.score}%

            <small>
              match
            </small>

          </div>

        </div>


        <div className="op-grid">

          <div>

            <h3>
              Why this fits
            </h3>

            {market.reason.map(
              (r, i) => (

                <div
                  className="why"
                  key={i}
                >

                  <span>
                    ✓
                  </span>

                  {r}

                </div>

              )
            )}


            <h3 className="mt">
              Market details
            </h3>


            <div className="detail-lines">

              <span>

                Price band

                <b>
                  ₹{market.min}–
                  ₹{market.max}
                </b>

              </span>


              <span>

                Category

                <b>
                  {market.categories.join(
                    ", "
                  )}
                </b>

              </span>


              <span>

                Timing

                <b>
                  {market.season}
                </b>

              </span>

            </div>

          </div>


          <div className="contact-box">

            <h3>
              Next step
            </h3>

            <p>
              Send a simple enquiry.
              Your contact details are
              shared only with your approval.
            </p>


            <textarea
              placeholder="Hello, I am interested in this opportunity and would like to know the application process."
              defaultValue="Hello, I am a Warli artisan from Maharashtra. I would like to enquire about showcasing my handmade wall art."
            />


            <button
              className="primary full"
              onClick={() => {

                if (!isEnq) {
                  setEnquired([
                    ...enquired,
                    market
                  ]);
                }

                notify(
                  "Enquiry sent — added to follow-up"
                );
              }}
            >

              {isEnq
                ? "✓ Enquiry sent"
                : "Send enquiry"}

            </button>


            <button
              className="secondary full"
              onClick={() => {

                if (!isSaved) {
                  setSaved([
                    ...saved,
                    market
                  ]);
                }

                notify(
                  isSaved
                    ? "Already saved"
                    : "Opportunity saved"
                );
              }}
            >

              {isSaved
                ? "♡ Saved"
                : "♡ Save for follow-up"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


function Saved({
  saved,
  enquired,
  onOpen
}) {

  const followUps = [
    ...saved,
    ...enquired.filter(
      (e) =>
        !saved.some(
          (s) =>
            s.id === e.id
        )
    )
  ];

  return (
    <div className="content narrow">

      <div className="saved-summary">

        <div>

          <b>
            {saved.length}
          </b>

          <span>
            Saved opportunities
          </span>

        </div>


        <div>

          <b>
            {enquired.length}
          </b>

          <span>
            Enquiries sent
          </span>

        </div>


        <div>

          <b>
            1
          </b>

          <span>
            Product published
          </span>

        </div>

      </div>


      {followUps.map(
        (m) => (

          <button
            className="market-card"
            key={m.id}
            onClick={() =>
              onOpen(m)
            }
          >

            <div className="market-icon">
              🎪
            </div>


            <div className="grow">

              <b>
                {m.name}
              </b>

              <span>
                {m.type} ·{" "}
                {m.location}
              </span>


              <div className="reason-row">

                <em>
                  {enquired.some(
                    (e) =>
                      e.id === m.id
                  )
                    ? "✓ Enquiry sent"
                    : "Saved"}
                </em>

              </div>

            </div>


            <div className="match-score">

              <strong>
                {m.score}%
              </strong>

              <span>
                match
              </span>

            </div>

          </button>

        )
      )}


      {saved.length === 0 &&
        enquired.length === 0 && (

          <div className="empty">

            <div>
              ♡
            </div>

            <h3>
              No follow-ups yet
            </h3>

            <p>
              Save a market opportunity
              from the matching screen.
            </p>

          </div>

        )}

    </div>
  );
}


createRoot(
  document.getElementById("root")
).render(
  <App />
);