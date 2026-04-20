// import Title from "../Title";
// import { Link } from "react-router"; 
// import Rating from "@mui/material/Rating";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// // Import the named export from your JS file
// import { dummyCollections } from "../../data/dummyCollections"; 

// function TopProducts() {
//   const [visibleCount, setVisibleCount] = useState(4);
//   const handleCardPointerMove = (e) => {
//     const card = e.currentTarget;
//     const rect = card.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     card.style.setProperty("--spot-x", `${x}px`);
//     card.style.setProperty("--spot-y", `${y}px`);
//   };

//   useEffect(() => {
//     const updateCount = () => {
//       if (window.innerWidth >= 1280) setVisibleCount(5);
//       else if (window.innerWidth >= 640) setVisibleCount(6);
//       else setVisibleCount(4);
//     };
//     updateCount();
//     window.addEventListener("resize", updateCount);
//     return () => window.removeEventListener("resize", updateCount);
//   }, []);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 }
//     }
//   };

//   const cardVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
//   };

//   return (
//     <section id="standard-collections" className="relative bg-[#D5E5F5] py-10 my-8 px-5 mx-2 md:mx-2 px-5 overflow-hidden shadow-sm border border-blue-100 ">
   
//       <div className="flex items-end justify-between mb-8 px-2">
//         <div>
//           <h1 className="text-[40px] md:text-[45px] lg:text-[45px] font-light text-gray-800 mb-3">
//           {/* Illuminate Your{" "} */}
//           <span className="font-serif  text-[#000000]">Standard Colllections</span>
//         </h1>
//           <p className="text-gray-700 text-lg mt-1">A sharp selection of this season’s definitive silhouettes</p>
//         </div>
//         <Link
//           className="text-xs uppercase tracking-widest font-bold border-b border-black pb-1 hover:text-gray-600 transition-colors"
//           to="/products"
//         >
//           View All
//         </Link>
//       </div>

//       <motion.div 
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//         className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
//       >
//         {dummyCollections.slice(0, visibleCount).map((p) => {
//           // Mapping fields based on your export file
//           const variant = p.variants?.[0];
//           const mrp = variant?.variantMrp || 0;
//           const sp = variant?.variantSellingPrice || 0;
//           const img = variant?.variantImage?.[0] || "/fallback.png";
          
//           // Calculate discount percentage
//           const discount = mrp > 0 ? Math.round(((mrp - sp) / mrp) * 100) : 0;

//           return (
//             <motion.div
//               variants={cardVariants}
//               whileHover={{ y: -8 }}
//               transition={{ type: "spring", stiffness: 220, damping: 18 }}
//               key={p._id}
//             >
//               {/* Clicking this will take you to /product/1, /product/2, etc. */}
//               <Link
//                 to={`/product/${p._id}`} 
//                 className="group block relative rounded-2xl overflow-hidden bg-white border border-blue-100/70 shadow-sm hover:shadow-2xl transition-all duration-500"
//                 onMouseMove={handleCardPointerMove}
//               >
//                 <div
//                   className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                   style={{
//                     background:
//                       "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(44,135,226,0.24), transparent 65%)",
//                   }}
//                 />
//                 {/* Modern Arch Design */}
//                <div className="relative overflow-hidden rounded-t-[120px] rounded-b-lg aspect-[3/4] bg-white transition-all duration-500 isolate">
//   <img
//     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
//     src={img}
//     alt={p.productTittle}
//     loading="lazy"
//   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#1C3753]/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                   {/* Badge from your data (New Arrival, Trending, etc.) */}
//                   {p.productBadge && (
//                     <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[12px] px-3 py-1 rounded-full uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
//                       {p.productBadge}
//                     </div>
//                   )}

//                   {discount > 0 && (
//                     <div className="absolute bottom-4 left-4 backdrop-blur-md bg-green-500 px-3 py-1 rounded-full text-[11px] font-bold tracking-tighter uppercase text-white">
//                       {discount}% OFF
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-4 text-center px-3 pb-4">
//                   <h3 className="text-lg font-medium text-gray-900 line-clamp-1 transition-colors group-hover:text-[#1C3753]">
//                     {p.productTittle}
//                   </h3>
                  
