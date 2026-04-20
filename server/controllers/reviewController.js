import Review from "../models/Review.js";
import Product from "../models/Product.js";

// ✅ Add a new review
export const addReview = async (req, res) => {
  try {
    const { product, rating, comment, images } = req.body;
    const userId = req.user._id; // from auth middleware

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent duplicate review from same user
   
    const existingReview = await Review.findOne({ user: userId, product });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      product,
      rating,
      comment,
      images,
    });

    // 🔑 Add review ID into product.reviews
    productExists.reviews.push(review._id);
    await productExists.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "username email profile")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single review
export const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "user",
      "username email"
    );
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update review (only by review owner)
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    review.images = req.body.images || review.images;

    await review.save();

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete review (user or admin)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Like review
export const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const userId = req.user._id.toString();

    // If already liked → remove like
    if (review.likes.includes(userId)) {
      review.likes.pull(userId);
    } else {
      // Remove from dislikes if user disliked before
      review.dislikes.pull(userId);
      review.likes.push(userId);
    }

    await review.save();
    res.json({
      success: true,
      likes: review.likes.length,
      dislikes: review.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Dislike review
export const dislikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const userId = req.user._id.toString();

    // If already disliked → remove dislike
    if (review.dislikes.includes(userId)) {
      review.dislikes.pull(userId);
    } else {
      // Remove from likes if user liked before
      review.likes.pull(userId);
      review.dislikes.push(userId);
    }

    await review.save();
    res.json({ success: true, likes: review.likes.length, dislikes: review.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

