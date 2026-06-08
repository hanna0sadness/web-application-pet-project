const token = localStorage.getItem("token");

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

const user = parseJwt(token);

if (!token || !user || user.role !== "admin") {
    alert("Доступ тільки для адміністратора");
    window.location.href = "index.html";
}

function renderEmptyState() {
    document.getElementById("datasetInfo").innerHTML = `
        <div class="text-center text-gray-400 py-10">
            <div class="text-4xl mb-2">📂</div>
            <p class="text-lg font-semibold">Датасет не вибрано</p>
            <p class="text-sm">Обери файл зліва, щоб побачити аналітику</p>
        </div>
    `;

    document.getElementById("analysis").textContent = "";

    document.getElementById("heatmap").innerHTML = `
        <div class="text-center text-gray-400 py-10">
            🔥 Немає даних для кореляції
        </div>
    `;

    document.getElementById("visualizations").innerHTML = `
        <div class="text-center text-gray-400 py-10 col-span-full">
            📈 Немає збережених графіків
        </div>
    `;
}

async function loadDatasets() {
    const res = await fetch("/api/datasets", {
        headers: {
            "Authorization": "Bearer " + token
        } 
    });

    const data = await res.json();
    
    const list = document.getElementById("datasetList");
    list.innerHTML = "";

    data.forEach(d => {
        const li = document.createElement("li");
        li.className = "cursor-pointer hover:text-blue-500";
        li.textContent = d.filename;

        li.onclick = () => loadDataset(d.id);

        list.appendChild(li);
    });
}

async function loadDataset(id) {
    const res = await fetch(`/api/datasets/${id}/full`, {
        headers: {  
            "Authorization": "Bearer " + token
        }
    });

    const data = await res.json();

    renderDatasetInfo(data.dataset);
    renderAnalysis(data.analysis);

    const correlation = data.analysis?.correlation || data.correlation;
    
    console.log("FULL RESPONSE:", data);
    console.log("CORRELATION RAW:", data.analysis?.correlation, data.correlation);

    renderHeatmap(correlation);

    renderVisualizations(data.visualizations);
}

function renderDatasetInfo(dataset) {
    document.getElementById("datasetInfo").innerHTML = `
        <h2 class="text-xl font-bold text-center">${dataset.filename}</h2>
        <p>Rows: ${dataset.row_count}</p>
        <p>Columns: ${dataset.column_count}</p>
    `;
}

function renderAnalysis(analysis) {
    document.getElementById("analysis").textContent = 
        JSON.stringify(analysis.basic, null, 2);
}

function renderHeatmap(corr) {
    if (!corr || typeof corr !== "object") {
        document.getElementById("heatmap").innerHTML = `
            <div class="text-center text-gray-400 py-10">
                🔥 Немає даних для кореляції
            </div>
        `;
        return;
    }

    const container = document.getElementById("heatmap");
    container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "overflow-auto";

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

    let thead = `<thead class="bg-gray-100 sticky top-0 z-10">
        <tr>
            <th class="p-2 border"></th>`;

    cols.forEach(c => {
        thead += `<th class="p-2 border font-semibold">${c}</th>`;
    });

    thead += "</tr></thead>";

    let tbody = "<tbody>";

    cols.forEach(row => {
        let tr = `<tr class="hover:bg-gray-50 transition">
            <td class="p-2 border font-semibold bg-gray-50">${row}</td>`;

        cols.forEach(col => {
            const val = corr[row]?.[col];

            if (typeof val !== "number") {
                tr += `<td class="p-2 border bg-gray-100">—</td>`;
                return;
            }
            
            const intensity = Math.abs(val);

            const bg = `rgba(59, 130, 246, ${intensity})`;

            tr += `
                <td
                    class="p-2 border"
                    style="background:${bg}"
                    title="${val.toFixed(3)}"
                >
                    ${val.toFixed(2)}
                </td>
            `;
        });

        tr += "</tr>";
        tbody += tr;
    });

    tbody += "</tbody>";

    table.innerHTML = thead + tbody;
    wrapper.appendChild(table);
    container.appendChild(wrapper);
}

function renderVisualizations(viz) {
    const container = document.getElementById("visualizations");
    container.innerHTML = "";

    viz.forEach(v => {
        const card = document.createElement("div");

        card.className = `
            bg-white
            rounded-xl
            shadow
            p-3
            flex
            flex-col
            gap-2
        `;

        card.innerHTML = `
            <div class="text-sm font-semibold text-gray-700">
                ${v.viz_type} (${v.config.column})
            </div>
        `;

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

        card.appendChild(img);
        container.appendChild(card);
    });
}

renderEmptyState();
loadDatasets();