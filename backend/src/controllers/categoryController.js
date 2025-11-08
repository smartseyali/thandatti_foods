const Category = require('../models/Category');
const Product = require('../models/Product');

async function getAllCategories(req, res, next) {
  try {
    const categories = await Category.findAll();
    
    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Category.getProductCount(category.id);
        return { ...category, productCount: count };
      })
    );

    res.json({ categories: categoriesWithCount });
  } catch (error) {
    next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const productCount = await Category.getProductCount(id);
    category.productCount = productCount;

    res.json({ category });
  } catch (error) {
    next(error);
  }
}

async function getCategoryProducts(req, res, next) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const options = {
      limit: parseInt(limit),
      offset,
      categoryId: id,
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

async function createCategory(req, res, next) {
  try {
    const categoryData = req.body;
    const category = await Category.create(categoryData);

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const categoryData = req.body;

    const category = await Category.update(id, categoryData);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryProducts,
  createCategory,
  updateCategory,
};

