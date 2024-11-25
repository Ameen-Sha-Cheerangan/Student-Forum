const CategoryModel = require('../models/CategoryModel');

exports.createCategory = async (req, res) => {
  let { category } = req.body;

  try {
    const isCategoryExist = await CategoryModel.findOne({ category });
    if (isCategoryExist !== null) {
      return res
        .status(500)
        .json({ error: 'There is already a category with this name' });
    }
    category = category.charAt(0).toUpperCase() + category.slice(1);

    const newCategory = await new CategoryModel({
      category,
    });
    await newCategory.save();
    res
      .status(201)
      .json({ success: true, message: 'Category created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createSubcategory = async (req, res) => {
  const { category, subcategory } = req.body;

  try {
    // Find the category by name
    const existingCategory = await CategoryModel.findOne({ category });
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if the subcategory already exists in the selected category
    if (existingCategory.subcategory.includes(subcategory)) {
      return res.status(500).json({ message: 'This subcategory already exists in this category' });
    }

    // Add the new subcategory to the category's subcategory array
    existingCategory.subcategory.push(subcategory);
    await existingCategory.save();

    res.status(200).json({ message: 'Subcategory created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create subcategory', error: error.message });
  }
};
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.getAllSubcategories = async (req, res) => {
  try {
    // Fetch all categories with their subcategories
    const categories = await CategoryModel.find({}, 'category subcategory');

    // Send the response in the format your frontend expects
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories and subcategories', error: error.message });
  }
};