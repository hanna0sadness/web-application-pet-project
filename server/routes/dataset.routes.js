const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../controllers/dataset.controller");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { getDashboard } = require("../controllers/dashboardController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "text/csv") {
            cb(null, true);
        } else {
            cb(new Error("Only CSV files allowed"), false);
        }
    }
});

const uploadViz = multer({ dest: "../uploads/" });

router.post("/upload", authMiddleware, upload.single("file"), controller.uploadFile);
router.get("/datasets", authMiddleware, controller.getDatasets);
router.get("/results/:datasetId", authMiddleware, controller.getResults);
router.post("/visualizations", authMiddleware, uploadViz.single("image"), controller.saveVisualization);
router.get("/visualizations/:datasetId", authMiddleware, controller.getVisualizations);

router.get("/dashboard", authMiddleware, roleMiddleware(["admin"]), getDashboard);
router.get("/datasets/:id/full", authMiddleware, roleMiddleware(["admin"]), controller.getFullDataset);
router.delete("/datasets/:id", authMiddleware, controller.deleteDataset);

module.exports = router;