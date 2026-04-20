import React, { useState, useEffect, useMemo } from "react";
import { Clock, Plus, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import products from "../data/products.json";
import { dummyCollections } from "../data/dummyCollections";
import { addToCart } from "../redux/cart/cartSlice";
import { toast } from "react-toastify";
import { getPrices } from "../utils/homePageUtils";

// Mapping Rulebook (Moved internal to avoid extra files)
const upsellMappings = {
  "Traditional": ["Accessories", "Footwear"],
  "Ethnic Wear": ["Accessories", "Footwear"],
  "Tops": ["Bottomwear", "Accessories", "Footwear"],
  "Dresses": ["Accessories", "Footwear"],
  "Bottomwear": ["Tops", "Footwear", "Accessories"],
  "Jeans & Pants": ["Tops", "Footwear", "Accessories"],
  "Outerwear": ["Bottomwear", "Tops"],
  "Coats": ["Tops", "Bottomwear"],
  "Footwear": ["Accessories", "Dresses", "Bottomwear"],
  "Accessories": ["Dresses", "Traditional", "Tops"],
  "General": ["Accessories", "Dresses"]
};

const CompleteTheLook = ({ purchasedCategory }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Recommendation logic
  const { items: recommendations, title: dynamicTitle } = useMemo(() => {
    const allItems = [...products, ...dummyCollections];
    
    // 1. Get mapped categories or default to accessories/dresses
    let targetCategories = upsellMappings[purchasedCategory] || ["Accessories", "Dresses"];
    
    // 2. Filter items
    let suggested = allItems.filter(item => 
      targetCategories.includes(item.category)
    );

    // 3. Fallback: if we don't have enough items in target categories, add from anywhere else
    if (suggested.length < 3) {
      const extraItems = allItems.filter(item => 
        !suggested.find(s => (s.uuid || s._id) === (item.uuid || item._id)) &&
        ["Accessories", "Dresses", "Footwear"].includes(item.category)
      );
      suggested = [...suggested, ...extraItems];
    }

    // 4. Shuffle and Pick 3
    const shuffled = suggested.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // 5. Dynamic Title
    const isDirectMatch = upsellMappings[purchasedCategory];
    const title = isDirectMatch ? "Complete the Look" : "Offers You Might Love";

    return { items: shuffled, title };
  }, [purchasedCategory]);

  const handleAddToOrder = (item) => {
    if (isExpired) {
      toast.error("Offer has expired! But you can still add this product to your next order.");
      return;
    }

    const { effective: sp, base: mrp } = getPrices(item);

    dispatch(addToCart({
      uuid: item.uuid || item._id || item.id,
      variantId: item.variants?.[0]?.variantId || item.variants?.[0]?._id || "default",
      title: item.title || item.productTittle,
      sellingPrice: Math.round(sp * 0.9), // 10% Extra VIP discount
      mrp: mrp,
      image: item.images?.[0] || item.variants?.[0]?.variantImage?.[0] || "/placeholder.png",
      quantity: 1,
      stockQuantity: item.stock_quantity || item.variants?.[0]?.variantQuantity || 50,
    }));

    toast.success("Offer product added to your bag!");
    navigate("/bag");
  };

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-12 bg-gradient-to-br from-[#1C3753] to-[#0A1A2B] rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-2xl border border-white/10">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D49A06]/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#D49A06] text-[#1C3753] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce">
              
              </span>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                {dynamicTitle} <Zap className="w-6 h-6 text-[#D49A06] fill-[#D49A06]" />
              </h2>
            </div>
            <p className="text-blue-100/80 max-w-xl text-sm md:text-base">
              Hand-picked accessories and pairings that perfectly complement your new purchase. 
              Add now to unlock <span className="text-[#D49A06] font-bold">Free Shipping</span> on these items!
            </p>
          </div>

          {/* Timer Section */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center min-w-[160px]">
            <div className="flex items-center gap-2 text-[#D49A06] mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Limited Time Offer</span>
            </div>
            <div className={`text-3xl font-mono font-bold ${isExpired ? "text-gray-500" : "text-white"}`}>
              {isExpired ? "00:00" : formatTime(timeLeft)}
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#D49A06] to-yellow-300"
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / 300) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <AnimatePresence>
            {recommendations.map((item, idx) => {
              const { base, effective } = getPrices(item);
              return (
                <motion.div 
                  key={item._id || item.uuid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                    <img 
                      src={item.images?.[0] || item.variants?.[0]?.variantImage?.[0] || "/placeholder.png"} 
                      alt={item.title || item.productTittle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {!isExpired && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                        <Zap className="w-3 h-3 fill-white" /> -10% OFF
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1">{item.title || item.productTittle}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold text-white">₹{Math.round(effective * 0.9)}</span>
                      <span className="text-sm text-white/40 line-through">₹{base}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAddToOrder(item)}
                    disabled={isExpired}
                    className={`mt-4 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      isExpired 
                      ? "bg-gray-700 cursor-not-allowed text-gray-400" 
                      : "bg-white text-[#1C3753] hover:bg-[#D49A06] hover:text-[#1C3753] shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[#D49A06]/30"
                    }`}
                  >
                    {isExpired ? "Deal Expired" : "Add to Order"} <Plus className="w-5 h-5" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-blue-100/40">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Secure Order
          </div>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" /> Instant Approval
          </div>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> Valid for 5 Minutes
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteTheLook;
