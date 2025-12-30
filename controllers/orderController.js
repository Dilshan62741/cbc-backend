import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
  // auth check
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const orderInfo = req.body;

  // basic validation
  if (!orderInfo.products || orderInfo.products.length === 0) {
    return res.status(400).json({ message: "No products provided" });
  }

  if (!orderInfo.address || !orderInfo.phone) {
    return res.status(400).json({ message: "Address and phone are required" });
  }

  // default name
  if (!orderInfo.name) {
    orderInfo.name = req.user.firstName + " " + req.user.lastName;
  }

  // generate orderId
  let orderId = "CBC00001";
  const lastOrder = await Order.find().sort({ date: -1 }).limit(1);

  if (lastOrder.length > 0) {
    const lastNumber = parseInt(lastOrder[0].orderId.replace("CBC", ""));
    orderId = "CBC" + String(lastNumber + 1).padStart(5, "0");
  }

  try {
    let total = 0;
    let labeledTotal = 0;
    const products = [];

    for (let i = 0; i < orderInfo.products.length; i++) {
      const reqProduct = orderInfo.products[i];

      const item = await Product.findOne({ productId: reqProduct.productId });

      if (!item) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (!item.isAvailable) {
        return res.status(403).json({ message: "Product not available" });
      }

      if (item.stock < reqProduct.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      products.push({
        productInfo: {
          productId: item.productId,
          name: item.name,
          altNames: item.altNames,
          description: item.description,
          images: item.images,
          labelPrice: item.labelPrice,
          price: item.price
        },
        quantity: reqProduct.quantity
      });

      total += item.price * reqProduct.quantity;
      labeledTotal += item.labelPrice * reqProduct.quantity;

      // update stock correctly
      const newStock = item.stock - reqProduct.quantity;

      await item.updateOne({
        stock: newStock,
        isAvailable: newStock > 0
      });
    }

    const order = new Order({
      orderId,
      email: req.user.email,
      name: orderInfo.name,
      phone: orderInfo.phone,
      address: orderInfo.address,
      products,
      total,
      labeledTotal
    });

    const createdOrder = await order.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: createdOrder
    });

  } catch (err) {
    return res.status(500).json({
      message: "Failed to create order",
      error: err.message
    });
  }
}
