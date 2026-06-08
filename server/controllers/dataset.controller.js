const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const { analyzeData, correlationMatrix } = require("../services/analysis.service");

exports.uploadFile = (req, res) => {
    
    if (!req.file) {
        return res.status(400).json({
            message: "Файл не завантажено"
        });
    }

    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                const userId = req.user.id;

                const columnCount = Object.keys(results[0] || {}).length;

                const [existing] = await db.query(
                    "SELECT * FROM datasets WHERE user_id = ? AND filename = ?",
                    [userId, req.file.originalname]
                );

                if (existing.length > 0) {
                    return res.status(400).json({
                        error: "Такий файл вже існує"
                    });
                }

                const analysis = analyzeData(results);
                const corr = correlationMatrix(results);

                const [datasetResult] = await db.query(
                    "INSERT INTO datasets (user_id, filename, row_count, column_count, status) VALUES (?, ?, ?, ?, 'processing')",
                    [
                        userId,
                        req.file.originalname, 
                        results.length,
                        columnCount
                    ]
                );

                const datasetId = datasetResult.insertId;

                await db.query(
                    "INSERT INTO analysis_results (dataset_id, analysis_type, result_data) VALUES (?, 'basic', ?)",
                    [datasetId, JSON.stringify(analysis)]
                );

                await db.query(
                    "INSERT INTO analysis_results (dataset_id, analysis_type, result_data) VALUES (?, 'correlation', ?)",
                    [datasetId, JSON.stringify(corr)]
                );

                await db.query(
                    "UPDATE datasets SET status = 'ready' WHERE id = ?",
                    [datasetId]
                );

                res.json({
                    message: "CSV оброблено",
                    rows: results.length,
                    analysis,
                    correlation: corr
                })

            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
        })
        .on("error", (err) => {
            res.status(500).json({
                message: "CSV оброблено",
                error: err.message
            })
        }); 
};

exports.saveVisualization = async (req, res) => {
    try {
        const { dataset_id, viz_type, config } = req.body;

        if (!dataset_id || !config) {
            return res.status(400).json({ error: "Неповні дані" });
        }

        let parsedConfig;

        try {
            parsedConfig = typeof config === "string"
                ? JSON.parse(config)
                : config;
        } catch {
            return res.status(400).json({ error: "Invalid config JSON" });
        }

        const normalizedColumn = parsedConfig.column?.trim().toLowerCase();

        if (!normalizedColumn) {
            return res.status(400).json({ error: "Column is required" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Image not uploaded" });
        }

        const [existing] = await db.query(
            `SELECT * FROM visualizations 
             WHERE dataset_id = ? 
             AND viz_type = ? 
             AND column_name = ?`,
            [dataset_id, viz_type, normalizedColumn]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                error: "Такий графік вже існує"
            });
        }

        const fileName = req.file.filename;

        await db.query(
            `INSERT INTO visualizations 
            (dataset_id, viz_type, column_name, config, image_path) 
            VALUES (?, ?, ?, ?, ?)`,
            [
                dataset_id,
                viz_type,
                normalizedColumn,
                JSON.stringify(parsedConfig),
                fileName
            ]
        );

        res.json({ message: "Графік збережено" });

    } catch (err) {
        console.error("❌ SAVE VIZ ERROR:", err);
        res.status(500).json({ error: "Save error" });
    }
};

exports.getVisualizations = async (req, res) => {
    try {
        const { datasetId } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM visualizations WHERE dataset_id = ?",
            [datasetId]
        );

        const parsed = rows.map(v => {
            let config = v.config;

            try {
                if (typeof config === "string") {
                    config = JSON.parse(config);
                }
            } catch (e) {
                console.error("❌ JSON parse error:", config);
                config = {};
            }

            return {
                ...v,
                config
            }
        });

        res.json(parsed);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fetch error" });
    }
};

exports.getDatasets = async (req, res) => {
    try {
        let query = "";
        let params = [];

        if (req.user.role === "admin") {
            query = "SELECT * FROM datasets ORDER BY upload_date DESC";
        } else {
            query = "SELECT * FROM datasets WHERE user_id = ? ORDER BY upload_date DESC";
            params = [req.user.id];
        }

        const [results] = await db.query(query, params);

        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}; 

exports.getResults = async (req, res) => {

    try {

        const { datasetId } = req.params;
        const userId = req.user.id;

        const [results] = await db.query(
            `SELECT ar.analysis_type, ar.result_data
             FROM analysis_results ar
             JOIN datasets d ON ar.dataset_id = d.id
             WHERE ar.dataset_id = ? AND d.user_id = ?`,
             [datasetId, userId]
        );

        const response = {};

        results.forEach(r => {
            response[r.analysis_type] = 
                typeof r.result_data === "string"
                    ? JSON.parse(r.result_data)
                    : r.result_data;
        });

        res.json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
} 

exports.getFullDataset = async (req, res) => {
    const { id } = req.params;

    try {
        const [dataset] = await db.query(
            "SELECT * FROM datasets WHERE id = ?",
            [id]
        );

        if (!dataset.length) {
            return res.status(404).json({ error: "Dataset not found" });
        }

        const [analysis] = await db.query(
            "SELECT analysis_type, result_data FROM analysis_results WHERE dataset_id = ?",
            [id]
        );

        const [visualizations] = await db.query(
            "SELECT * FROM visualizations WHERE dataset_id = ?",
            [id]
        );

        const parsedAnalysis = {};
        analysis.forEach(a => {
            parsedAnalysis[a.analysis_type] = 
                typeof a.result_data === "string"
                    ? JSON.parse(a.result_data)
                    : a.result_data;
        });

        res.json({
            dataset: dataset[0],
            analysis: parsedAnalysis,
            visualizations
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Помилка сервера" });
    }

};

exports.deleteDataset = async (req, res) => {
    const datasetId = req.params.id;
    const userId = req.user.id;

    try {

        const [rows] = await db.query(
            "SELECT * FROM datasets WHERE id = ? AND user_id = ?",
            [datasetId, userId]
        );

        if (rows.length === 0) {
            return res.status(403).json({ error: "Немає доступу" });
        }

        const dataset = rows[0];

        
        const filePath = path.join(__dirname, "../../uploads", dataset.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await db.query(
            "DELETE FROM datasets WHERE id = ?",
            [datasetId]
        );

        res.json({ message: "Dataset видалено" });

    } catch (err) {
        console.error("❌ DELETE ERROR: ", err);
        res.status(500).json({ error: "Помилка сервера" });
    }

}