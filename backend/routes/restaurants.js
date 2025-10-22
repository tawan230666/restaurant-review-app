const express = require('express');
const router = express.Router();
const { readJsonFile } = require('../utils/fileManager');

// ========================================
// GET /api/restaurants - ดึงรายการร้านทั้งหมด (พร้อม filtering)
// ========================================
router.get('/', async (req, res) => {
  try {
    let restaurants = await readJsonFile('restaurants.json');
    const { search, category, minRating, priceRange } = req.query;
    
    // กรองตามชื่อ (search)
    if (search) {
      const searchLower = search.toLowerCase();
      restaurants = restaurants.filter(r => 
        (r.name || '').toLowerCase().includes(searchLower) ||
        (r.description || '').toLowerCase().includes(searchLower)
      );
    }
    
    // กรองตามหมวดหมู่ (category)
    if (category) {
      restaurants = restaurants.filter(r => r.category === category);
    }
    
    // กรองตาม rating ขั้นต่ำ (minRating)
    if (minRating) {
      const min = parseFloat(minRating);
      restaurants = restaurants.filter(r => (r.averageRating || 0) >= min);
    }
    
    // กรองตามช่วงราคา (priceRange)
    if (priceRange) {
      const pr = parseInt(priceRange);
      restaurants = restaurants.filter(r => parseInt(r.priceRange) === pr);
    }
    
    res.json({
      success: true,
      data: restaurants,
      total: restaurants.length,
      filters: {
        search: search || null,
        category: category || null,
        minRating: minRating || null,
        priceRange: priceRange || null
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน'
    });
  }
});

// ========================================
// GET /api/restaurants/:id - ดึงข้อมูลร้านตาม ID พร้อมรีวิว
// ========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const restaurants = await readJsonFile('restaurants.json');
    const reviews = await readJsonFile('reviews.json');

    const restaurant = restaurants.find(r => r.id === parseInt(id));
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบร้านอาหารนี้'
      });
    }

    const restaurantReviews = reviews.filter(r => r.restaurantId === parseInt(id));
    restaurantReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: {
        ...restaurant,
        reviews: restaurantReviews
      }
    });
    
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน'
    });
  }
});

module.exports = router;
