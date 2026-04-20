import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(200).json({ user: req.user._id, items: [] }); // safe fallback
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch cart", error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { items } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items });
    } else {
      cart.items = items;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.userId }, { items: [] });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
