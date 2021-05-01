const express = require('express');
const router  = express.Router();
const {getPrivateData, addChart, privateCharts} = require('../controllers/private');
const {protect} = require('../middleware/auth')

router.route('/').get(protect,getPrivateData);
router.route('/privatecharts').get(protect,privateCharts);
router.route('/addchart').post(protect,addChart);

module.exports = router;