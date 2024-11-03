const express = require('express');
const productsController = require('../controllers/products.controllers');
const router = express.Router();

router.get('/', productsController.get);

router.get('/:id', productsController.getOne);

router.post('/', productsController.create);

router.put('/:id', productsController.update);

router.delete('/:id', productsController.delete);

module.exports = router