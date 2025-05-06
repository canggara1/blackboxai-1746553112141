import Category from '../models/Category.js';
import Variant from '../models/Variant.js';
import MenuItem from '../models/MenuItem.js';
import DiscountItem from '../models/DiscountItem.js';

// Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create category', error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update category', error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete category', error });
  }
};

// Variants
export const getVariants = async (req, res) => {
  try {
    const variants = await Variant.find();
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch variants', error });
  }
};

export const createVariant = async (req, res) => {
  try {
    const variant = new Variant(req.body);
    await variant.save();
    res.status(201).json(variant);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create variant', error });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!variant) return res.status(404).json({ message: 'Variant not found' });
    res.json(variant);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update variant', error });
  }
};

export const deleteVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndDelete(req.params.id);
    if (!variant) return res.status(404).json({ message: 'Variant not found' });
    res.json({ message: 'Variant deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete variant', error });
  }
};

// Menu Items
export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().populate('category').populate('variants');
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items', error });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create menu item', error });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update menu item', error });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete menu item', error });
  }
};

// Discount Items
export const getDiscountItems = async (req, res) => {
  try {
    const discounts = await DiscountItem.find();
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch discount items', error });
  }
};

export const createDiscountItem = async (req, res) => {
  try {
    const discount = new DiscountItem(req.body);
    await discount.save();
    res.status(201).json(discount);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create discount item', error });
  }
};

export const updateDiscountItem = async (req, res) => {
  try {
    const discount = await DiscountItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!discount) return res.status(404).json({ message: 'Discount item not found' });
    res.json(discount);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update discount item', error });
  }
};

export const deleteDiscountItem = async (req, res) => {
  try {
    const discount = await DiscountItem.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ message: 'Discount item not found' });
    res.json({ message: 'Discount item deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete discount item', error });
  }
};
