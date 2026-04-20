import { useEffect, useState } from "react";
import { useAnimation, motion } from "framer-motion";
import { useNavigate } from "react-router";
import banner from "../../data/banner.json";

function Design() {
  const navigate = useNavigate();
  const product1 = banner[0];
  const product2 = banner[1];
  const product3 = banner[2];

  const controls = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  // Helper function to create a constant looping animation
  const startConstantLoop = async (controls, imageCount, duration = 2500) => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % imageCount;
      controls.start({
        x: `-${index * 100}%`,
        transition: { duration: 0.8, ease: "easeInOut" },
      });
    }, duration);
    return interval;
  };

  useEffect(() => {
    // Constant loop for all three sliders
    const interval1 = startConstantLoop(controls, product1.image.length, 3000);
    const interval2 = startConstantLoop(controls2, product2.image.length, 3500);
    const interval3 = startConstantLoop(controls3, product3.image.length, 4000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
    };
  }, [controls, controls2, controls3]);

  return (
    <section className="lg:px-20 md:px-16 px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-4 lg:h-[600px]">
        
        {/* Main Feature Slider (Left) */}
        <div className="relative group overflow-hidden w-full lg:w-1/2 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-500">
          <motion.div animate={controls3} className="min-w-full flex h-full">
            {product3.image.map((img, i) => (
              <div className="w-full flex-shrink-0" key={i}>
                <img
                  className="w-full h-[350px] md:h-[500px] lg:h-full object-cover object-top"
                  src={img}
                  alt="Feature"
                />
              </div>
            ))}
          </motion.div>
          {/* Constant Glassmorphism Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-5 rounded-lg border border-white/20 shadow-xl">
            <h2 className="text-xl md:text-2xl text-gray-700 font-sans font-semibold tracking-tight">
              {product3.title}
            </h2>
            <p className="text-sm md:text-base text-gray-700 mt-1 line-clamp-2">
              {product3.description}
            </p>
          </div>
        </div>

        {/* Right Column Grid */}
        <div className="flex flex-col w-full lg:w-1/2 gap-4">
          <div className="grid grid-cols-2 h-[60%] gap-4">
            
            {/* Small Slider 1 */}
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              <motion.div animate={controls} className="min-w-full h-full flex">
                {product1.image.map((img, i) => (
                  <div className="w-full h-full flex-shrink-0" key={i}>
                    <img className="object-cover w-full h-full" src={img} alt="Trending" />
                  </div>
                ))}
              </motion.div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <h3 className="text-white text-sm md:text-lg font-medium">{product1.title}</h3>
              </div>
            </div>

            {/* Small Slider 2 */}
            <div className="relative overflow-hidden rounded-xl bg-[#D5E5F5]">
              <motion.div animate={controls2} className="min-w-full h-full flex">
                {product2.image.map((img, i) => (
                  <div className="w-full h-full flex-shrink-0" key={i}>
                    <img className="object-cover w-full h-full" src={img} alt="New" />
                  </div>
                ))}
              </motion.div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <h3 className="text-white text-sm md:text-lg font-medium">{product2.title}</h3>
              </div>
            </div>
          </div>

          {/* Bottom Call-to-Action Card */}
         {/* Bottom Call-to-Action Card */}
<div className="relative h-[40%] bg-[#1C3753] text-white rounded-xl px-8 py-6 flex flex-col justify-center overflow-hidden">
  {/* Subtle background decoration */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
  
  <h2 className="text-2xl md:text-3xl font-sans font-bold leading-tight">
    Elevate Your Wardrobe
  </h2>
  
  {/* Corrected Paragraph: Removed max-w-md and added md:whitespace-nowrap for desktop */}
  <p className="text-blue-100/80 text-sm md:text-base mt-2 w-full md:whitespace-nowrap">
    Precision-tailored designs crafted with sharp detail and refined finishes, built to elevate your daily style.
  </p>


</div>
        </div>
      </div>
    </section>
  );
}

export default Design;