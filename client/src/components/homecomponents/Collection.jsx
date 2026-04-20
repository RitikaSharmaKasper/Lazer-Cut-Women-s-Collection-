import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axiosInstance from "../../api/axiosInstance";
import { dummyCollections } from "../../data/dummyCollections";

const USE_DUMMY_DATA = true;

const badgeStyles = {
  "New Arrival": { bg: "#FBEAF0", color: "#72243E" },
  Trending:      { bg: "#E1F5EE", color: "#085041" },
  Sale:          { bg: "#FAEEDA", color: "#633806" },
  Bestseller:    { bg: "#EAF3DE", color: "#27500A" },
  Featured:      { bg: "#EEEDFE", color: "#3C3489" },
};

function Stars({ rating = 4 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#EF9F27" : "#D3D1C7", fontSize: 16 }}>
          ★
        </span>
      ))}
    </div>
  );
}

function ProductCard({ p, index }) {
  const v = p?.variants?.[0] || {};
  const mrp = Number(v?.variantMrp || 0);
  const sell = Number(v?.variantSellingPrice || 0);
  const off = mrp > 0 && sell > 0 && sell < mrp ? Math.round(((mrp - sell) / mrp) * 100) : 0;
  const img = v?.variantImage?.[0] || p?.images?.[0] || "/fallback.png";
  const badge = p?.productBadge;
  const badgeStyle = badgeStyles[badge] || null;

  const sizes = p?.sizes || [...new Set((p?.variants || []).map((v) => v?.variantSize).filter(Boolean))];
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableSizes = new Set(sizes);

  return (
    <Link
      to={`/product/${p._id}`}
      // ✅ Floating delay based on index
      style={{ animation: `floatUp 4s ease-in-out ${index * 0.2}s infinite` }}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 transition-transform duration-200"
    >

      <div className="relative overflow-hidden">
        <img
          src={img}
          alt={p.productTittle}
          loading="lazy"
          className="w-full h-[260px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && badgeStyle && (
          <span className="absolute top-3 left-3 text-[11px] font-medium px-3 py-1 rounded-full" style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
            {badge}
          </span>
        )}
        {sizes.length > 0 && sizes.length <= 2 && (
          <span className="absolute top-3 right-3 text-[10px] font-medium px-2 py-1 rounded-full bg-red-50 text-red-600">
            Almost Gone
          </span>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-4">
          <span className="bg-white text-gray-800 text-xs font-medium px-4 py-2 rounded-full">Quick View</span>
        </div>
      </div>

      <div className="px-3 pt-3 pb-4">
        <p className="text-[12px] tracking-widest uppercase text-gray-500 mb-1">{p.category}</p>
        <h3 className="text-md font-medium text-gray-800 truncate mb-2">{p.productTittle}</h3>
        <div className="flex items-center gap-1 flex-wrap mb-3">
          {allSizes.map((s) => (
            <span key={s} className={`text-[12x] px-2 py-0.5 rounded border font-medium ${availableSizes.has(s) ? "border-gray-300 text-gray-700 bg-white" : "border-gray-100 text-gray-400 bg-gray-50 line-through"}`}>
              {s}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-medium text-gray-900">₹{sell > 0 ? sell.toLocaleString() : mrp.toLocaleString()}</span>
          {off > 0 && <><span className="text-xs text-gray-400 line-through">₹{mrp.toLocaleString()}</span><span className="text-md font-medium text-emerald-700">{off}% off</span></>}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Stars rating={4.5} />
          <span className="text-[12px] text-gray-400">(128)</span>
        </div>
      </div>
    </Link>
  );
}

function Collection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (USE_DUMMY_DATA) { setProducts(dummyCollections); return; }
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products/all");
        setProducts(res.data.products || []);
      } catch (err) { console.log(err); setProducts([]); }
    };
    fetchProducts();
  }, []);

  return (
    <section className="bg-white py-14 px-10 md:px-18 lg:px-20 overflow-hidden">
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(7px); }
          50% { transform: translateY(-14px); }
        }
        /* Swiper container ko thodi padding taaki card upar jaye toh dikhe */
        .swiper {
          overflow: visible !important;
          padding-top: 20px !important;
          padding-bottom: 20px !important;
        }
      `}</style>

      {/* Main Header Container */}
<div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 px-2 gap-6">
  
  {/* 1. Left Spacer (Hidden on mobile, maintains balance on desktop) */}
  <div className="hidden md:block w-32"></div>

  {/* 2. Centered Content Block */}
  <div className="flex flex-col items-center text-center flex-1">
    <p className="text-[12px] tracking-[0.2em] uppercase text-rose-500 font-medium mb-2">
      New Arrivals, Trends, And Sale
    </p>
    
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-3">
      <span className="font-serif italic text-black">
        Explore Our New Collections
      </span>
    </h1>

    <p className="text-md text-gray-400">
      Handpicked styles for every occasion
    </p>
  </div>

  {/* 3. Right Side Buttons */}
  <div className="flex items-center gap-2 w-full md:w-32 justify-center md:justify-end">
    <button className="collection-prev w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all">
      <ChevronLeft size={20} className="text-gray-600" />
    </button>
    <button className="collection-next w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all">
      <ChevronRight size={20} className="text-gray-600" />
    </button>
  </div>
</div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        autoplay={{ delay: 900, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation={{ nextEl: ".collection-next", prevEl: ".collection-prev" }}
        loop={true}
        breakpoints={{
          480:  { slidesPerView: 2 },
          640:  { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="!overflow-visible pr-4 pl-4" // ✅ Overflow visible zaroori hai
      >
        {products.map((p, i) => (
          <SwiperSlide key={p._id || i} className="!overflow-visible">
            {/* ✅ index pass kar diya floating delay ke liye */}
            <ProductCard p={p} index={i} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Collection;