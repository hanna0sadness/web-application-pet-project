const db = require("../config/db");

exports.getDashboard = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT COUNT(*) AS totalUsers FROM users 
        `);

        const [datasets] = await db.query(`
            SELECT COUNT(*) AS totalDatasets FROM datasets 
        `);

        const [results] = await db.query(`
            SELECT COUNT(*) AS totalResults FROM analysis_results 
        `);

        const [visualizations] = await db.query(`
            SELECT COUNT(*) AS totalVisualizations FROM visualizations 
        `);

        res.json({
            totalUsers: users[0].totalUsers,
            totalDatasets: datasets[0].totalDatasets,
            totalResults: results[0].totalResults,
            totalVisualizations: visualizations[0].totalVisualizations
        });

    } catch (err) {
        console.error("❌ DASHBOARD ERROR: ", err);
        res.status(500).json({ error: "Помилка сервера" });
    }
};