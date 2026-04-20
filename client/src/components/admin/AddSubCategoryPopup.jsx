import React, { useState } from "react";
import { toast } from "react-toastify";

const AddSubCategoryPopup = ({
  setShowSubCategoryModal,
  categories,
  subcategories,
  setSubcategories,
  setFormData,
  selectedCategory,
}) => {
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [categoryInput, setCategoryInput] = useState(selectedCategory || "");

  // ✅ Suggested subcategories per category for quick-add
  const suggestions = {
    Dresses: ["Maxi Dress", "Midi Dress", "Mini Dress", "Evening Gown", "Wrap Dress"],
    Tops: ["Blouse", "Crop Top", "Shirt", "Knitwear", "Corset Top"],
    "Jeans & Pants": ["Skinny Jeans", "Wide Leg", "Trousers", "Palazzos", "Shorts"],
    "Co-ord Sets": ["Casual Set", "Formal Set", "Printed Set"],
    "Ethnic Wear": ["Kurta", "Saree", "Lehenga", "Salwar Suit"],
    Winterwear: ["Sweater", "Hoodie", "Jacket", "Coat"],
    Accessories: ["Jewellery", "Handbag", "Belt", "Scarf"],
  };

  const handleSave = () => {
    const cat = String(categoryInput || "").trim();
    const sub = String(subCategoryInput || "").trim();

    if (!cat) {
      toast.error("Select a Category first!", {
        className: "bg-red-700 text-white rounded-lg",
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!sub) {
      toast.error("Enter a Subcategory name!", {
        className: "bg-red-700 text-white rounded-lg",
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setSubcategories((prev) => {
      const obj = prev && typeof prev === "object" ? prev : {};
      const existing = Array.isArray(obj[cat]) ? obj[cat] : [];
      if (existing.includes(sub)) return obj;
      return { ...obj, [cat]: [...existing, sub] };
    });

    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        category: cat,
        subcategory: sub,
      }));
    }

    toast.success("Subcategory added!", {
      className: "bg-[#EEFFEF] text-black rounded-lg",
      position: "top-right",
      autoClose: 3000,
    });

    setShowSubCategoryModal(false);
    setSubCategoryInput("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl w-[420px] relative shadow-lg">
        <h2 className="text-lg font-medium text-gray-800 mb-5">
          Add Subcategory
        </h2>

        {/* Category Select */}
        <label className="block text-sm text-gray-600 mb-1">Category</label>
        <select
          value={categoryInput}
          onChange={(e) => {
            setCategoryInput(e.target.value);
            setSubCategoryInput(""); // reset sub on category change
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-[#F8FAFB] mb-4 focus:outline-none focus:ring-1 focus:ring-rose-300"
        >
          <option value="">Select category</option>
          {(categories || []).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Quick suggestion chips */}
        {categoryInput && suggestions[categoryInput]?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
              Quick add
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions[categoryInput].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubCategoryInput(s)}
                  className={`text-xs px-3 py-1 rounded-full border transition
                    ${subCategoryInput === s
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-pink-50 text-rose-600 border-rose-200 hover:bg-rose-50"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subcategory Input */}
        <label className="block text-sm text-gray-600 mb-1">
          Subcategory Name
        </label>
        <input
          type="text"
          placeholder="e.g. Midi Dress, Wide Leg Jeans"
          value={subCategoryInput}
          onChange={(e) => setSubCategoryInput(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-[#F8FAFB] mb-5 focus:outline-none focus:ring-1 focus:ring-rose-300"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowSubCategoryModal(false)}
            className="px-5 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-sm text-white transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryPopup;