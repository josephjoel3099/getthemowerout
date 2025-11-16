// DOM Elements
const locationInput = document.getElementById('location-input');
const checkBtn = document.getElementById('check-btn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const resultDiv = document.getElementById('result');
const recommendationIcon = document.getElementById('recommendation-icon');
const recommendationText = document.getElementById('recommendation-text');
const recommendationDetail = document.getElementById('recommendation-detail');
const weatherDetails = document.getElementById('weather-details');
const reasonList = document.getElementById('reason-list');

// Event Listeners
checkBtn.addEventListener('click', handleCheckWeather);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCheckWeather();
    }
});

async function handleCheckWeather() {
    const location = locationInput.value.trim();
    
    if (!location) {
        showError('Please enter a location');
        return;
    }
    
    hideAll();
    showLoading();
    
    try {
        // Get coordinates from location
        const coords = await getCoordinates(location);
        
        // Get weather data
        const weather = await getWeatherData(coords.lat, coords.lon);
        
        // Analyze mowing conditions
        const analysis = analyzeMowingConditions(weather);
        
        // Display results
        displayResults(analysis, weather, coords.name);
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to fetch weather data. Please try again.');
    }
}

async function getCoordinates(location) {
    // Using Open-Meteo's geocoding API
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to find location');
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
        throw new Error('Location not found. Please try a different location.');
    }
    
    const result = data.results[0];
    return {
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        country: result.country
    };
}

async function getWeatherData(lat, lon) {
    // Using Open-Meteo API for comprehensive weather data
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_gusts_10m&hourly=temperature_2m,precipitation,weather_code,soil_moisture_0_to_1cm&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours&timezone=auto&forecast_days=3`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    return data;
}

function analyzeMowingConditions(weather) {
    const current = weather.current;
    const hourly = weather.hourly;
    const daily = weather.daily;
    
    const reasons = [];
    let canMow = true;
    
    // Current temperature
    const temp = current.temperature_2m;
    
    // Check temperature conditions
    if (temp < 7) {
        canMow = false;
        reasons.push({
            text: `Temperature too cold (${temp}°C). Grass below 7°C is dormant and shouldn't be mowed.`,
            type: 'negative'
        });
    } else if (temp > 28) {
        canMow = false;
        reasons.push({
            text: `Temperature too hot (${temp}°C). Mowing in extreme heat stresses the grass.`,
            type: 'negative'
        });
    } else {
        reasons.push({
            text: `Temperature is suitable (${temp}°C).`,
            type: 'positive'
        });
    }
    
    // Check if currently raining
    const isRaining = current.precipitation > 0 || current.rain > 0;
    if (isRaining) {
        canMow = false;
        reasons.push({
            text: `Currently raining (${current.precipitation}mm). Wait for rain to stop and grass to dry.`,
            type: 'negative'
        });
    } else {
        reasons.push({
            text: 'Not currently raining.',
            type: 'positive'
        });
    }
    
    // Check recent rain (last 6 hours)
    const currentHour = new Date().getHours();
    let recentRain = 0;
    for (let i = Math.max(0, currentHour - 6); i < currentHour; i++) {
        if (hourly.precipitation && hourly.precipitation[i]) {
            recentRain += hourly.precipitation[i];
        }
    }
    
    if (recentRain > 5) {
        canMow = false;
        reasons.push({
            text: `Significant recent rain (${recentRain.toFixed(1)}mm in last 6 hours). Grass likely still wet.`,
            type: 'negative'
        });
    } else if (recentRain > 1) {
        reasons.push({
            text: `Some recent rain (${recentRain.toFixed(1)}mm in last 6 hours). Check if grass is dry.`,
            type: 'negative'
        });
        canMow = false;
    }
    
    // Check soil moisture
    if (hourly.soil_moisture_0_to_1cm && hourly.soil_moisture_0_to_1cm[currentHour]) {
        const soilMoisture = hourly.soil_moisture_0_to_1cm[currentHour];
        if (soilMoisture > 0.4) {
            canMow = false;
            reasons.push({
                text: `Soil is waterlogged (moisture: ${(soilMoisture * 100).toFixed(0)}%). Wait for ground to dry.`,
                type: 'negative'
            });
        } else if (soilMoisture < 0.1) {
            canMow = false;
            reasons.push({
                text: `Soil very dry (moisture: ${(soilMoisture * 100).toFixed(0)}%). Possible drought conditions.`,
                type: 'negative'
            });
        }
    }
    
    // Check wind conditions
    const windSpeed = current.wind_speed_10m;
    const windGusts = current.wind_gusts_10m || windSpeed;
    
    if (windSpeed > 30 || windGusts > 40) {
        canMow = false;
        reasons.push({
            text: `Strong winds (${windSpeed} km/h, gusts ${windGusts} km/h). Unsafe and ineffective mowing.`,
            type: 'negative'
        });
    } else if (windSpeed > 20) {
        reasons.push({
            text: `Moderate winds (${windSpeed} km/h). Mowing possible but not ideal.`,
            type: 'negative'
        });
        canMow = false;
    } else {
        reasons.push({
            text: `Wind conditions acceptable (${windSpeed} km/h).`,
            type: 'positive'
        });
    }
    
    // Check for frost (temperature near or below 0°C in forecast)
    let frostForecast = false;
    const minTemp = daily.temperature_2m_min[0];
    if (minTemp <= 2) {
        frostForecast = true;
        canMow = false;
        reasons.push({
            text: `Frost risk (min temp ${minTemp}°C today). Wait for warmer conditions.`,
            type: 'negative'
        });
    }
    
    // Check winter cold spell (consecutive days below 10°C)
    let coldSpell = true;
    for (let i = 0; i < Math.min(3, daily.temperature_2m_max.length); i++) {
        if (daily.temperature_2m_max[i] >= 10) {
            coldSpell = false;
            break;
        }
    }
    
    if (coldSpell && temp < 10) {
        canMow = false;
        reasons.push({
            text: 'Winter cold spell detected. Grass is dormant and should not be mowed.',
            type: 'negative'
        });
    }
    
    // Check humidity (high humidity indicates wet grass)
    const humidity = current.relative_humidity_2m;
    if (humidity > 90) {
        canMow = false;
        reasons.push({
            text: `Very high humidity (${humidity}%). Grass likely wet from dew or moisture.`,
            type: 'negative'
        });
    } else if (humidity > 75) {
        reasons.push({
            text: `High humidity (${humidity}%). Check if grass is dry before mowing.`,
            type: 'positive'
        });
    }
    
    // Overall recommendation
    let recommendation = '';
    let icon = '';
    let detailText = '';
    
    if (canMow) {
        recommendation = 'YES, You Can Mow! ✓';
        icon = '✅';
        detailText = 'Weather conditions are suitable for mowing your lawn.';
    } else {
        recommendation = 'NO, Wait to Mow ✗';
        icon = '❌';
        detailText = 'Current conditions are not ideal for mowing. Check the analysis below.';
    }
    
    return {
        canMow,
        recommendation,
        icon,
        detailText,
        reasons
    };
}

