const SUPABASE_URL = "https://gshvckevlubgjengwnwf.supabase.co";
const API_KEY = "sb_publishable_RVd938UzHJMLtn2L-1yxXA_W86zy2TM";

let map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 17,
        attribution: 'OpenTopoMap'
    }
).addTo(map);

let marker = L.marker([48.8566, 2.3522]).addTo(map);

/* ===== NEW VARIABLES ===== */

let historyMarkers = [];
let lastBreadcrumbTime = 0;
let previousElapsed = 0;

/* ========================= */

function formatElapsed(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

/* ===== PURGE OLD SESSION ===== */

function clearHistory() {

    historyMarkers.forEach(m => {
        map.removeLayer(m);
    });

    historyMarkers = [];
    lastBreadcrumbTime = 0;
}

/* ============================ */

async function fetchData() {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/live_sessions?session_id=eq.TEST001`,
        {
            headers: {
                "apikey": API_KEY,
                "Authorization": `Bearer ${API_KEY}`
            }
        }
    );

    const data = await response.json();

    if (data.length > 0) {

        const session = data[0];

        /* ===== Detect new activity ===== */

        if (session.elapsed < previousElapsed) {

            clearHistory();

        }

        previousElapsed = session.elapsed;

        /* =============================== */

        document.getElementById("distance").innerText =
            Number(session.distance).toFixed(2);

        document.getElementById("pace").innerText =
            session.pace;

        document.getElementById("elapsed").innerText =
            formatElapsed(session.elapsed);

        document.getElementById("altitude").innerText =
            Math.round(session.altitude);

        document.getElementById("dplus").innerText =
            Math.round(session.dplus);

        document.getElementById("dminus").innerText =
            Math.round(session.dminus);

        document.getElementById("lat").innerText =
            Number(session.lat).toFixed(5);

        document.getElementById("lon").innerText =
            Number(session.lon).toFixed(5);

        let lat = Number(session.lat);
        let lon = Number(session.lon);

        /* ===== Breadcrumb every 120 sec ===== */

        if (session.elapsed - lastBreadcrumbTime >= 120) {

            let oldMarker = L.circleMarker(
                [lat, lon],
                {
                    radius: 6,
                    color: 'red',
                    fillColor: 'white',
                    fillOpacity: 1,
                    weight: 2
                }
            ).addTo(map);

            historyMarkers.push(oldMarker);

            lastBreadcrumbTime = session.elapsed;
        }

        /* ==================================== */

        marker.setLatLng([lat, lon]);

        map.setView([lat, lon], map.getZoom());
    }
}

fetchData();

setInterval(fetchData, 5000);
