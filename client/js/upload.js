let chart;
let globalAnalysis = {};
let currentDatasetId = null;

function getToken() {
    return localStorage.getItem("token");
}

async function upload() {
    const file = document.getElementById("file").files[0];

    if (!file) {
        alert("Оберіть файл");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + getToken()
        },
        body: formData
    });
    
    if (res.ok) {
        alert("Файл оброблено успішно");
    } else {
        const data = await res.json();
        alert(data.error || "Помилка збереження");
        return;
    }

    const data = await res.json();

    globalAnalysis = data.analysis;

    populateColumns(globalAnalysis);

    renderChart(Object.keys(globalAnalysis)[0], "bar");

    renderHeatmap(data.correlation);

    loadHistory();
}

function renderChart(column, type) {
    const value = globalAnalysis[column];

    if (!value) {
        console.error("❌ Column not found: ", column);
        return;
    }

    const ctx = document.getElementById("chart").getContext("2d");

    if (chart) chart.destroy();

    let config = {};

    const baseData = [value.mean, value.min, value.max];
    const labels = ["mean", "min", "max"];

    switch (type) {

        case "bar":
        case "line":
            config = {
                type,
                data: {
                    labels,
                    datasets: [{
                        label: column,
                        data: baseData
                    }]
                }
            };
            break;

        case "pie":
        case "doughnut":
        case "polarArea":
            config = {
                type,
                data: {
                    labels,
                    datasets: [{
                        data: baseData
                    }]
                }
            };
            break;

        case "radar":
            config = {
                type: "radar",
                data: {
                    labels,
                    datasets: [{
                        label: column,
                        data: baseData
                    }]
                }
            };
            break;

        case "scatter":
            config = {
                type: "scatter",
                data: {
                    datasets: [{
                        label: column,
                        data: [
                            { x: 1, y: value.min },
                            { x: 2, y: value.mean },
                            { x: 3, y: value.max }
                        ]
                    }]
                }
            };
            break;

        case "bubble":
            config = {
                type: "bubble",
                data: {
                    datasets: [{
                        label: column,
                        data: [
                            { x: 1, y: value.min, r: 5 },
                            { x: 2, y: value.mean, r: 10 },
                            { x: 3, y: value.max, r: 15}
                        ]
                    }]
                }
            };
            break;

        default:
            console.warn("Unknown chart type:", type);
            return;
    }

    chart = new Chart(ctx, config);
}

function populateColumns(analysis) {
    const select = document.getElementById("columnSelect");

    if (!select) {
        console.error("❌ columnSelect not found");
        return;
    }

    if (!analysis || typeof analysis !== "object") {
        console.error("❌ Invalid analysis data:", analysis);
        return;
    }

    select.innerHTML = "";

    Object.keys(analysis).forEach(col => {
        const option = document.createElement("option");
        option.value = col;
        option.textContent = col;
        select.appendChild(option);
    });
}

function updateChart() {
    const column = document.getElementById("columnSelect").value;
    const type = document.getElementById("chartType").value;

    renderChart(column, type);
}

function renderHeatmap(corr) {
    const container = document.getElementById("heatmap");
    container.innerHTML = "";

    const table = document.createElement("table");
    table.className = `
        min-w-full
        border
        border-gray-200
        text-sm
        text-center
        rounded-lg
        overflow-hidden
    `;

    const cols = Object.keys(corr);

    let header = "<tr><th></th>";
    cols.forEach(c => header += `<th>${c}</th>`);
    header += "</tr>";

    table.innerHTML = header;

    cols.forEach(row => {
        let tr = `<tr><td>${row}</td>`;

        cols.forEach(col => {
            const val = corr[row][col];

            if (val === null || val === undefined || isNaN(val)) {
                tr += `<td style="background:#eee">-</td>`;
            } else {
                const color = getHeatColor(val);
                tr += `<td style="
                    background:${color};
                    text-align: center;
                    padding: 6px;
                    cursor: pointer;
                    font-size: 12px;
                "
                title="Correlation: ${val.toFixed(2)}">
                    ${val.toFixed(2)}
                </td>`;
            }
        });

        tr += "</tr>";
        table.innerHTML += tr;
    });

    container.appendChild(table);
}

function getHeatColor(val) {
    if (val > 0) {
        return `rgba(0, 0, 255, ${val})`;
    } else {
        return `rgba(255, 0, 0, ${Math.abs(val)})`;
    }
}

async function saveChart() {
    const column = document.getElementById("columnSelect").value;
    const chartType = document.getElementById("chartType").value;

    if (!currentDatasetId) {
        alert("Немає dataset");
        return;
    }

    const canvas = document.getElementById("chart");

    const blob = await new Promise(resolve => 
        canvas.toBlob(resolve, "image/png")
    );

    const formData = new FormData();
    formData.append("image", blob, "chart.png");
    formData.append("dataset_id", currentDatasetId);
    formData.append("viz_type", chartType);
    formData.append("config", JSON.stringify({ column }));

    const res = await fetch("/api/visualizations", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + getToken()
        },
        body: formData
    });

    if (res.ok) {
        alert("Графік збережено");
        loadVisualizations(currentDatasetId);
    } else {
        const data = await res.json();
        alert(data.error || "Помилка збереження");
        return;
    }
}

