const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const ProductTag = require('../models/ProductTag');

async function getAllProducts(req, res, next) {
  try {
    const { page = 1, limit = 50, categoryId, status, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const options = {
      limit: parseInt(limit),
      offset,
      categoryId,
      status,
      search,
    };

    const products = await Product.findAll(options);
    const total = await Product.count(options);

    // Get images and tags for each product
    for (let product of products) {
      product.images = await ProductImage.findByProductId(product.id);
      product.tags = await ProductTag.findByProductId(product.id);
    }

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get images and tags
    product.images = await ProductImage.findByProductId(product.id);
    product.tags = await ProductTag.findByProductId(product.id);

    res.json({ product });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const productData = req.body;
    const product = await Product.create(productData);

    // Add images if provided
    if (req.body.images && Array.isArray(req.body.images)) {
      for (const image of req.body.images) {
        await ProductImage.create({
          productId: product.id,
          imageUrl: image.url,
          isPrimary: image.isPrimary || false,
          displayOrder: image.displayOrder || 0,
        });
      }
    }

    // Add tags if provided
    if (req.body.tags && Array.isArray(req.body.tags)) {
      for (const tag of req.body.tags) {
        await ProductTag.create({
          productId: product.id,
          tag,
        });
      }
    }

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const productData = req.body;

    const product = await Product.update(id, productData);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update images if provided
    if (req.body.images && Array.isArray(req.body.images)) {
      await ProductImage.deleteByProductId(id);
      for (const image of req.body.images) {
        await ProductImage.create({
          productId: id,
          imageUrl: image.url,
          isPrimary: image.isPrimary || false,
          displayOrder: image.displayOrder || 0,
        });
      }
    }

    // Update tags if provided
    if (req.body.tags && Array.isArray(req.body.tags)) {
      await ProductTag.deleteByProductId(id);
      for (const tag of req.body.tags) {
        await ProductTag.create({
          productId: id,
          tag,
        });
      }
    }

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    await Product.delete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function getProductsByCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const options = {
      limit: parseInt(limit),
      offset,
      categoryId,
    };

    const products = await Product.findAll(options);
    const total = await Product.count(options);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function searchProducts(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const options = {
      limit: parseInt(limit),
      offset,
      search: q,
    };

    const products = await Product.findAll(options);
    const total = await Product.count(options);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
};

