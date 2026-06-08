function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function analyzeData(data) {
    if (!data.length) return {};

    const columns = Object.keys(data[0]);
    const result = {};

    columns.forEach(col => {
        const values = data
            .map(row => row[col])
            .filter(v => !isNaN(parseFloat(v)))
            .map(Number);

        if (values.length === 0) return;

        values.sort((a, b) => a - b);

        const n = values.length;

        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / n;

        const min = values[0];
        const max = values[n - 1];

        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;

        const std = Math.sqrt(variance);

        const median = n % 2 === 0
            ? (values[n / 2 - 1] + values[n / 2]) / 2
            : values[Math.floor(n / 2)];

        const q1 = values[Math.floor(n * 0.25)];
        const q3 = values[Math.floor(n * 0.75)];

        const iqr = q3 - q1;

        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        const outliers = values.filter(v => v < lowerBound || v > upperBound);

        result[col] = {
            count: n,
            mean: Number(mean.toFixed(2)),
            min,
            max,
            variance: Number(variance.toFixed(2)),
            std: Number(std.toFixed(2)),
            median: Number(median.toFixed(2)),
            q1,
            q3,
            iqr: Number(iqr.toFixed(2)),
            outliers
        };
    });

    return result;
}

function correlation(x, y) {
    const n = x.length;

    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let denX = 0;
    let denY = 0;

    for (let i = 0; i < n; i++) {
        const dx = x[i] - meanX;
        const dy = y[i] - meanY;

        num += dx * dy;
        denX += dx * dx;
        denY += dy * dy;
    }

    return num / Math.sqrt(denX * denY);
}

function getNumericColumns(data) {
    const columns = Object.keys(data[0]);

    return columns.filter(col => 
        data.every(row => !isNaN(parseFloat(row[col])))
    );
}

function correlationMatrix(data) {
    const numericCols = getNumericColumns(data);
    const matrix = {};

    numericCols.forEach(col1 => {
        matrix[col1] = {};

        numericCols.forEach(col2 => {
            const x = data.map(r => Number(r[col1]));
            const y = data.map(r => Number(r[col2]));

            matrix[col1][col2] = Number(correlation(x, y).toFixed(2));
        });
    });

    return matrix;
}

module.exports = { analyzeData, correlationMatrix };