async function loadVisualizations(datasetId) {
    const res = await fetch(`/api/visualizations/${datasetId}`, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();

    const list = document.getElementById("savedCharts");
    list.className = `
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-4
    `;
    list.innerHTML = "";

    data.forEach(v => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <b>${v.viz_type}</b> (${v.config.column})
            </div>
        `;

        if (v.image_path) {
            const img = document.createElement("img");
            img.src = `/uploads/${v.image_path}`;
            
            img.className = `
                w-full
                h-40 sm:h-48 md:h-56
                object-contain
                rounded-lg
                bg-gray-50
                p-2
            `;

            li.appendChild(img);
        }

        li.onclick = () => {
            renderChart(v.config.column, v.viz_type);
        };

        list.appendChild(li);
    });

}

async function loadHistory() {
    try {
        const res = await fetch("/api/datasets", {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Server error:", text);
            alert("Не вдалося завантажити історію");
            return;
        }

        const data = await res.json();

        const list = document.getElementById("history");
        list.innerHTML = "";

        data.forEach(d => {
            const li = document.createElement("li");

            li.innerHTML = `
                <div class="flex justify-between items-center bg-gray-50 p-2 rounded hover:bg-gray-100">
                    <span class="cursor-pointer">
                        ${d.filename} (${d.row_count})
                        <span class="text-xs text-gray-500">[${d.status}]</span>
                    </span>

                    <button class="text-red-500 hover:text-red-700 text-xs">
                        🗑
                    </button>
                </div>
            `;

            li.querySelector("span").onclick = () => loadResults(d.id);

            li.querySelector("button").onclick = (e) => {
                e.stopPropagation();
                deleteDataset(d.id);
            };

            list.appendChild(li);
        });

        if (data.length > 0) {
            loadResults(data[0].id);
        }

    } catch (err) {
        console.error("Fetch error:", err);
        alert("Помилка з'єднання з сервером");
    }
}

async function loadResults(datasetId) {

    currentDatasetId = datasetId;

    try {
        const res = await fetch(`/api/results/${datasetId}`, {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });

        const data = await res.json();

        if (!res.ok) {
            alert("Error loading results");
            return;
        }

        processAnalysis(data);

        highlightActiveDataset(datasetId);

        loadVisualizations(datasetId);

    } catch (err) {
        console.error("FETCH ERROR:", err);
    }
}

function highlightActiveDataset(id) {
    const items = document.querySelectorAll("#history li");

    items.forEach(li => {
        li.style.fontWeight = "normal";

        if (li.dataset.id == id) {
            li.style.fontWeight = "bold";
        }
    });
}

function processAnalysis(data) {
    try {
        const rawAnalysis = data.basic || data;
        
        if (!rawAnalysis || Object.keys(rawAnalysis).length === 0) {
            console.error("❌ No analysis data");
            return;
        }

        const normalized = {};

        Object.keys(rawAnalysis).forEach(key => {
            const cleanKey = key.trim().toLowerCase();
            normalized[cleanKey] = rawAnalysis[key];
        });
        
        globalAnalysis = normalized;

        populateColumns(globalAnalysis);

        const firstColumn = Object.keys(globalAnalysis)[0];

        if (firstColumn) {
            renderChart(firstColumn, "bar");
        }

        if (data.correlation) {
            renderHeatmap(data.correlation);
        }

    } catch (err) {
        console.error("FETCH ERROR:", err);
    }
}

async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let y = 15;

    pdf.setFontSize(20);
    pdf.text("Data Analytics Report", 10, y);

    y += 10;

    pdf.setFontSize(14);
    pdf.text("Summary", 10, y);
    y += 8;

    pdf.setFontSize(10);

    const firstCol = Object.keys(globalAnalysis)[0];
    const val = globalAnalysis[firstCol];

    if (val) {
        pdf.text(`Column: ${firstCol}`, 10, y); y += 6;
        pdf.text(`Mean: ${val.mean}`, 10, y); y += 6;
        pdf.text(`Min: ${val.min}`, 10, y); y += 6;
        pdf.text(`Max: ${val.max}`, 10, y); y += 10;
    }

    pdf.setFontSize(14);
    pdf.text("chart", 10, y);
    y += 8;

    if (chart) {
        const chartImg = chart.toBase64Image();
        pdf.addImage(chartImg, "PNG", 10, y, 180, 80);
        y += 90;
    }

    pdf.addPage();

    pdf.setFontSize(14);
    pdf.text("Correlation Heatmap", 10, 15);

    const heatmapElement = document.getElementById("heatmap");
    const canvas = await html2canvas(heatmapElement, {
        scale: 2
    });

    const imgData = canvas.toDataURL("image/png");

    pdf.addImage(imgData, "PNG", 10, 25, 180, 120);

    pdf.save("report.pdf");
}

async function deleteDataset(id) {
    const confirmDelete = confirm("Видалити датасет?");
    if (!confirmDelete) return;

    try {
        const res = await fetch(`/api/datasets/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Помилка");
            return;
        }

        alert("Dataset видалено");

        loadHistory();

        if (currentDatasetId == id) {
            currentDatasetId = null;
            document.getElementById("chart").getContext("2d").clearRect(0,0,400,200);
            document.getElementById("heatmap").innerHTML = "";
        }

    } catch (err) {
        console.error(err);
        alert("Помилка сервера");
    }

}

loadHistory();