//                   <div className="flex items-center justify-center gap-2 mt-1">
//                     <span className="text-base font-semibold text-gray-900">₹{sp}</span>
//                     {mrp > sp && (
//                       <span className="text-gray-400 text-md line-through">₹{mrp}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col items-center mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
//                      <Rating 
//                         value={4} // Default value since it's not in your dummy data
//                         readOnly 
//                         size="small" 
//                         sx={{ fontSize: '1rem', color: 'yellow-500' }}
//                      />
//                      <span className="text-[12px] text-gray-500 uppercase tracking-widest mt-1">View Details</span>
//                   </div>
//                 </div>
//               </Link>
//             </motion.div>
//           );
//         })}
//       </motion.div>
  
//     </section>
//   );
// }

// export default TopProducts;
import Rating from "@mui/material/Rating";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

import { dummyCollections } from "../../data/dummyCollections"; 

function TopProducts() {
  const handleCardPointerMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--spot-x", `${x}px`);
    card.style.setProperty("--spot-y", `${y}px`);
  };

  const goToProduct = (id) => {
    window.location.href = `/product/${id}`;
  };

  return (
    <section id="standard-collections" className="relative bg-[#D5E5F5] py-12 my-8 overflow-hidden shadow-sm border border-blue-100">
      
      {/* Header with View All */}
      <div className="mb-10 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-[40px] md:text-[45px] lg:text-[45px] font-light text-gray-800 mb-3">
            <span className="font-serif text-[#000000]">Standard Collections</span>
          </h1>
          <p className="text-gray-700 text-xl mt-0">A sharp selection of this season’s definitive silhouettes</p>
        </div>

        <button 
          onClick={() => window.location.href = "/products"}
          className="group flex items-center gap-2 text-sm font-bold tracking-widest text-black hover:text-blue-700 transition-all duration-300 pb-1 border-b-2 border-black hover:border-blue-700"
        >
          VIEW ALL PRODUCTS
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* --- Slider Wrapper with Buttons --- */}
      <div className="relative px-2 md:px-10">
        
        {/* Navigation Buttons */}
        <button 
          id="prev-btn-standard" 
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white text-black p-3 rounded-full shadow-md border border-gray-100 transition-all hover:bg-gray-50 active:scale-90 disabled:opacity-30"
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          id="next-btn-standard" 
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white text-black p-3 rounded-full shadow-md border border-gray-100 transition-all hover:bg-gray-50 active:scale-90 disabled:opacity-30"
        >
          <ChevronRight size={24} />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={25}
          slidesPerView={2}
          className="mySwiper !px-10 md:!px-14 !overflow-visible" 
          navigation={{
            prevEl: "#prev-btn-standard",
            nextEl: "#next-btn-standard",
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
        >
          {dummyCollections.map((p) => {
            const variant = p.variants?.[0];
            const mrp = variant?.variantMrp || 0;
            const sp = variant?.variantSellingPrice || 0;
            const img = variant?.variantImage?.[0] || "/fallback.png";
            const discount = mrp > 0 ? Math.round(((mrp - sp) / mrp) * 100) : 0;

            return (
              <SwiperSlide key={p._id} className="py-4">
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="cursor-pointer"
                  onClick={() => goToProduct(p._id)}
                >
                  <div className="group relative rounded-2xl overflow-hidden bg-white border border-blue-50 shadow-sm hover:shadow-xl transition-all duration-500" onMouseMove={handleCardPointerMove}>
                    
                    {/* Spotlight */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: "radial-gradient(400px circle at var(--spot-x, 60%) var(--spot-y, 60%), rgba(44,135,226,0.15), transparent 90%)" }}
                    />

                    {/* Image Container */}
                    <div className="relative overflow-hidden rounded-t-[100px] md:rounded-t-[120px] rounded-b-lg aspect-[3/4] bg-gray-50 isolate">
                      <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={img} alt={p.productTittle} />
                      
                      {p.productBadge && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          {p.productBadge}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="mt-3 text-center px-2 pb-4">
                      <h3 className="text-sm md:text-md font-medium text-gray-800 line-clamp-1">{p.productTittle}</h3>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-sm md:text-base font-bold text-gray-900">₹{sp}</span>
                        {mrp > sp && <span className="text-gray-400 text-xs line-through">₹{mrp}</span>}
                      </div>
                      
                      <div className="flex flex-col items-center mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Rating value={4} readOnly size="small" sx={{ fontSize: '0.9rem' }} />
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">View Details</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}

export default TopProducts;
