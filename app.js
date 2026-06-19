const SUPABASE_URL = "https://gshvckevlubgjengwnwf.supabase.co";
const API_KEY = "sb_publishable_RVd938UzHJMLtn2L-1yxXA_W86zy2TM";

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

        document.getElementById("distance").innerText = session.distance;
        document.getElementById("pace").innerText = session.pace;
        document.getElementById("elapsed").innerText = session.elapsed;
        document.getElementById("altitude").innerText = session.altitude;
        document.getElementById("dplus").innerText = session.dplus;
        document.getElementById("dminus").innerText = session.dminus;
        document.getElementById("lat").innerText = session.lat;
        document.getElementById("lon").innerText = session.lon;
    }
}

fetchData();

setInterval(fetchData, 5000);