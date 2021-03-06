const mongoose = require('mongoose');

const Order = require('../models/order');

const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .exec()
    .select('product quantity _id')
    .then((docs) => {
      return res.status(200).json({
        count: docs.quantity,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders${doc.id}`,
            },
          };
        }),
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

exports.orders_add_new = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found!',
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      return res.status(200).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${result._id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Product not found',
        error: err,
      });
    });
};

exports.orders_get_one = (req, res, next) => {
  Product.findById(req.params.orderId)
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        order: result,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders',
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_delete_one = (req, res, next) => {
  Order.remove({
    _id: req.params.orderId,
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders',
          body: { productId: 'ID', quantity: 'Number' },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
