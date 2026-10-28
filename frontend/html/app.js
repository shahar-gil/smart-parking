async function fetchLogs() {
    try {
        const response = await fetch('/api/plates');
        const data = await response.json();
        
        document.getElementById('totalCars').innerText = data.total;
        
        const logsDiv = document.getElementById('logs');
        logsDiv.innerHTML = '';
        
        data.cars.forEach(car => {
            const date = new Date(car.entryTime).toLocaleString('he-IL');
            const el = document.createElement('div');
            el.className = 'log-item';
            el.innerText = `מספר רישוי: ${car.plate} | שעת כניסה: ${date}`;
            logsDiv.appendChild(el);
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}

setInterval(fetchLogs, 3000);
fetchLogs();