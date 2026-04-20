import { useEffect, useMemo, useState } from "react";
import products from "../../data/products.json";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { getAverageRating } from "../../utils/homePageUtils";

function LatestProducts() {
  // 1. Initial State ko function se set karo taaki refresh pe 5 hi dikhe
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width >= 1280) return 5;
      if (width >= 1024) return 4;
      if (width >= 768) return 3;
      return 4;
    }
    return 5; // Default for server-side or fallback
  });

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width >= 1280) setVisibleCount(5);
      else if (width >= 1024) setVisibleCount(4);
      else if (width >= 768) setVisibleCount(3);
      else setVisibleCount(4);
    };

    // window.addEventListener pehle se hi updateCount call kar lega resize pe
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  // Baki saara code (latestProducts, variants, return) same rahega...
  const latestProducts = useMemo(() => 
    [...products].reverse().slice(0, 10), 
  []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section id="latest-products" className="relative bg-[#D5E5F5] py-12 lg:py-20 overflow-hidden rounded-lg">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1C3753]/5 rounded-full blur-3xl -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#D49A06]/5 rounded-full blur-3xl -ml-32 -mb-32" />

      <div className="container mx-auto px-2 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-3"
            >
         

            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-5xl lg:text-5xl font-serif text-[#1C3753] leading-tight"
            >
             Curated and Latest Products <br /> 
              <span className="text-4xl font-light">Elegance & Style </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y:20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/products"
              className="group flex items-center gap-3 bg-[#1C3753] text-white px-8 py-4 rounded-full hover:bg-[#1C3753]/90 transition-all duration-300 shadow-lg hover:shadow-[#1C3753]/20"
            >
              <span className="text-sm font-medium tracking-wide">View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
        >
          <AnimatePresence>
            {latestProducts.slice(0, visibleCount).map((p) => {
              const key = p.uuid || p.SKU || p._id;
              const mrp = p.mrp || 0;
              const sell = p.sellingPrice || 0;
              const discount = p.discountPercent || 0;
              const ratingAvg = getAverageRating(p.reviews) || 4.5;

              return (
                <motion.div key={key} variants={itemVariants}>
                  <Tilt 
                    perspective={1500} 
                    glareEnable={true} 
                    glareMaxOpacity={0.17} 
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={14}
                    scale={1.01}
                    className="h-full"
                  >
                    <Link
                      to={`/product/${p._id || p.uuid}`}
                      className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                        <img
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={
                            (p.variants?.[0]?.variantImage?.[0]) || 
                            (p.images?.[0]) || 
                            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
                          }
                          alt={p.title}
                          loading="lazy"
                        />
                        
                        {/* Glassmorphism Badge */}
                        {discount > 0 && (
                          <div className="absolute top-4 left-4 backdrop-blur-md bg-white/70 border border-white/20 px-3 py-1.5 rounded-full shadow-lg">
                            <span className="text-[#1C3753] text-[10px] font-bold uppercase tracking-wider">
                              {discount}% OFF
                            </span>
                          </div>
                        )}

                        {/* Quick View Overlay (Visual only) */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-serif text-gray-700 line-clamp-1 mb-2 group-hover:text-[#1C3753] transition-colors">
                          {p.title}
                        </h3>

                        <div className="flex items-center gap-2 mb-4">
                          <Stack spacing={0.5}>
                            <Rating 
                              name="read-only" 
                              value={ratingAvg} 
                              precision={0.5} 
                              size="small" 
                              readOnly 
                              sx={{
                                color: "#D49A06",
                                "& .MuiRating-iconEmpty": { color: "#E0E0E0" }
                              }}
                            />
                          </Stack>
                          <span className="text-[10px] text-gray-400 font-medium">
                            ({p.reviews?.length || 0})
                          </span>
                        </div>

                        <div className="mt-auto flex items-end justify-between">
                          <div className="flex flex-col">
                            {mrp > sell && (
                              <span className="text-gray-400 text-xs line-through font-light mb-0.5">
                                ₹{mrp.toLocaleString()}
                              </span>
                            )}
                            <span className="text-xl font-bold text-[#1C3753]">
                              ₹{sell.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="w-8 h-8 rounded-full border border-[#1C3753]/10 flex items-center justify-center group-hover:bg-[#1C3753] group-hover:text-white transition-all duration-300">
                             <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Tilt>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default LatestProducts;
