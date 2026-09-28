import Link from "next/link";

export function AuthBrand() {
  return (
    <Link href="/" className="auth-brand" aria-label="FoodFarm Hub home">
      <span className="brand-mark">◒</span>
      <span>
        <b>FOODFARM <i>HUB</i></b>
        <small>Cambodia&apos;s B2B Food &amp; Agriculture Marketplace</small>
      </span>
    </Link>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <div className="auth-layout">
        <aside className="auth-aside">
          <div className="auth-aside-photo" />
          <div className="auth-aside-content">
            <AuthBrand />
            <div className="auth-message">
              <p className="eyebrow eyebrow-light"><span /> CAMBODIA&apos;S TRADE NETWORK</p>
              <h1>Good products<br /><em>grow together.</em></h1>
              <p>Connect with trusted Cambodian suppliers and build the next chapter of your business.</p>
            </div>
            <div className="auth-aside-footer"><span>100+ Trusted Suppliers</span><span>5,000+ Products</span><span>50+ Countries</span></div>
          </div>
        </aside>
        <section className="auth-panel">
          <div className="auth-panel-top"><Link href="/" className="auth-back">← Back to marketplace</Link><span>🇰🇭 Made for Cambodian trade</span></div>
          <div className="auth-content">{children}</div>
          <p className="auth-legal">By continuing, you agree to FoodFarm Hub&apos;s Terms of Service and Privacy Policy.</p>
        </section>
      </div>
    </main>
  );
}

export default AuthShell;
