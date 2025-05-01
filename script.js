// Time zone data: 24 time zones with respective city names
const timeZones = [
    { zone: 'America/New_York', utc: 'UTC-5' }, // Represents UTC-5
    { zone: 'Europe/London', utc: 'UTC+0' },
    { zone: 'Asia/Tokyo', utc: 'UTC+9' },
    { zone: 'Australia/Sydney', utc: 'UTC+10' },
    { zone: 'Europe/Paris', utc: 'UTC+1' }, // Represents UTC+1 (Berlin shares this)
    { zone: 'Europe/Moscow', utc: 'UTC+3' },
    { zone: 'Asia/Shanghai', utc: 'UTC+8' }, // Represents UTC+8 (Singapore, HK, etc.)
    { zone: 'Asia/Dubai', utc: 'UTC+4' },
    { zone: 'Africa/Cairo', utc: 'UTC+2' }, // Represents UTC+2 (Johannesburg shares this)
    { zone: 'America/Sao_Paulo', utc: 'UTC-3' }, // Represents UTC-3 (Buenos Aires shares this)
    { zone: 'America/Los_Angeles', utc: 'UTC-8' },
    { zone: 'America/Chicago', utc: 'UTC-6' }, // Represents UTC-6 (Mexico City shares this)
    { zone: 'Asia/Kolkata', utc: 'UTC+5:30' },
    { zone: 'Asia/Jakarta', utc: 'UTC+7' }, // Represents UTC+7 (Bangkok shares this)
];

// Function to update the digital time
function updateDigitalTime(zone, city) {
    const timeElement = document.getElementById(`${zone}Time`);
    const dateElement = document.getElementById(`${zone}Date`);

    const now = new Date();
    const time = new Date(now.toLocaleString('en-US', { timeZone: city }));

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const day = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();
    
    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    const hours12 = hours % 12 || 12;

    const formattedTime = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    const formattedDate = `${month}/${day}/${year}`;

    timeElement.innerHTML = formattedTime;
    dateElement.innerHTML = formattedDate;
}

// Function to update the analog clock hands
function updateAnalogClock(zone, city) {
    const canvas = document.getElementById(`${zone}-canvas`);
    const ctx = canvas.getContext('2d');
    const now = new Date();
    
    const time = new Date(now.toLocaleString('en-US', { timeZone: city }));

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Set canvas size to match CSS (160x160)
    canvas.width = 160;
    canvas.height = 160;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Clock measurements
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const clockRadius = 70;
    const hourHandLength = 40;
    const minuteHandLength = 55;
    const secondHandLength = 65;
    const tickLength = 8;

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, clockRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw clock ticks (hour markers)
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 - Math.PI/2;
        const x1 = centerX + Math.cos(angle) * (clockRadius - tickLength);
        const y1 = centerY + Math.sin(angle) * (clockRadius - tickLength);
        const x2 = centerX + Math.cos(angle) * clockRadius;
        const y2 = centerY + Math.sin(angle) * clockRadius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Calculate angles with -π/2 offset to start at top (12 o'clock)
    // Hour hand (includes minute movement for smoothness)
    const hourAngle = (Math.PI * 2) * ((hours % 12) / 12) + 
                     (Math.PI * 2) * (minutes / 720) - 
                     Math.PI/2;
    
    // Minute hand (includes second movement for smoothness)
    const minuteAngle = (Math.PI * 2) * (minutes / 60) + 
                        (Math.PI * 2) * (seconds / 3600) - 
                        Math.PI/2;
    
    // Second hand
    const secondAngle = (Math.PI * 2) * (seconds / 60) - Math.PI/2;

    // Draw hour hand
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(hourAngle) * hourHandLength,
        centerY + Math.sin(hourAngle) * hourHandLength
    );
    ctx.stroke();

    // Draw minute hand
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(minuteAngle) * minuteHandLength,
        centerY + Math.sin(minuteAngle) * minuteHandLength
    );
    ctx.stroke();

    // Draw second hand
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(secondAngle) * secondHandLength,
        centerY + Math.sin(secondAngle) * secondHandLength
    );
    ctx.stroke();

    // Draw center cap
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Function to create a time zone block
function createTimeZone(zoneData) {
    const container = document.querySelector('.clock-grid');
    
    const timeZoneDiv = document.createElement('div');
    timeZoneDiv.classList.add('time-zone');
    timeZoneDiv.id = zoneData.utc.replace('+', 'plus').replace('-', 'minus'); // Create ID from UTC
    timeZoneDiv.style.display = 'flex';

    const utcDisplay = document.createElement('h2');
    utcDisplay.textContent = zoneData.utc;
    utcDisplay.classList.add('utc-display');
    timeZoneDiv.appendChild(utcDisplay);

    const canvas = document.createElement('canvas');
    canvas.id = `${zoneData.utc.replace('+', 'plus').replace('-', 'minus')}-canvas`;
    canvas.classList.add('clock-canvas');
    timeZoneDiv.appendChild(canvas);

    const digitalTime = document.createElement('p');
    digitalTime.id = `${zoneData.utc.replace('+', 'plus').replace('-', 'minus')}Time`;
    digitalTime.classList.add('digital-time');
    timeZoneDiv.appendChild(digitalTime);

    const date = document.createElement('p');
    date.id = `${zoneData.utc.replace('+', 'plus').replace('-', 'minus')}Date`;
    date.classList.add('date');
    timeZoneDiv.appendChild(date);

    container.appendChild(timeZoneDiv);
}


// Search functionality
function searchTimezones() {
    const searchTerm = document.getElementById('timezoneSearch').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchTerm) {
        resultsContainer.textContent = '';
        timeZones.forEach(zone => {
            document.getElementById(zone.utc.replace('+', 'plus').replace('-', 'minus')).style.display = 'flex';
        });
        return;
    }

    const matchingZones = timeZones.filter(zone => 
        zone.utc.toLowerCase().includes(searchTerm)
    );

    if (matchingZones.length === 0) {
        resultsContainer.textContent = 'No matching UTC offset found';
        timeZones.forEach(zone => {
            document.getElementById(zone.utc.replace('+', 'plus').replace('-', 'minus')).style.display = 'none';
        });
        return;
    }

    // Hide all first
    timeZones.forEach(zone => {
        document.getElementById(zone.utc.replace('+', 'plus').replace('-', 'minus')).style.display = 'none';
    });

    // Show matching ones
    matchingZones.forEach(zone => {
        document.getElementById(zone.utc.replace('+', 'plus').replace('-', 'minus')).style.display = 'flex';
    });

    resultsContainer.textContent = `Showing UTC offset ${matchingZones[0].utc}`;
}
// Initialize the app
function init() {
    // Create one clock per unique UTC offset
    timeZones.forEach(zone => createTimeZone(zone));
    
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
}

// Update all clocks
function updateAllClocks() {
    timeZones.forEach(zone => {
        updateDigitalTime(zone.utc.replace('+', 'plus').replace('-', 'minus'), zone.zone);
        updateAnalogClock(zone.utc.replace('+', 'plus').replace('-', 'minus'), zone.zone);
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

document.getElementById('searchButton').addEventListener('click', searchTimezones);
document.getElementById('timezoneSearch').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchTimezones();
});