var express = require('express');
var router = express.Router();

const Validator = require('fastest-validator');
const { message } = require('statuses');
const v = new Validator;

const {Products} = require('../models')

router.get('/', async (req,res) => {
    const products = await Products.findAll();
    res.json(products)
})

router.get('/:id', async (req,res) => {
    const id = req.params.id;
    let product = await Products.findByPk(id);
    if(!product){
        return res.json({
            message: "produk tidak ada"
        })
    }
    const products = await Products.findByPk(id);
    res.json(products)
})


router.post('/', async (req, res) => {
    const schema = {
        name: 'string',
        brand: 'string',
        description: "string|optional"
    }
    
    const validate = v.validate(req.body, schema)
    
    if(validate.length){
        return res.status(400).json(validate)
    }
    
    const product = await Products.create(req.body);
    
    res.json(product)
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    
    let product = await Products.findByPk(id);
    if(!product){
        return res.json({
            message: "produk tidak ada"
        })
    }
    
    const schema = {
        name: 'string|optional',
        brand: 'string|optional',
        description: "string|optional"
    }
    
    const validate = v.validate(req.body, schema)
    
    if(validate.length){
        return res.status(400).json(validate)
    }
    
    product = await product.update(req.body);
    res.json(product)
})

router.delete('/:id', async (req,res) => {
    const id = req.params.id;

    let product = await Products.findByPk(id);
    if(!product){
        return res.json({
            message: "produk tidak ada"
        })
    }

    await product.destroy()

    res.json({
        message : "Produk telah terhapus"
    })
})

module.exports = router;