// import { Link } from "react-router";
// import { useEffect, useState } from "react";
// import Rating from "@mui/material/Rating";
// import Stack from "@mui/material/Stack";

// // ─── Data Sources ──────────────────────────────────────────────────────────
// import productsJson from "../../data/products.json";         
// import { dummyCollections } from "../../data/dummyCollections"; 

// // ─── Your Original Helpers ──────────────────────────────────────────────────
// const getImage = (p) => p?.variants?.[0]?.variantImage?.[0] || p?.images?.[0] || "/fallback.png";
// const getMrp = (p) => Number(p?.variants?.[0]?.variantMrp) || Number(p?.mrp) || 0;
// const getSelling = (p) => Number(p?.variants?.[0]?.variantSellingPrice) || Number(p?.sellingPrice) || 0;
// const getTitle = (p) => p?.title || p?.productTittle || p?.category || "Product";
// const getHref = (p) => p?.route || (p?._id ? `/product/${p._id}` : `/product/${p.uuid}`);

// const getDiscount = (p) => {
//   const d = Number(p?.discountPercent) || Number(p?.variants?.[0]?.variantDiscount) || 0;
//   if (d > 0) return Math.round(d > 1 ? d : d * 100);
//   const mrp = getMrp(p);
//   const sell = getSelling(p);
//   if (mrp > 0 && sell > 0 && mrp > sell) return Math.round(((mrp - sell) / mrp) * 100);
//   return 0;
// };

// const getRating = (p) => {
//   const reviews = p?.reviews;
//   if (!Array.isArray(reviews) || reviews.length === 0) return 0;
//   return reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length;
// };

// const formatINR = (n) => n ? `₹${Number(n).toLocaleString("en-IN")}` : "--";

// const normalizeDummy = (item) => ({
//   _id: item._id,
//   uuid: item._id,
//   route: `/product/${item._id}`,
//   title: item.productTittle,
//   category: item.category,
//   images: [item.variants?.[0]?.variantImage?.[0] || "/fallback.png"],
//   mrp: item.variants?.[0]?.variantMrp || 0,
//   sellingPrice: item.variants?.[0]?.variantSellingPrice || 0,
//   variants: item.variants || [],
//   reviews: item.reviews || [],
// });

// // ─── Product Card Design ──────────────────────────────────────
// const ProductCard = ({ p }) => {
//   const mrp = getMrp(p);
//   const selling = getSelling(p);
//   const discount = getDiscount(p);
  
//   // FIX: Fallback to 4 if rating is 0 so stars are visible
//   const ratingAvg = getRating(p) || 4; 

//   return (
//     <Link
//       to={getHref(p)}
//       className="bg-white rounded-xl border border-gray-100 p-2 group block transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
//     >
//       <div className="relative w-full overflow-hidden rounded-lg">
//         <img
//           className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
//           src={getImage(p)}
//           alt={getTitle(p)}
//           loading="lazy"
//           onError={(e) => { e.target.src = "/fallback.png"; }}
//         />
//         {discount > 0 && (
//           <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
//             {discount}% OFF
//           </div>
//         )}
//         {/* Rating Badge on Image */}
       
//       </div>

//       <div className="mt-2 px-1">
//         <h3 className="text-sm md:text-base font-serif text-gray-800 line-clamp-1 mb-1">
//           {getTitle(p)}
//         </h3>
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="text-gray-900 text-sm font-medium">
//             {formatINR(selling || mrp)}
//           </span>
//           {discount > 0 && (
//             <span className="text-green-600 text-xs">{discount}% Off</span>
//           )}
//         </div>
//         {mrp > selling && selling > 0 && (
//           <span className="text-gray-400 text-xs line-through">
//             {formatINR(mrp)}
//           </span>
//         )}

//         {/* --- FIXED RATING SECTION --- */}
//         <div className="flex items-center gap-1 mt-1">
//           <Stack spacing={1}>
//             <Rating
//               name="size-small"
//               value={ratingAvg}
//               precision={0.5}
//               readOnly
//               size="small"
//               sx={{
//                 "& .MuiRating-iconFilled": {
//                   color: "#faaf00", // Bright Yellow
//                 },
//               }}
//             />
//           </Stack>
//           <span className="text-[11px] text-gray-400">
//             ({Array.isArray(p?.reviews) ? p.reviews.length : 0})
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// };

// // ─── Main Component ────────────────────────────────────────────────────────
// const FestiveOccasions = () => {
//   const ITEMS_PER_LOAD = 10;
//   const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

//   // Filter for Traditional/Lehenga ONLY
//   const festiveProducts = [
//     ...productsJson,
//     ...dummyCollections.map(normalizeDummy),
//   ].filter(p => {
//     const cat = (p.category || "").toLowerCase();
//     const title = (p.title || p.productTittle || "").toLowerCase();
//     return cat === "traditional" || title.includes("lehenga") || title.includes("festive");
//   });

//   const hasMore = festiveProducts.length > visibleCount;

