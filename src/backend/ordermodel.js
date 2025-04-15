const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ name: String, qty: Number, price: Number }],
  totalAmount: Number,
  token: String,
  status: { type: String, default: 'pending' }, // 'pending', 'completed'
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
