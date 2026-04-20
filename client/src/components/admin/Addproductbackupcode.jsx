import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct } from "../../redux/cart/productSlice";
import { v4 as uuidv4 } from "uuid";
import product from "../../data/products.json";
import imageCompression from "browser-image-compression";
import { IoIosArrowForward } from "react-icons/io";
import { FiUpload } from "react-icons/fi";

import { ChevronDown, ChevronLeft, Trash } from "lucide-react";
import { data, Link } from "react-router";
// import AddCategoryPopUp from "./AddCategoryPopUp";
// import AddSubCategoryPopup from "./AddSubCategoryPopup";
// import DisplayVariantImg from "./DisplayVariantImg";

const AddProduct = () => {
 const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);
  const { uuid } = useParams();

  // ✅ WOMEN'S SHOP — Categories & Subcategories
  const [categories, setCategories] = useState([
    "Dresses",
    "Tops",
    "Jeans & Pants",
    "Co-ord Sets",
    "Ethnic Wear",
    "Winterwear",
    "Accessories",
  ]);

  const [subCategories, setSubCategories] = useState({
    Dresses: ["Maxi Dress", "Midi Dress", "Mini Dress", "Evening Gown", "Wrap Dress", "Shirt Dress"],
    Tops: ["Blouse", "Crop Top", "Shirt", "Knitwear", "Tank Top", "Corset Top"],
    "Jeans & Pants": ["Skinny Jeans", "Wide Leg", "Trousers", "Palazzos", "Shorts", "Joggers"],
    "Co-ord Sets": ["Casual Set", "Formal Set", "Printed Set", "Loungewear Set"],
    "Ethnic Wear": ["Kurta", "Saree", "Lehenga", "Salwar Suit", "Dupatta"],
    Winterwear: ["Sweater", "Hoodie", "Jacket", "Coat", "Cardigan"],
    Accessories: ["Jewellery", "Handbag", "Belt", "Scarf", "Hair Accessories"],
  });

  // ✅ WOMEN'S SHOP — Fit types (replaces "Framed/Unframed")
  const variantsType = [
    "Regular Fit",
    "Slim Fit",
    "Oversized",
    "Relaxed Fit",
    "Bodycon",
  ];

  // ✅ WOMEN'S SHOP — Fashion colors
  const colors = [
    "Black", "White", "Ivory", "Cream", "Beige", "Nude",
    "Rose Pink", "Dusty Pink", "Hot Pink", "Red", "Burgundy",
    "Maroon", "Coral", "Orange", "Yellow", "Mustard", "Olive",
    "Mint Green", "Sage Green", "Forest Green", "Sky Blue",
    "Royal Blue", "Navy Blue", "Lavender", "Purple", "Lilac",
    "Teal", "Turquoise", "Brown", "Tan", "Charcoal", "Grey",
    "Gold", "Silver", "Multi-color", "Printed",
  ];

  // ✅ WOMEN'S SHOP — Badge & Tag options
  const badgeOptions = [
    "New Arrival", "Bestseller", "Trending", "Featured",
    "Limited Edition", "Premium", "Sale", "Exclusive", "Festival Special",
  ];

  const tagOptions = [
    "Party Wear", "Casual", "Office Wear", "Festival Special",
    "Best Value", "Hot Selling", "Exclusive", "Bridal",
    "Summer Special", "Winter Special",
  ];

  // ✅ Material options for fashion
  const materialOptions = [
    "Cotton", "Silk", "Linen", "Polyester", "Denim",
    "Chiffon", "Georgette", "Rayon", "Velvet", "Satin",
    "Wool", "Lycra", "Net", "Organza",
  ];

  const [formData, setFormData] = useState({
    uuid: uuidv4(),
    productTittle: "",
    description: "",
    status: "ACTIVE",
    returnPolicy: false,
    images: [],
    SKU: "",
    stockQuantity: "",
    ReorderLimit: "",
    type: "",          // Fit Type (Regular Fit / Slim Fit etc.)
    color: "",
    ProductDimensionWidth: "",
    ProductDimensionHeight: "",
    category: "",
    subcategory: "",
    materialType: "",
    isFestive: false,
    productBadge: "",
    productTags: [],
    mrp: "",
    sellingPrice: "",
    costPrice: "",
    profit: "",
    discountPercent: "",
    discountAmount: "",
    taxPercent: "",
    hasVariants: false,
    variants: [
      {
        variantId: uuidv4(),
        variantColor: "",
        variantSize: "",       // S / M / L / XL / XXL
        variantFabric: "",     // Cotton, Silk etc.
        variantFitType: "",    // Regular Fit, Slim Fit etc.
        variantSkuId: "",
        variantStockQuantity: "",
        variantReorderLimit: "",
        variantMrp: "",
        variantSellingPrice: "",
        variantCostPrice: "",
        variantProfit: "",
        variantDiscount: "",
        variantImage: [],
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showsubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Variant modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState("");
  const [activeVariantIndex, setActiveVariantIndex] = useState(null);
  const [itemsOpenvar, setItemsOpenVar] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [savedVariants, setSavedVariants] = useState([]);
  const [variantTypeOpen, setVariantTypeOpen] = useState(null);

  // Dropdown states
  const [categoriesopen, setCategoriesOpen] = useState(false);
  const [opengstbosx, setOpenGstBox] = useState(false);

  const gstRateList = ["GST 0%", "GST 5%", "GST 12%", "GST 18%"];

  // Refs for auto-close dropdowns
  const dropdownRefCategory = useRef(null);
  const dropdownRefSubCategory = useRef(null);
  const dropdownRefTag = useRef(null);
  const dropdownRefMateral = useRef(null);

  useEffect(() => {
    const handlers = [
      [dropdownRefCategory, () => setCategoriesOpen(false)],
      [dropdownRefSubCategory, () => {}],
      [dropdownRefTag, () => {}],
      [dropdownRefMateral, () => {}],
    ];
    const listeners = handlers.map(([ref, fn]) => {
      const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) fn(); };
      document.addEventListener("mousedown", handler);
      return handler;
    });
    return () => {
      listeners.forEach((handler) => document.removeEventListener("mousedown", handler));
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────

  const handleButtonClick = () => fileInputRef.current.click();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updated = { ...formData, [name]: type === "checkbox" ? checked : value };

    // ✅ Auto SKU from product title
    if (name === "productTittle") {
      const words = value.trim().split(" ");
      const initials = words.slice(0, 3).map((w) => w[0]?.toUpperCase()).join("");
      const randomNum = Math.floor(100 + Math.random() * 900);
      const sku = `${initials}-WS-${randomNum}`; // WS = Women's Shop
      updated.SKU = sku;
      updated.uuid = sku.toLowerCase();
      updated.route = `/product/${sku.toLowerCase()}`;
      updated.variants = updated.variants.map((v, i) =>
        i === 0 ? { ...v, variantSkuId: sku } : v
      );
    }

    // ✅ Discount auto-calc
    const mrp = parseFloat(updated.mrp) || 0;
    const sellingPrice = parseFloat(updated.sellingPrice) || 0;
    const costPrice = parseFloat(updated.costPrice) || 0;

    if (mrp > 0 && sellingPrice > 0 && sellingPrice <= mrp) {
      const discountAmount = mrp - sellingPrice;
      updated.discountAmount = discountAmount.toFixed(2);
      updated.discountPercent = ((discountAmount / mrp) * 100).toFixed(2);
    } else {
      updated.discountAmount = "";
      updated.discountPercent = "";
    }

    // ✅ Profit auto-calc
    if (sellingPrice > 0 && costPrice > 0) {
      updated.profit = (sellingPrice - costPrice).toFixed(2);
    } else {
      updated.profit = "";
    }

    setFormData(updated);
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (!value || formData.productTags.includes(value)) return;
    setFormData((prev) => ({ ...prev, productTags: [...prev.productTags, value] }));
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      productTags: prev.productTags.filter((t) => t !== tagToRemove),
    }));
  };

  function blobToFile(blob, name) {
    return new File([blob], name, { type: blob.type });
  }

  const handleFileChange = async (e) => {
    let files = Array.from(e.target.files).filter((f) =>
      ["image/png","image/jpeg","image/jpg","image/webp","image/svg+xml"].includes(f.type)
    );

    if (formData.images.length + files.length > 10) {
      alert("Max 10 images allowed");
      return;
    }

    const compressed = [];
    for (let file of files) {
      const blob = await imageCompression(file, { maxSizeMB: 2, maxWidthOrHeight: 2000, useWebWorker: true });
      const f = blobToFile(blob, file.name);
      f.preview = URL.createObjectURL(f);
      compressed.push(f);
    }

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...compressed] }));
    e.target.value = "";
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const variants = [...prev.variants];
      const v = { ...variants[index], [field]: value };
      const mrp = Number(v.variantMrp) || 0;
      const cost = Number(v.variantCostPrice) || 0;

      if (field === "variantDiscount") {
        const discount = Number(value);
        if (mrp > 0 && discount >= 0 && discount <= 100) {
          v.variantSellingPrice = (mrp * (1 - discount / 100)).toFixed(2);
          v.variantDiscount = discount.toFixed(2);
        }
      }

      if (field === "variantSellingPrice") {
        const selling = Number(value);
        if (mrp > 0 && selling > 0 && selling <= mrp) {
          v.variantDiscount = (((mrp - selling) / mrp) * 100).toFixed(2);
        }
      }

      const selling = Number(v.variantSellingPrice) || 0;
      v.variantProfit = selling > 0 && cost > 0 ? (selling - cost).toFixed(2) : "";

      variants[index] = v;
      return { ...prev, variants };
    });
  };

  const handleVariantImageChange = async (e, index) => {
    let files = Array.from(e.target.files);
    const compressed = [];

    for (let file of files) {
      const blob = await imageCompression(file, { maxSizeMB: 2, maxWidthOrHeight: 2000, useWebWorker: true });
      const f = blobToFile(blob, file.name);
      f.preview = URL.createObjectURL(f);
      compressed.push(f);
    }

    setFormData((prev) => {
      const variants = [...prev.variants];
      const existing = variants[index].variantImage || [];
      const unique = compressed.filter(
        (f) => !existing.some((img) => img.name === f.name && img.size === f.size)
      );
      variants[index].variantImage = [...existing, ...unique].slice(0, 10);
      return { ...prev, variants };
    });
    e.target.value = "";
  };

  const removeVariantImage = (variantIndex, imgIndex) => {
    setFormData((prev) => {
      const variants = [...prev.variants];
      if (!variants[variantIndex]) return prev;
      variants[variantIndex].variantImage = [...variants[variantIndex].variantImage];
      variants[variantIndex].variantImage.splice(imgIndex, 1);
      return { ...prev, variants };
    });

    setSelectedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== imgIndex);
      if (newImages.length > 0) {
        const nextIdx = imgIndex < newImages.length ? imgIndex : newImages.length - 1;
        const next = newImages[nextIdx];
        setCurrentImage(typeof next === "string" ? next : next.preview || URL.createObjectURL(next));
      } else {
        setIsModalOpen(false);
      }
      return newImages;
    });
  };

  const addVariant = () => {
    setEditingVariant({
      variantColor: "", variantSize: "", variantFabric: "",
      variantFitType: "", variantSkuId: "", variantStockQuantity: "",
      variantReorderLimit: "", variantMrp: "", variantSellingPrice: "",
      variantCostPrice: "", variantProfit: "", variantDiscount: "",
      variantImage: [],
    });
    setItemsOpenVar(true);
  };

  const removeVariant = (index) => {
    setSavedVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveVariant = (index) => {
    const variant = formData.variants[index];
    if (!variant.variantSkuId || !variant.variantSellingPrice) {
      alert("Please fill SKU and Selling Price");
      return;
    }
    setSavedVariants((prev) => [...prev, variant]);
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
    setItemsOpenVar((prev) => (formData.variants.length - 1 === 0 ? false : prev));
  };

  const generatedSKU = () => {
    const title = formData.productTittle?.trim() || "";
    if (title.length < 3) {
      toast.error("Enter product title first!", { position: "top-right", autoClose: 2000 });
      return;
    }
    const prefix = title.substring(0, 3).toUpperCase();
    const randomNum = String(Math.floor(Math.random() * 999)).padStart(3, "0");
    const newSKU = `${prefix}-WS-${randomNum}`; // ✅ WS = Women's Shop
    setFormData((prev) => ({ ...prev, SKU: newSKU }));
  };

  const generateVariantSKU = (variantIndex) => {
    const productSKU = formData.SKU?.trim();
    if (!productSKU) {
      toast.error("Generate product SKU first!", { position: "top-right", autoClose: 2000 });
      return;
    }
    const randomNum = Math.floor(100 + Math.random() * 900);
    const variantSKU = `${productSKU}-V-${randomNum}`;
    setFormData((prev) => {
      const variants = [...prev.variants];
      variants[variantIndex] = { ...variants[variantIndex], variantSkuId: variantSKU };
      return { ...prev, variants };
    });
  };

  const handleSaveDraft = () => {
    setFormData((prev) => ({ ...prev, status: "DRAFT" }));
    handleSubmit({ preventDefault: () => {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productTittle?.trim() || !formData.category) {
      toast.error("Please fill in all required fields!", {
        position: "top-right", autoClose: 2000,
        className: "bg-red-700 text-white rounded-lg",
      });
      return;
    }

    setIsSubmitting(true);

    const formDataWithUUID = {
      ...formData,
      uuid: formData.uuid || uuidv4(),
      variants: formData.variants.map((v) => ({
        ...v, variantId: v.variantId || uuidv4(),
      })),
    };

    const formDataObj = new FormData();

    Object.entries(formDataWithUUID).forEach(([key, value]) => {
      if (key === "variants") return;
      if (key === "productTags") {
        value.forEach((tag) => formDataObj.append("productTags", tag));
        return;
      }
      if (value === undefined || value === null) return;
      formDataObj.append(key, value);
    });

    // ✅ Send variants as JSON string
    formDataObj.append("variants", JSON.stringify(
      formDataWithUUID.variants.map((v) => ({ ...v, variantImage: [] }))
    ));

    // ✅ Send variant images separately
    formDataWithUUID.variants.forEach((v, i) => {
      (v.variantImage || []).forEach((file) => {
        formDataObj.append(`variantImages_${i}`, file);
      });
    });

    // ✅ Send product images
    formData.images.forEach((file) => {
      formDataObj.append("images", file);
    });

    try {
      await axiosInstance.post("/products/add-product", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(isEditing ? "Product updated!" : "Product added successfully!", {
        position: "top-right", autoClose: 2000,
        className: "bg-[#EEFFEF] text-black rounded-lg",
      });

      localStorage.setItem("addProductForm", JSON.stringify(formDataWithUUID));
      setTimeout(() => navigate("/admin/products"), 800);
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
      toast.error("Error uploading product!", {
        position: "top-right", autoClose: 2000,
        className: "bg-red-700 text-white rounded-lg",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── JSX ───────────────────────────────────────────────────────

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl px-6 py-4 flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-rose-500 animate-spin" />
            <p className="text-sm font-medium text-gray-800">Uploading product, please wait...</p>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <AddCategoryPopUp
          setNewCategory={setNewCategory}
          newCategory={newCategory}
          setShowCategoryModal={setShowCategoryModal}
          categories={categories}
          setCategories={setCategories}
          subcategories={subCategories}
          setSubcategories={setSubCategories}
          setFormData={setFormData}
        />
      )}

      {showsubCategoryModal && (
        <AddSubCategoryPopup
          setShowSubCategoryModal={setShowSubCategoryModal}
          setNewCategory={setNewCategory}
          newCategory={newCategory}
          setShowCategoryModal={setShowCategoryModal}
          categories={categories}
          setCategories={setCategories}
          subcategories={subCategories}
          setSubcategories={setSubCategories}
          setFormData={setFormData}
        />
      )}

      <DisplayVariantImg
        isModalOpen={isModalOpen}
        selectedImages={selectedImages}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
        setIsModalOpen={setIsModalOpen}
        variantIndex={activeVariantIndex}
        onRemoveImage={removeVariantImage}
      />

      <form
        className="p-6 bg-[#F6F8F9] min-h-screen"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between h-16 w-full rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Link to="/admin/products">
              <ChevronLeft className="w-8 h-8 text-[#686868]" />
            </Link>
            <h1 className="text-[#1C1C1C] text-[20px] font-medium">Add Product</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="py-1.5 px-4 rounded border border-[#737373] text-[#737373] hover:bg-gray-200 bg-[#F6F8F9] text-sm font-medium"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="py-1.5 px-4 rounded border border-[#737373] text-[#737373] hover:bg-gray-200 bg-[#F6F8F9] text-sm font-medium disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-1.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium disabled:opacity-50 transition"
            >
              {isSubmitting ? "Uploading..." : isEditing ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>

        {/* ── Section 1: Basic Details + Image Upload ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Basic Details */}
          <div className="bg-white rounded-2xl border p-4 flex flex-col">
            <h2 className="text-[18px] font-medium mb-4">Basic Details</h2>
            <div className="flex flex-col gap-5 flex-1">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <label className="text-sm text-black">Product Name</label>
                  <span className="text-rose-500">*</span>
                </div>
                <input
                  type="text"
                  name="productTittle"
                  value={formData.productTittle}
                  onChange={handleChange}
                  placeholder="e.g. Floral Midi Wrap Dress"
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 text-sm bg-[#F8FAFB] text-[#686868] placeholder-[#686868] focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm text-black mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product — fabric, occasion, styling tips..."
                  className="w-full flex-1 min-h-[120px] border border-[#D0D0D0] rounded-lg px-3 py-2 text-sm bg-[#F8FAFB] text-[#686868] placeholder-[#686868] focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl p-4 border">
            <h2 className="text-[16px] font-medium mb-3">Product Images</h2>

            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {formData.images.slice(0, 5).map((img, index) => {
                  const imgSrc = typeof img === "string" ? img : img.preview || URL.createObjectURL(img);
                  const remaining = formData.images.length - 5;
                  return (
                    <div key={index} className="relative w-[110px] h-[110px] rounded-lg overflow-hidden border border-neutral-200 bg-pink-50">
                      <img src={imgSrc} alt={`preview-${index}`} className="w-full h-full object-cover" />
                      {index === 4 && remaining > 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
                          +{remaining}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {formData.images.length === 0 && (
              <div className="bg-[#F8FAFB] border border-dashed border-rose-200 h-[220px] rounded-lg flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="px-4 py-2 flex items-center gap-2 border border-rose-300 text-rose-600 rounded-lg bg-white hover:bg-rose-50 text-sm transition"
                >
                  <FiUpload className="w-4 h-4" /> Upload Images
                </button>
                <div className="text-center text-[#686868] text-xs">
                  <p>Max 10 images · Max 2MB each</p>
                  <p>PNG, JPG, JPEG, WEBP accepted</p>
                </div>
              </div>
            )}

            {formData.images.length > 0 && (
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="px-4 py-2 border border-rose-400 text-rose-600 rounded-lg text-sm hover:bg-rose-50 transition"
                >
                  + Upload More Images
                </button>
                <p className="text-xs text-gray-400">PNG, JPG, JPEG, WEBP · Max 2MB</p>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.webp,.svg" multiple onChange={handleFileChange} className="hidden" />
          </div>

          {/* ── Product Classification ── */}
          <div className="bg-white rounded-2xl p-4 border">
            <h2 className="text-[18px] font-medium mb-4">Product Classification</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category */}
              <div>
                <label className="block text-sm mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "__add_category__") {
                      setShowCategoryModal(true);
                      setFormData((prev) => ({ ...prev, category: "", subcategory: "" }));
                      return;
                    }
                    setFormData((prev) => ({ ...prev, category: val, subcategory: "" }));
                  }}
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 text-sm bg-[#F8FAFB] focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  <option value="__add_category__">+ Add Category</option>
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm mb-1">Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "__add_subcategory__") {
                      if (!formData.category) { toast.error("Select category first!"); return; }
                      setShowSubCategoryModal(true);
                      setFormData((prev) => ({ ...prev, subcategory: "" }));
                      return;
                    }
                    setFormData((prev) => ({ ...prev, subcategory: val }));
                  }}
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 text-sm bg-[#F8FAFB] focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  <option value="">Select subcategory</option>
                  {(subCategories[formData.category] || []).map((s) => <option key={s} value={s}>{s}</option>)}
                  <option value="__add_subcategory__">+ Add Subcategory</option>
                </select>
              </div>

              {/* Material */}
              <div>
                <label className="block text-sm mb-1">Material</label>
                <select
                  name="materialType"
                  value={formData.materialType}
                  onChange={handleChange}
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 text-sm bg-[#F8FAFB] focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  <option value="">Select material</option>
                  {materialOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Fit Type (replaces "Frame Type") */}
              <div ref={dropdownRefCategory}>
                <div className="relative">
                  <label className="block text-sm mb-1">Fit Type</label>
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((p) => !p)}
                    className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-4 flex items-center justify-between bg-[#F8FAFB] text-sm text-[#6B6B6B] focus:outline-none"
                  >
                    <span>{formData.type || "Select fit type"}</span>
                    <ChevronDown size={18} className={`transition-transform ${categoriesopen ? "rotate-180" : ""}`} />
                  </button>
                  {categoriesopen && (
                    <ul className="absolute z-20 mt-1 w-full border rounded-lg bg-white shadow-md text-sm">
                      {variantsType.map((opt) => (
                        <li
                          key={opt}
                          onClick={() => { setFormData((p) => ({ ...p, type: opt })); setCategoriesOpen(false); }}
                          className={`px-4 py-2 cursor-pointer hover:bg-pink-50 ${formData.type === opt ? "text-rose-600 font-medium bg-pink-50" : "text-[#6B6B6B]"}`}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-sm mb-1">Product Badge</label>
                <select
                  name="productBadge"
                  value={formData.productBadge}
                  onChange={handleChange}
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 text-sm bg-[#F8FAFB] focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  <option value="">Select badge</option>
                  {badgeOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Festive toggle */}
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="checkbox"
                  id="isFestive"
                  name="isFestive"
                  checked={!!formData.isFestive}
                  onChange={handleChange}
                  className="h-4 w-4 accent-rose-500"
                />
                <label htmlFor="isFestive" className="text-sm text-gray-700">
                  Mark as Festive / Occasion Wear
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-5">
              <label className="block text-sm mb-1">Product Tags</label>
              <select
                onChange={handleTagChange}
                defaultValue=""
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 text-sm bg-[#F8FAFB] focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option value="">Select tag</option>
                {tagOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {formData.productTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.productTags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-pink-50 text-rose-600 border border-rose-200 px-3 py-1 rounded-full text-xs">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-rose-400 hover:text-rose-600 font-bold">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Product Details (SKU, Stock etc.) ── */}
          <div className="bg-white rounded-2xl p-4 border">
            <h2 className="text-[18px] font-medium mb-4">Product Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* SKU */}
              <div>
                <label className="block text-sm mb-1">
                  SKU ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="SKU"
                    value={formData.SKU}
                    onChange={handleChange}
                    placeholder="Auto-generated or enter manually"
                    className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 pr-28 bg-[#F8FAFB] text-sm text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                  <button
                    type="button"
                    onClick={generatedSKU}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-[32px] px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-md transition"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm mb-1">Total Stock</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 focus:outline-none"
                />
              </div>

              {/* Reorder */}
              <div>
                <label className="block text-sm mb-1">Reorder Limit</label>
                <input
                  type="number"
                  name="ReorderLimit"
                  value={formData.ReorderLimit}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 focus:outline-none"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm mb-1">Primary Color</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 text-sm bg-[#F8FAFB] focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  <option value="">Select color</option>
                  {colors.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Dimensions (chest/waist for fashion) */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Measurements (optional)</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="ProductDimensionWidth"
                    value={formData.ProductDimensionWidth}
                    onChange={handleChange}
                    placeholder="Chest / Width (in)"
                    className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="ProductDimensionHeight"
                    value={formData.ProductDimensionHeight}
                    onChange={handleChange}
                    placeholder="Length / Height (in)"
                    className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pricing ── */}
        <div className="bg-white rounded-2xl p-4 mt-6 border">
          <h2 className="text-[18px] font-medium mb-4">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "MRP (₹)", name: "mrp", placeholder: "e.g. 1999" },
              { label: "Selling Price (₹)", name: "sellingPrice", placeholder: "e.g. 1499" },
              { label: "Cost Price (₹)", name: "costPrice", placeholder: "e.g. 800" },
            ].map(({ label, name, placeholder }) => (
              <div key={name}>
                <label className="block text-sm mb-1">{label}</label>
                <input
                  type="number"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-[#686868] focus:outline-none"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm mb-1">Profit (auto)</label>
              <input
                type="number"
                name="profit"
                value={formData.profit}
                readOnly
                placeholder="Auto calculated"
                className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Discount</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  placeholder="% off"
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-[#6B6B6B] focus:outline-none"
                />
                <input
                  type="text"
                  name="discountAmount"
                  value={formData.discountAmount}
                  onChange={handleChange}
                  placeholder="₹ off"
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-[#6B6B6B] focus:outline-none"
                />
              </div>
            </div>

            {/* GST */}
            <div>
              <label className="block text-sm mb-1">GST Tax Rate</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenGstBox((p) => !p)}
                  className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-4 flex items-center justify-between bg-[#F8FAFB] text-sm text-[#686868] focus:outline-none"
                >
                  <span>{formData.taxPercent || "Select GST (%)"}</span>
                  <ChevronDown size={18} className={`transition-transform ${opengstbosx ? "rotate-180" : ""}`} />
                </button>
                {opengstbosx && (
                  <ul className="absolute z-10 w-full mt-1 border rounded-lg bg-white shadow-md text-sm">
                    {gstRateList.map((p, i) => (
                      <li key={i} onClick={() => { setFormData((prev) => ({ ...prev, taxPercent: p })); setOpenGstBox(false); }}
                        className="px-4 py-2 hover:bg-pink-50 cursor-pointer">{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Saved Variants Table ── */}
        {!itemsOpenvar && savedVariants.length > 0 && (
          <div className="mb-4 mt-6 border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-white">
              <h2 className="text-base font-medium">Saved Variants</h2>
              <button type="button" onClick={addVariant}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-lg text-sm transition">
                + Add Variant
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-[#F5F8FA] text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 font-medium">Color</th>
                  <th className="px-3 py-2 font-medium">Size</th>
                  <th className="px-3 py-2 font-medium">Fit Type</th>
                  <th className="px-3 py-2 font-medium">Selling Price</th>
                  <th className="px-3 py-2 font-medium">Stock</th>
                  <th className="px-3 py-2 font-medium">Reorder</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {savedVariants.map((v, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{v.variantSkuId}</td>
                    <td className="px-3 py-2">{v.variantColor}</td>
                    <td className="px-3 py-2">{v.variantSize}</td>
                    <td className="px-3 py-2">{v.variantFitType}</td>
                    <td className="px-3 py-2">₹{v.variantSellingPrice}</td>
                    <td className="px-3 py-2">{v.variantStockQuantity}</td>
                    <td className="px-3 py-2">{v.variantReorderLimit}</td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => removeVariant(i)}
                        className="p-1.5 rounded hover:bg-red-50 transition">
                        <Trash className="w-5 h-5 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Add Variant Form ── */}
        <div className="bg-white rounded-2xl px-4 py-4 mt-6 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-medium">Variant Listings</h2>
            <button type="button" onClick={addVariant}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-lg text-sm transition">
              + Add Variant
            </button>
          </div>

          {itemsOpenvar && editingVariant && (
            <div className="mt-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="mb-8 border-b pb-6">
                  <h3 className="text-[15px] font-medium mb-4 text-gray-700">Variant {index + 1}</h3>

                  {/* Basic variant fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Color */}
                    <div>
                      <label className="block text-sm mb-1">Color</label>
                      <select
                        value={variant.variantColor || ""}
                        onChange={(e) => handleVariantChange(index, "variantColor", e.target.value)}
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm focus:outline-none focus:ring-1 focus:ring-rose-300"
                      >
                        <option value="">Select color</option>
                        {colors.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-sm mb-1">Size</label>
                      <select
                        value={variant.variantSize || ""}
                        onChange={(e) => handleVariantChange(index, "variantSize", e.target.value)}
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm focus:outline-none focus:ring-1 focus:ring-rose-300"
                      >
                        <option value="">Select size</option>
                        {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Fabric */}
                    <div>
                      <label className="block text-sm mb-1">Fabric</label>
                      <select
                        value={variant.variantFabric || ""}
                        onChange={(e) => handleVariantChange(index, "variantFabric", e.target.value)}
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm focus:outline-none focus:ring-1 focus:ring-rose-300"
                      >
                        <option value="">Select fabric</option>
                        {materialOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>

                    {/* Fit Type */}
                    <div>
                      <label className="block text-sm mb-1">Fit Type</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setVariantTypeOpen(variantTypeOpen === index ? null : index)}
                          className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-4 bg-[#F8FBFC] flex justify-between items-center text-sm text-[#686868]"
                        >
                          <span>{variant.variantFitType || "Select fit type"}</span>
                          <ChevronDown size={18} />
                        </button>
                        {variantTypeOpen === index && (
                          <ul className="absolute z-20 border mt-1 rounded-lg bg-white shadow-md w-full text-sm">
                            {variantsType.map((opt) => (
                              <li key={opt}
                                onClick={() => { handleVariantChange(index, "variantFitType", opt); setVariantTypeOpen(null); }}
                                className="px-4 py-2 hover:bg-pink-50 cursor-pointer"
                              >{opt}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* SKU */}
                    <div>
                      <label className="block text-sm mb-1">Variant SKU <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <input
                          value={variant.variantSkuId}
                          onChange={(e) => handleVariantChange(index, "variantSkuId", e.target.value)}
                          placeholder="Variant SKU"
                          className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 pr-24 bg-[#F8FAFB] text-sm focus:outline-none"
                        />
                        {index !== 0 && (
                          <button type="button" onClick={() => generateVariantSKU(index)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-[28px] px-3 bg-rose-600 text-white text-xs rounded-md">
                            Generate
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm mb-1">Stock Qty</label>
                      <input type="number" value={variant.variantStockQuantity}
                        onChange={(e) => handleVariantChange(index, "variantStockQuantity", e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 focus:outline-none"
                      />
                    </div>

                    {/* Reorder */}
                    <div>
                      <label className="block text-sm mb-1">Reorder Limit</label>
                      <input type="number" value={variant.variantReorderLimit}
                        onChange={(e) => handleVariantChange(index, "variantReorderLimit", e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Pricing row */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {[
                      { label: "MRP", field: "variantMrp", placeholder: "₹1999" },
                      { label: "Selling Price", field: "variantSellingPrice", placeholder: "₹1499" },
                      { label: "Cost Price", field: "variantCostPrice", placeholder: "₹800" },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field}>
                        <label className="block text-sm mb-1">{label}</label>
                        <input type="number" value={variant[field] || ""}
                          onChange={(e) => handleVariantChange(index, field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 focus:outline-none"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm mb-1">Profit (auto)</label>
                      <input type="number" value={variant.variantProfit} readOnly placeholder="—"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Discount %</label>
                      <input type="number" value={variant.variantDiscount || ""}
                        onChange={(e) => handleVariantChange(index, "variantDiscount", e.target.value)}
                        placeholder="e.g. 10"
                        className="w-full h-[45px] border border-[#D0D0D0] rounded-lg px-3 bg-[#F8FAFB] text-sm text-gray-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Variant Images */}
                  <div className="mt-4">
                    <h4 className="text-sm text-gray-600 mb-2">Variant Images</h4>
                    <div className="flex flex-wrap gap-3">
                      {(variant.variantImage || []).map((img, imgIndex) => {
                        const imgSrc = typeof img === "string" ? img : img.preview || URL.createObjectURL(img);
                        return (
                          <img key={imgIndex} src={imgSrc} alt={`v-img-${imgIndex}`}
                            className="w-[70px] h-[70px] object-cover rounded-lg border border-rose-100 cursor-pointer hover:opacity-80 transition"
                            onClick={() => { setSelectedImages(variant.variantImage); setCurrentImage(imgSrc); setActiveVariantIndex(index); setIsModalOpen(true); }}
                          />
                        );
                      })}
                      {(variant.variantImage || []).length < 10 && (
                        <label htmlFor={`variantImage-${index}`}
                          className="w-[70px] h-[70px] flex flex-col items-center justify-center border border-dashed border-rose-200 rounded-lg cursor-pointer hover:bg-pink-50 transition">
                          <input id={`variantImage-${index}`} type="file" accept="image/*" multiple className="hidden"
                            onChange={(e) => handleVariantImageChange(e, index)} />
                          <FiUpload className="text-rose-400 text-lg" />
                          <span className="text-[10px] text-rose-400 mt-1">Add</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Save variant */}
                  <div className="flex justify-end mt-5">
                    <button type="button" onClick={() => handleSaveVariant(index)}
                      className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm transition">
                      Save Variant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default AddProduct;

// Add product image old code aman

//  <div>
//               <label className="block text-black text-sm font-medium mb-2">
//                 Product Image
//               </label>

//               <div className="flex flex-wrap gap-3 items-start">
//                 {Array.isArray(formData.images) &&
//                   formData.images.map((img, i) => {
//                     const imgSrc =
//                       img instanceof File
//                         ? URL.createObjectURL(img)
//                         : typeof img === "string"
//                         ? img
//                         : null;

//                     if (!imgSrc) return null;

//                     return (
//                       <div key={i} className="relative group">
//                         <img
//                           src={imgSrc}
//                           alt={`preview ${i}`}
//                           className="w-[134px] h-[134px] object-cover rounded-lg border border-neutral-200"
//                         />

//                         {/* Overlay */}
//                         <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition rounded-lg"></div>

//                         {/* Remove button */}
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               images: prev.images.filter(
//                                 (_, index) => index !== i
//                               ),
//                             }))
//                           }
//                           className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
//                         >
//                           <Trash size={20} />
//                         </button>
//                       </div>
//                     );
//                   })}

//                 {/* Upload Box */}
//                 {formData.images.length < 10 && (
//                   <label
//                     htmlFor="productImage"
//                     className="w-[137px] h-[137px] bg-[#ECECF0] border border-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
//                   >
//                     <input
//                       id="productImage"
//                       type="file"
//                       multiple
//                       accept=".png,.jpg,.jpeg,.webp,.svg"
//                       className="hidden"
//                       onChange={handleFileChange}
//                     />
//                     <div className="w-12 h-12 flex items-center justify-center rounded-full border border-[#D0D0D0] bg-white">
//                       <Plus className="text-[#5F5F5F] w-6 h-6" />
//                     </div>
//                   </label>
//                 )}
//               </div>
//             </div>

{
  /* <div className="flex gap-6 mb-5 ">
              {["Framed", "Unframed"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="type"
                    value={option}
                    checked={formData.type === option}
                    onChange={handleChange}
                    className="scale-125 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />

                  <span className="text-stone-600 text-sm font-normal">
                    {option}
                  </span>
                </label>
              ))}
            </div> */
}

{
  /* Return Eligible Checkbox */
}
{
  /* <div className="mt-5 flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="returnPolicy"
                  checked={formData.returnPolicy}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Eligible for return
              </label>
            </div> */
}

//  the action delete btn
{
  /* Action (Trash) */
}
// <div className="flex flex-col items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//   <label className="block text-sm font-medium mb-2">
//     Action
//   </label>
//   <button
//     type="button"
//     onClick={() => removeVariant(index)}
//     className="p-2 rounded hover:bg-red-100 transition"
//   >
//     <Trash className="w-[27px] h-[27px] text-red-700" />
//   </button>
// </div>

// // Add varitan photo
//  <div className=" w-full">
//                               {variant.variantImage?.length > 0 ? (
//                                 <div className="flex-wrap w-[70px] h-[70px] flex mb-2">
//                                   <img
//                                     src={
//                                       typeof variant.variantImage[0] ===
//                                       "string"
//                                         ? variant.variantImage[0]
//                                         : variant.variantImage[0].preview ||
//                                           URL.createObjectURL(
//                                             variant.variantImage[0]
//                                           )
//                                     }
//                                     alt="Variant"
//                                     className="w-[70px] h-[70px] object-cover rounded-lg border border-neutral-200 cursor-pointer"
//                                     onClick={() => {
//                                       setSelectedImages(variant.variantImage);
//                                       const first =
//                                         typeof variant.variantImage[0] ===
//                                         "string"
//                                           ? variant.variantImage[0]
//                                           : variant.variantImage[0].preview ||
//                                             URL.createObjectURL(
//                                               variant.variantImage[0]
//                                             );
//                                       setCurrentImage(first);
//                                       setIsModalOpen(true);
//                                       setActiveVariantIndex(index);
//                                     }}
//                                   />
//                                   {/* +1 over lay */}
//                                   {/* {variant.variantImage.length > 1 && (
//                                     <div
//                                       onClick={() => {
//                                         setSelectedImages(variant.variantImage);
//                                         const first =
//                                           typeof variant.variantImage[0] ===
//                                           "string"
//                                             ? variant.variantImage[0]
//                                             : variant.variantImage[0].preview ||
//                                               URL.createObjectURL(
//                                                 variant.variantImage[0]
//                                               );
//                                         setCurrentImage(first);
//                                         setActiveVariantIndex(index);
//                                         setIsModalOpen(true);
//                                       }}
//                                       className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-medium rounded-lg cursor-pointer"
//                                     >
//                                       +{variant.variantImage.length - 1}
//                                     </div>
//                                   )} */}

//                                   <div className="flex items-center justify-evenly gap-2">
//                                     {variant.variantImage.map(
//                                       (img, imgIndex) => {
//                                         const imgSrc =
//                                           typeof img === "string"
//                                             ? img
//                                             : img.preview ||
//                                               URL.createObjectURL(img);

//                                         return (
//                                           <img
//                                             key={imgIndex}
//                                             src={imgSrc}
//                                             className="w-[60px] h-[60px] object-cover rounded-lg border cursor-pointer hover:opacity-80 transition"
//                                             alt={`variant-${imgIndex}`}
//                                             onClick={() => {
//                                               setSelectedImages(
//                                                 variant.variantImage
//                                               );
//                                               setCurrentImage(imgSrc);
//                                               setActiveVariantIndex(index);
//                                               setIsModalOpen(true);
//                                             }}
//                                           />
//                                         );
//                                       }
//                                     )}
//                                   </div>

//                                   {variant.variantImage.length < 10 && (
//                                     <label
//                                       htmlFor={`variantImage-${index}`}
//                                       className="absolute bottom-4 left-24 -top-1  w-[75px] h-[75px] bg-[#FFFFFF] border border-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#DEDEDE]"
//                                     >
//                                       <input
//                                         id={`variantImage-${index}`}
//                                         type="file"
//                                         accept="image/*"
//                                         multiple
//                                         className="hidden"
//                                         onChange={(e) =>
//                                           handleVariantImageChange(e, index)
//                                         }
//                                       />
//                                       {/* <Plus className="text-gray-500 w-3 h-3" /> */}
//                                       <div>
//                                         <BiImageAdd className="text-gray-500 text-[35px] hover:text-blue-600 transition" />
//                                       </div>
//                                     </label>
//                                   )}
//                                 </div>

//                               ) : (
//                                 <label
//                                   htmlFor={`variantImage-${index}`}
//                                   className="w-[80px] h-[80px] bg-[#FFFFFF] border border-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#DEDEDE]"
//                                 >
//                                   <input
//                                     id={`variantImage-${index}`}
//                                     type="file"
//                                     accept="image/*"
//                                     multiple
//                                     className="hidden"
//                                     onChange={(e) =>
//                                       handleVariantImageChange(e, index)
//                                     }
//                                   />
//                                   {/* <div className="w-[20px] h-[20px] flex items-center justify-center rounded-full border border-[#D0D0D0] bg-white"> */}
//                                   <div>
//                                     <BiImageAdd className="text-gray-500 text-[35px] hover:text-blue-600 transition" />
//                                   </div>
//                                 </label>
//                               )}
//                             </div>
// /////////////////////////
{
  /* <div className="flex items-center justify-center text-[14px] gap-3">
            <Link to={`/admin/products`}>
              <h1 className="text-[#686868]">All Product</h1>
            </Link>
            <IoIosArrowForward />
            <h1 className="text-[#1626FF] font-normal cursor-pointer">
              Add Product
            </h1>
          </div> */
}
// //////////////////////////// variant aimages
{
  /* <div className="flex items-start justify-start gap-16  "> */
}
{
  /* 6️ Variant Image */
}
{
  /* <div className="flex flex-col items-start justify-start ">
                        <label className="block text-sm font-medium mb-2">
                          Images
                        </label>
                        <div className="relative w-full">
                          {variant.variantImage?.length > 0 ? (
                            <div className="relative w-[45px] h-[45px]">
                              <img
                                src={
                                  typeof variant.variantImage[0] === "string"
                                    ? variant.variantImage[0]
                                    : variant.variantImage[0].preview ||
                                      URL.createObjectURL(
                                        variant.variantImage[0]
                                      )
                                }
                                alt="Variant"
                                className="w-[45px] h-[45px] object-cover rounded-lg border border-neutral-200 cursor-pointer"
                                onClick={() => {
                                  setSelectedImages(variant.variantImage);
                                  const first =
                                    typeof variant.variantImage[0] === "string"
                                      ? variant.variantImage[0]
                                      : variant.variantImage[0].preview ||
                                        URL.createObjectURL(
                                          variant.variantImage[0]
                                        );
                                  setCurrentImage(first);
                                  setIsModalOpen(true);
                                  setActiveVariantIndex(index);
                                }}
                              />
                              {variant.variantImage.length > 1 && (
                                <div
                                  onClick={() => {
                                    setSelectedImages(variant.variantImage);
                                    const first =
                                      typeof variant.variantImage[0] ===
                                      "string"
                                        ? variant.variantImage[0]
                                        : variant.variantImage[0].preview ||
                                          URL.createObjectURL(
                                            variant.variantImage[0]
                                          );
                                    setCurrentImage(first);
                                    setActiveVariantIndex(index); // ✅ store which variant is open
                                    setIsModalOpen(true);
                                  }}
                                  className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium rounded-lg cursor-pointer"
                                >
                                  +{variant.variantImage.length - 1}
                                </div>
                              )}

                              {variant.variantImage.length < 10 && (
                                <label
                                  htmlFor={`variantImage-${index}`}
                                  className="absolute bottom-4 left-16  -translate-x-1/2 w-5 h-5 bg-white border border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
                                >
                                  <input
                                    id={`variantImage-${index}`}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) =>
                                      handleVariantImageChange(e, index)
                                    }
                                  />
                                  <Plus className="text-gray-500 w-3 h-3" />
                                </label>
                              )}
                            </div>
                          ) : (
                            <label
                              htmlFor={`variantImage-${index}`}
                              className="w-[45px] h-[45px] bg-[#ECECF0] border border-neutral-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200"
                            >
                              <input
                                id={`variantImage-${index}`}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) =>
                                  handleVariantImageChange(e, index)
                                }
                              />
                              <div className="w-[20px] h-[20px] flex items-center justify-center rounded-full border border-[#D0D0D0] bg-white">
                                <Plus className="text-[#5F5F5F] w-[9px] h-[9px]" />
                              </div>
                            </label>
                          )}
                        </div>
                      </div> */
}
{
  /* </div> */
}
{
  /*  Action (Trash) */
}
{
  /* <div className="flex flex-col items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <label className="block text-sm font-medium mb-2">
                        Action
                      </label>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-2 rounded hover:bg-red-100 transition"
                      >
                        <Trash className="w-[27px] h-[27px] text-red-700" />
                      </button>
                    </div> */
}