function displayResults(analysis, weather, locationName) {
    // Set recommendation
    const recommendationDiv = document.querySelector('.recommendation');
    recommendationDiv.className = 'recommendation ' + (analysis.canMow ? 'good' : 'bad');
    recommendationIcon.textContent = analysis.icon;
    recommendationText.textContent = analysis.recommendation;
    recommendationDetail.textContent = analysis.detailText;
    
    // Set weather details
    const current = weather.current;
    weatherDetails.innerHTML = `
        <div class="weather-item">
            <div class="label">Temperature</div>
            <div class="value">${current.temperature_2m}°C</div>
        </div>
        <div class="weather-item">
            <div class="label">Humidity</div>
            <div class="value">${current.relative_humidity_2m}%</div>
        </div>
        <div class="weather-item">
            <div class="label">Wind Speed</div>
            <div class="value">${current.wind_speed_10m} km/h</div>
        </div>
        <div class="weather-item">
            <div class="label">Precipitation</div>
            <div class="value">${current.precipitation} mm</div>
        </div>
    `;
    
    // Set reasons
    reasonList.innerHTML = '';
    analysis.reasons.forEach(reason => {
        const li = document.createElement('li');
        li.className = reason.type;
        li.textContent = reason.text;
        reasonList.appendChild(li);
    });
    
    // Show results
    hideAll();
    resultDiv.classList.remove('hidden');
}

function showLoading() {
    loadingDiv.classList.remove('hidden');
    checkBtn.disabled = true;
}

function showError(message) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
    checkBtn.disabled = false;
}

function hideAll() {
    loadingDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    checkBtn.disabled = false;
}
