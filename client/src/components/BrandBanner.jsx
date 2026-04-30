import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const features = [
  { icon: ShieldCheck, text: "100% Authentic" },
  { icon: Truck, text: "Fast Delivery" },
  { icon: RotateCcw, text: "Easy Returns" }
];

const BrandBanner = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center border-y border-gray-200 overflow-hidden bg-white">
      {/* Top Premium Strip */}
      <div className="w-full bg-gradient-to-r from-[#0a1b2c] via-[#1C3753] to-[#0a1b2c] py-5 px-4 text-center relative overflow-hidden">
        {/* Decorative subtle stars */}
        <motion.div 
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }} 
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute left-[10%] top-1/2 -translate-y-1/2 text-white/20 hidden md:block"
        >
          <Star size={32} fill="currentColor" />
        </motion.div>
        <motion.div 
          animate={{ opacity: [0.8, 0.3, 0.8], scale: [1.1, 1, 1.1] }} 
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute right-[10%] top-1/2 -translate-y-1/2 text-white/20 hidden md:block"
        >
          <Star size={24} fill="currentColor" />
        </motion.div>

        <h2 className="text-[#D5E5F5] text-xl md:text-3xl font-serif font-bold tracking-[0.2em] uppercase relative z-10 flex items-center justify-center gap-4">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D5E5F5] hidden sm:block"></span>
          Aura Indian Brand
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D5E5F5] hidden sm:block"></span>
        </h2>
      </div>
      
      {/* Bottom Features & Trust Strip */}
      <div className="w-full bg-gradient-to-b from-gray-50 to-white py-10 px-4 text-center shadow-inner relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left: Trust features */}
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap lg:w-1/2">
            {features.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 group cursor-default">
                <div className="p-4 rounded-full bg-[#E8F0F8] text-[#1C3753] group-hover:bg-[#1C3753] group-hover:text-white group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <item.icon size={26} strokeWidth={1.5} />
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-600 tracking-wide uppercase">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Right: Happy Customers Card */}
          <div className="lg:w-1/2 flex flex-col items-center lg:items-end justify-center w-full">
             <motion.div 
               initial={{ opacity: 0, y: 15 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.7, ease: "easeOut" }}
               className="bg-white border border-gray-100 shadow-2xl shadow-[#1C3753]/10 rounded-3xl py-8 px-12 relative overflow-hidden group w-full sm:w-auto"
             >
               {/* Animated top border */}
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#D5E5F5] via-[#1C3753] to-[#D5E5F5] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out"></div>
               
               <p className="text-gray-500 text-lg md:text-xl font-medium tracking-wide">
                 Trusted by Over
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
                 <p className="text-[#1C3753] text-5xl md:text-7xl font-extrabold tracking-tight">
                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1C3753] to-[#4A729A]">
                     6 Million
                   </span>
                 </p>
                 <motion.div
                   animate={{ rotate: [0, 15, -15, 0] }}
                   transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                 >
                   <span className="text-3xl md:text-5xl text-amber-400 drop-shadow-sm">✦</span>
                 </motion.div>
               </div>
               <p className="text-[#1C3753]/80 font-bold tracking-[0.2em] uppercase mt-4 text-sm md:text-base">
                 Happy Customers Worldwide
               </p>
             </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BrandBanner;
