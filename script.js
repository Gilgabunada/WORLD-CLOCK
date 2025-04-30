function updateTime() {
    const newYorkTime = document.getElementById("newYorkTime");
    const londonTime = document.getElementById("londonTime");
    const tokyoTime = document.getElementById("tokyoTime");
    const sydneyTime = document.getElementById("sydneyTime");
    const parisTime = document.getElementById("parisTime");

    // New York (UTC-5)
    newYorkTime.innerHTML = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour12: true });

    // London (UTC)
    londonTime.innerHTML = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', hour12: true });

    // Tokyo (UTC+9)
    tokyoTime.innerHTML = new Date().toLocaleString('en-JP', { timeZone: 'Asia/Tokyo', hour12: true });

    // Sydney (UTC+10)
    sydneyTime.innerHTML = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour12: true });

    // Paris (UTC+2)
    parisTime.innerHTML = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris', hour12: true });
}

// Update the time every second
setInterval(updateTime, 1000);

// Initial time load
updateTime();
