const mongoose = require('mongoose');

const Product = require('../modeles/product');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                products: docs.map((doc) => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                }),
            };
            return res.status(200).json(response);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: err,
            });
        })
};

exports.products_add_one = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
    });
    product
        .save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: 'Created product',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    reqeust: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                },
            });
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: err,
            });
        });
};

exports.products_get_one = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then((doc) => {
            console.log("From db: ", doc);
            if (doc) {
                return res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: 'http://localhost:3000/products/',
                    }
                });
            } else {
                return res.status(404).json({ message: "No valid product found" });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: err,
            });
        });
};

exports.products_update_one = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
            return res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: err,
            });
        });
};

exports.products_delete_one = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then((result) => {
            return res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    data: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: err,
            });
        });
};