//   return (
//     <div className="bg-white shadow-sm rounded-lg py-10 px-4">
//       {/* Header */}
//       <div className="mx-auto text-start mb-8">
//         <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-800 mb-2">
//           <span className="font-serif text-black">Festive Occasions</span>
//         </h1>
//         <p className="text-gray-500 text-sm md:text-base">
//           Exclusive Traditional Wear & Lehengas
//         </p>
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
//         {festiveProducts.slice(0, visibleCount).map((p) => (
//           <ProductCard key={p._id || p.uuid} p={p} />
//         ))}
//       </div>

//       {/* Load More */}
//       {hasMore && (
//         <div className="text-center mt-10">
//           <button
//             onClick={() => setVisibleCount(prev => prev + ITEMS_PER_LOAD)}
//             className="px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all"
//           >
//             Load more Traditional Wear ({festiveProducts.length - visibleCount} remaining)
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FestiveOccasions;

import { Link } from "react-router";
import Rating from "@mui/material/Rating";

// ─── Data Imports ──────────────────────────────────────────────────────────
import productsJsonData from "../../data/products.json";         
import { dummyCollections as dummyData } from "../../data/dummyCollections"; 

const FestiveOccasions = () => {
  // 1. Helpers - Inhe safely handle kiya hai taaki undefined na aaye
  const getImage = (p) => p?.variants?.[0]?.variantImage?.[0] || p?.images?.[0] || "/fallback.png";
  const getSelling = (p) => Number(p?.variants?.[0]?.variantSellingPrice) || Number(p?.sellingPrice) || 0;
  const getMrp = (p) => Number(p?.variants?.[0]?.variantMrp) || Number(p?.mrp) || 0;
  const getTitle = (p) => p?.productTittle || p?.title || "Festive Piece";
  
  // FIX: ID nikalne ka sahi tarika taaki link undefined na ho
  const getProductLink = (p) => {
    const id = p?._id || p?.uuid || p?.id;
    return id ? `/product/${id}` : "#";
  };

  // 2. Data Filtering Logic
  const festiveProducts = [
    ...(productsJsonData || []),
    ...(dummyData || [])
  ].filter(p => {
    if (!p) return false;
    const cat = (p.category || "").toLowerCase();
    const title = (p.title || p.productTittle || "").toLowerCase();
    // Saree, Lehenga aur Festive products filter
    return cat.includes("traditional") || cat.includes("saree") || title.includes("lehenga") || title.includes("saree") || title.includes("festive");
  }).slice(0, 10);

  if (festiveProducts.length === 0) return null;

  // Infinite loop ke liye products copy
  const displayProducts = [...festiveProducts, ...festiveProducts, ...festiveProducts];

  return (
    <section id="festive-occasions" className="relative bg-[#1C3753] py-7 my-4 mx-4 md:mx-2 rounded-[20px] md:rounded-[20px] overflow-hidden shadow-2xl border-4 border-white/10">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        {/* <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[150px]"></div> */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[150px]"></div>
      </div>

      {/* Header - Centered as requested */}
      <div className="container mx-6 mb-11 relative z-10 text-left">
        <h2 className="text-4xl md:text-5xl font-serif text-white font-light mb-4 ">
          Festive Occasions
        </h2>
       
        <p className="text-xl md:text-2xl font-light text-blue-100  font-serif opacity-90">
          Exclusive Traditional Wear & Lehengas
        </p>
      </div>

      {/* Moving Cards (No Slider, Just Smooth Motion) */}
      <div className="flex w-full overflow-hidden group py-10">
        <div className="flex animate-marquee whitespace-nowrap">
          {displayProducts.map((p, idx) => (
            <div key={`${p?._id || idx}-${idx}`} className="mx-6 md:mx-10 inline-block" style={{ width: '340px' }}>
              <Link 
                to={getProductLink(p)} 
                className="group/card flex items-center relative h-[440px] w-full transition-transform duration-300 hover:scale-[1.02]"
              >
                
                {/* Arch Box (Image) */}
                <div className="absolute left-0 w-[82%] h-full rounded-tr-[120px] rounded-bl-[120px] overflow-hidden border-[5px] border-white shadow-2xl z-10 bg-gray-100">
                  <img
                    src={getImage(p)}
                    alt={getTitle(p)}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Floating Info Card */}
                <div className="absolute right-0 w-[50%] bg-white shadow-2xl z-20 rounded-3xl p-4 border border-gray-100 transition-all duration-500 group-hover/card:-translate-x-4">
                  <h3 className="text-[12px] font-bold text-[#1C3753] uppercase tracking-widest line-clamp-1 mb-2">
                    {getTitle(p)}
                  </h3>
                  
                  <div className="mb-3">
                    <Rating value={4.5} readOnly size="small" sx={{ color: "#FFD700" }} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-black text-[#1C3753]">
                      ₹{getSelling(p).toLocaleString()}
                    </span>
                    {getMrp(p) > getSelling(p) && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{getMrp(p).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default FestiveOccasions;