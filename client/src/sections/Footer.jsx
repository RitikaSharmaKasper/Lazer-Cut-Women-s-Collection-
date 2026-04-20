import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const footerLinkClass =
    "text-blue-100 hover:text-white transition-colors duration-200";
  const handleSectionNavigation = (sectionId) => {
    if (location.pathname === "/" || location.pathname === "/home") {
      const sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `${location.pathname}#${sectionId}`);
        return;
      }
    }
    navigate(`/home#${sectionId}`);
  };

  return (
    <section className="lg:px-20 md:px-[60px] px-4 py-12 bg-[#0F2942] text-white border-t border-[#23486D]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <Link to="/" className="w-fit">
            <h1 className="font-semibold text-[22px] tracking-wide">AURA</h1>
          </Link>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-md">
            Discover premium women collection designs crafted for everyday
            elegance, festive moments, and timeless style.
          </p>
          <div className="text-blue-100 text-sm md:text-base space-y-3">
            <div>
              <p className="font-medium text-white">Address</p>
              <p>
                Office Number 503, TOWER-C, The iThum Towers, Sector 62, Noida,
                Uttar Pradesh 201301
              </p>
            </div>
            <div>
              <p className="font-medium text-white">Contact Details</p>
              <a
                href="mailto:info@kasperinfotech.com"
                className={footerLinkClass}
              >
                info@kasperinfotech.com
              </a>
              <br />
              <a
                href="mailto:sales@kasperinfotech.com"
                className={footerLinkClass}
              >
                sales@kasperinfotech.com
              </a>
              <p>+91 800-644-8800</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-semibold text-lg">Company</h1>
          <ul className="text-sm md:text-base flex flex-col gap-2">
            <li><Link to="/aboutUs" className={footerLinkClass}>About Us</Link></li>
            <li><Link to="/shippingpolicy" className={footerLinkClass}>Shipping Policy</Link></li>
            <li><Link to="/returnrefundpolicy" className={footerLinkClass}>Return & Refund Policy</Link></li>
            <li><Link to="/policy" className={footerLinkClass}>Privacy Policy</Link></li>
            <li><Link to="/termsconditions" className={footerLinkClass}>Terms & Conditions</Link></li>
            <li><Link to="/faqs" className={footerLinkClass}>FAQs</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-semibold text-lg">Shop</h1>
          <ul className="text-sm md:text-base flex flex-col gap-2">
            <li><button type="button" onClick={() => handleSectionNavigation("latest-products")} className={footerLinkClass}>Latest Products</button></li>
            <li><button type="button" onClick={() => handleSectionNavigation("shop-by-category")} className={footerLinkClass}>Bestseller Collection</button></li>
            <li><button type="button" onClick={() => handleSectionNavigation("standard-collections")} className={footerLinkClass}>Featured Collection</button></li>
            <li><button type="button" onClick={() => handleSectionNavigation("festive-occasions")} className={footerLinkClass}>Traditional Collection</button></li>
            <li><Link to="/products/Dresses" className={footerLinkClass}>Women Collection</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-semibold text-lg">Account</h1>
          <ul className="text-sm md:text-base flex flex-col gap-2">
            <li><Link to="/accounts/details" className={footerLinkClass}>My Account</Link></li>
            <li><Link to="/bag" className={footerLinkClass}>My Cart</Link></li>
            <li><Link to="/accounts/order-history" className={footerLinkClass}>My Orders</Link></li>
            <li><Link to="/accounts/wishlist" className={footerLinkClass}>Wishlist</Link></li>
            <li><Link to="/accounts/addresses" className={footerLinkClass}>Manage Addresses</Link></li>
            <li><Link to="/accounts/support" className={footerLinkClass}>Contact Support</Link></li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 py-5 border-t border-[#2B567E] mt-8">
        <div className="flex gap-3">
          <a href="https://www.instagram.com/kasperinfo/" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-2 rounded-full bg-[#1B3E60] hover:bg-[#24527D] transition-colors"><Instagram size={18} /></a>
          <a href="https://www.facebook.com/kasperinfotech/" target="_blank" rel="noreferrer" aria-label="Facebook" className="p-2 rounded-full bg-[#1B3E60] hover:bg-[#24527D] transition-colors"><Facebook size={18} /></a>
          <a href="https://x.com/kasperInfotech3" target="_blank" rel="noreferrer" aria-label="Twitter" className="p-2 rounded-full bg-[#1B3E60] hover:bg-[#24527D] transition-colors"><Twitter size={18} /></a>
          <a href="https://www.linkedin.com/company/kasper-infotech" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 rounded-full bg-[#1B3E60] hover:bg-[#24527D] transition-colors"><Linkedin size={18} /></a>
        </div>
        <p className="text-sm md:text-base text-blue-100">
          © Copyright 2016-2026. All Rights Reserved.
        </p>
      </div>
    </section>
  );
}

export default Footer;
