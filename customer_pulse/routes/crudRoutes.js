const express = require("express");
const router = express.Router();
const crudController = require("../controllers/crudController");
const dashController = require("../controllers/dashController");
const gogreController = require("../controllers/gogreController");
const authenticateToken = require('../middleware/authMiddleware');
const { login } = require('../controllers/authController'); // Adjust the path
const { signup } = require('../controllers/signupController'); 
const UrlController = require('../controllers/urlController');
// public
router.post('/login', login);
router.post('/signup',signup);
router.post("/feedpost",crudController.crud_create_post);


//protected
// Protected CRUD routes
router.get("/", authenticateToken, crudController.crud_index);
router.get("/:id", authenticateToken, crudController.crud_details);
router.patch("/:id", authenticateToken, crudController.crud_update);
router.delete("/:id", authenticateToken, crudController.crud_delete);

// Protected chart route
router.post("/chart-1", authenticateToken, dashController.chart_1);
router.post("/chart-2", authenticateToken, dashController.chart_2);
router.post("/chart-3", authenticateToken, dashController.chart_3);
router.post("/chart-4", authenticateToken, dashController.chart_4);
router.post("/chart-5", authenticateToken, dashController.chart_5);
router.post("/chart-6", authenticateToken, dashController.chart_6);
router.post("/chart-7", authenticateToken, dashController.chart_7);
router.post("/chart-8", authenticateToken, dashController.chart_8);
router.post("/chart-9", authenticateToken, dashController.chart_9);
router.post("/chart-10",authenticateToken, dashController.chart_10);
router.post("/chart-11",authenticateToken, dashController.chart_11);
router.post("/headcount",authenticateToken, dashController.headHounters);
router.post("/centerqr",authenticateToken, dashController.center_qr);
router.post("/createfeedurl",authenticateToken, UrlController.createFeedUrl);

router.post('/shorten', UrlController.createShortUrl);
router.get('/analytics/:shortUrlId', UrlController.getUrlAnalytics);

module.exports = router;
