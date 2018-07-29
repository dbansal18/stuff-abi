var express = require('express');
var app=express();
var router = require('express').Router();
const Product = require('../models/product-model');
var path =require('path');
var ejs= require('ejs');

router.get('/products/:page', function(req, res, next) {
	// console.log(req);
    var perPage = 9
    var page = req.params.page || 1

    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                    //console.log(products);
                res.render('products', {
                    user: req.user,
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})

router.get('/productlist/data', (req, res)=>{
    var perPage = 9
    var page = req.query.page || 1

    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                // console.log(products);
                else
                    res.send({user: req.user, products: products, pageNo: page, pages: Math.ceil(count / perPage)});
            })
        })
    //console.log(req.page, req.body);
})

router.get('/name/:id', (req, res)=>
	{
		// console.log(req);
		 Product.findOne({_id: req.params.id}, function (err, product) {

            if (err) throw (err);
            	console.log('product does not exit');
            if (product) {
                res.render('showProduct', {product:product, user: req.user});
            } 
		});
	});

module.exports = router;