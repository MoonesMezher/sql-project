const Mez = require("mez-validation");
const db = require("../database");

const productsController = {
    get: async (req, res) => {
        try {
            const data = await db.find('products');
            
            return res.status(201).json({ message: 'get successfully', data});
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },
    getOne: async (req, res) => {
        try {
            const id = req.params.id;

            const data = await db.findBy('products', { id });

            if(data.length === 0) {
                return res.status(400).json({ message: 'this product is not exist'});                
            }
            
            return res.status(201).json({ message: 'get successfully', data});
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const { title, price, sub } = req.body;

            const validation = Mez.validation([
                {
                    name: "title",
                    data: title,
                    is: ["required", "string"]
                },
                {
                    name: "price",
                    data: price,
                    is: ["required", "number"]
                },
                {
                    name: "sub",
                    data: sub,
                    is: ["required", "string"]
                },
            ])

            if(validation.error) {
                return res.status(400).json({ message: validation.messages[0]});                
            }

            const data = await db.create('products', { title, price, sub });
            
            return res.status(201).json({ message: 'created successfully', data});
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const { title, price, sub } = req.body;

            const id = req.params.id;

            if(!title || !price || !sub) {
                return res.status(400).json({ message: 'all data must be required'});                
            }

            const product = await db.findBy('products', { id })

            if(product.length === 0) {
                return res.status(400).json({ message: 'this product is not exist'});
            }

            const data = await db.update('products', { title, price, sub }, { id });
            
            return res.status(201).json({ message: 'updated successfully', data});
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;

            const product = await db.findBy('products', { id })

            if(product.length === 0) {
                return res.status(400).json({ message: 'this product is not exist'});
            }

            const data = await db.del('products', { id });
            
            return res.status(201).json({ message: 'deleted successfully', data});
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },
}

module.exports = productsController