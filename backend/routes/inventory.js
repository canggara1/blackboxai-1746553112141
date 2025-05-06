import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getDiscountItems,
  createDiscountItem,
  updateDiscountItem,
  deleteDiscountItem,
} from '../controllers/inventoryController.js';

const router = express.Router();

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Variants
router.get('/variants', getVariants);
router.post('/variants', createVariant);
router.put('/variants/:id', updateVariant);
router.delete('/variants/:id', deleteVariant);

// Menu Items
router.get('/menu-items', getMenuItems);
router.post('/menu-items', createMenuItem);
router.put('/menu-items/:id', updateMenuItem);
router.delete('/menu-items/:id', deleteMenuItem);

// Discount Items
router.get('/discount-items', getDiscountItems);
router.post('/discount-items', createDiscountItem);
router.put('/discount-items/:id', updateDiscountItem);
router.delete('/discount-items/:id', deleteDiscountItem);

export default router;
