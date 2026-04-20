import React, { useEffect, useState } from "react";
// import products from "../data/products.json";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Filter from "../components/Filter";
import Footer from "../sections/Footer";
import Categories from "../components/Categories";
import FilterProducts from "../components/FilterProducts";
import axiosInstance from "../api/axiosInstance";
import products from "../data/products.json";
import { Sparkles } from "lucide-react";
// const newProducts = [...products].reverse();

function NewProducts() {
  const [items, setItems] = useState([]);
  const [param, setParam] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const categoryCount = new Set(items.map((p) => p.category).filter(Boolean)).size;

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await axiosInstance.get("/products/all");
  //       //  console.log("PRODUCTS:", res.data);
  //       setItems(res.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //       setError("Failed to load products.");
  //       setLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, []);
useEffect(() => {
    // Agar tum chaho to yahan reverse logic laga sakte ho latest products ke liye
    const newProducts = [...products].reverse();
    setItems(newProducts);
  }, []);


  const sort = (val) => {
    setItems((prev) => {
      const sorted = [...prev];
      switch (val) {
        case "recommended":
          return [...products].reverse();
        case "high":
        case "price_high":
          return sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);

        case "low":
        case "price_low":
          return sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);

        case "atoz":
        case "alphabetical_asc":
          return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case "ztoa":
        case "alphabetical_desc":
          return sorted.sort((a, b) => b.title.localeCompare(a.title));

        case "rating":
        case "rating_high":
          return sorted.sort((a, b) => {
            const avgA =
              a.reviews?.reduce((sum, r) => sum + r.rating, 0) /
                a.reviews?.length || 0;
            const avgB =
              b.reviews?.reduce((sum, r) => sum + r.rating, 0) /
                b.reviews?.length || 0;

            return avgB - avgA;
          });
        case "rating_low":
          return sorted.sort((a, b) => {
            const avgA =
              a.reviews?.reduce((sum, r) => sum + r.rating, 0) /
                a.reviews?.length || 0;
            const avgB =
              b.reviews?.reduce((sum, r) => sum + r.rating, 0) /
                b.reviews?.length || 0;

            return avgA - avgB;
          });

        case "latest":
          return sorted.reverse(); 

        default:
          return prev;
      }
    });
    // switch (val) {
    //   case "high":
    //     setItems((prev) => [...prev].sort((a, b) => b.basePrice - a.basePrice));
    //     break;
    //   case "low":
    //     setItems((prev) => [...prev].sort((a, b) => a.basePrice - b.basePrice));
    //     break;
    //   case "atoz":
    //     setItems((prev) =>
    //       [...prev].sort((a, b) => a.title.localeCompare(b.title))
    //     );
    //     break;
    //   case "rating":
    //     return setItems((prev) =>
    //       [...prev].sort((a, b) => {
    //         const avgB =
    //           b.reviews && b.reviews.length > 0
    //             ? b.reviews.reduce((sum, r) => sum + r.rating, 0) /
    //               b.reviews.length
    //             : 0;

    //         const avgA =
    //           a.reviews && a.reviews.length > 0
    //             ? a.reviews.reduce((sum, r) => sum + r.rating, 0) /
    //               a.reviews.length
    //             : 0;

    //         return avgB - avgA;
    //       })
    //     );

    //   case "latest":
    //     setItems(newProducts);
    //     break;
    //   default:
    //     break;
    // }
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs title={"Latest Products"}></Breadcrumbs>
      <section className="lg:px-20 md:px-[60px] px-4 pb-[23px] bg-gray-50">
        <div className="relative overflow-hidden rounded-2xl border border-[#D5E5F5] bg-gradient-to-r from-[#EAF3FC] via-white to-[#F5F9FE] px-5 md:px-8 py-6 mb-5 shadow-sm">
          <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-[#1C3753]/8 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[#2C87E2]/10 blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2C87E2] font-semibold flex items-center gap-1">
                <Sparkles size={14} /> Fresh Drop
              </p>
              <h2 className="text-2xl md:text-3xl font-serif text-[#1C3753] mt-1">
                New Products Collection
              </h2>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Handpicked latest styles curated for modern wardrobes.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/80 border border-[#D5E5F5] rounded-xl px-4 py-2 text-center min-w-[90px]">
                <p className="text-xs text-gray-500">Products</p>
                <p className="text-lg font-bold text-[#1C3753]">{items.length}</p>
              </div>
              <div className="bg-white/80 border border-[#D5E5F5] rounded-xl px-4 py-2 text-center min-w-[90px]">
                <p className="text-xs text-gray-500">Categories</p>
                <p className="text-lg font-bold text-[#1C3753]">{categoryCount}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5EDF6] shadow-sm px-2 md:px-4 py-3">
          <FilterProducts text={"Latest Products"} sort={sort} />

          <div className="flex lg:gap-6 items-start">
          {/* <div className="sticky top-4">
          </div> */}
            {loading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : items.length > 0 ? (
              <Card cardData={items} />
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default NewProducts;
