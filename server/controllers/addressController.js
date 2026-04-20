import Address from "../models/Address.js";

// Create address
export const addAddress = async (req, res) => {
  try {
    const { name, email, tag, street, city, state, phone, zip, isDefault } =
      req.body;
    const userId = req.user;

    // If this new address is default → remove default from others
    if (isDefault) {
      await Address.updateMany(
        { userId, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = await Address.create({
      userId,
      name,
      email,
      tag,
      street,
      city,
      state,
      phone,
      zip,
      isDefault: !!isDefault,
    });

    res.status(201).json({
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ message: "Failed to add address" });
  }
};

// Get all addresses for user
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({ message: "Failed to get addresses" });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDefault, ...updateData } = req.body;

    // If making this one default → unset others
    if (isDefault) {
      const current = await Address.findById(id);
      if (current) {
        await Address.updateMany(
          { userId: current.userId, _id: { $ne: id } },
          { $set: { isDefault: false } }
        );
      }
    }

    const updated = await Address.findByIdAndUpdate(
      id,
      { ...updateData, ...(isDefault !== undefined && { isDefault }) },
      { new: true }
    );

    res.json({
      message: "Address updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await Address.findByIdAndDelete(id);
    res.status(200).json({ message: "Address deleted" });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};
