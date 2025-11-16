# 🌱 Should I Mow My Lawn?

A simple website that helps UK residents decide if it's suitable to mow their grass based on current weather conditions.

## Live Website

Visit: [getthemowerout.github.io](https://getthemowerout.github.io)

## Features

- **Location-based weather checking**: Enter any UK town, city, or postcode
- **Comprehensive mowing analysis**: Evaluates multiple weather factors
- **Clear recommendations**: Visual feedback showing whether you should mow or wait
- **Detailed weather information**: Current temperature, humidity, wind speed, and precipitation
- **Mobile-friendly**: Responsive design works on all devices

## Mowing Rules

The website recommends **avoiding mowing** if any of these conditions are present:

- ❌ Grass is wet (high humidity > 90%)
- ❌ Currently raining
- ❌ Recent rain (within last 6 hours)
- ❌ Waterlogged soil (soil moisture > 40%)
- ❌ Temperature below 7°C (grass is dormant)
- ❌ Temperature above 28°C (extreme heat stresses grass)
- ❌ Frost forecast or risk
- ❌ Strong winds (> 30 km/h)
- ❌ Drought conditions (soil moisture < 10%)
- ❌ Winter cold spells

The website recommends **mowing is safe** when:

✅ Temperature is mild (7-28°C)
✅ No rain or recent precipitation
✅ Low to moderate humidity
✅ Light winds
✅ Soil moisture is normal

## Technology

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks)
- **Backend API**: Serverless Node.js function (Vercel/Netlify compatible)
- **Weather Data**: [Open-Meteo API](https://open-meteo.com/) (free, no API key required)
- **Hosting**: GitHub Pages (frontend), Vercel (API)

## Files

- `index.html` - Main application page
- `style.css` - Styling and theme
- `script.js` - Weather fetching and mowing logic
- `demo.html` - Demo page with sample data (for testing/preview)
- `api/check-mowing.js` - Serverless API endpoint
- `api-docs.html` - API documentation and testing interface
- `vercel.json` - Vercel deployment configuration
- `package.json` - Node.js project configuration

## API Endpoint

The project includes a REST API that can be used to programmatically check mowing conditions.

### Endpoint

```
POST /api/check-mowing
```

### Request Body

```json
{
  "location": "London"
}
```

### Response

```json
{
  "success": true,
  "canMow": true,
  "location": {
    "name": "London",
    "country": "United Kingdom",
    "latitude": 51.5074,
    "longitude": -0.1278
  },
  "recommendation": "YES, You Can Mow!",
  "details": "Weather conditions are suitable for mowing your lawn.",
  "weather": {
    "temperature": 18.5,
    "humidity": 65,
    "windSpeed": 12,
    "precipitation": 0,
    "conditions": [...]
  },
  "timestamp": "2025-11-16T12:00:00.000Z"
}
```

### Key Response Field

- **`canMow`**: `true` if mowing is advised, `false` if you should wait

### API Documentation

For complete API documentation and to test the API interactively, visit:
- **API Docs**: [api-docs.html](api-docs.html)

### Using the API

**cURL Example:**
```bash
curl -X POST https://yourdomain.com/api/check-mowing \
  -H "Content-Type: application/json" \
  -d '{"location": "Manchester"}'
```

**JavaScript Example:**
```javascript
const response = await fetch('https://yourdomain.com/api/check-mowing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ location: 'London' })
});
const data = await response.json();
console.log(data.canMow); // true or false
```

**Python Example:**
```python
import requests

response = requests.post('https://yourdomain.com/api/check-mowing', 
  json={'location': 'Birmingham'})
data = response.json()
print(data['canMow'])  # True or False
```

## Local Development

1. Clone the repository
2. Open `index.html` in a web browser, or
3. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```
4. Visit `http://localhost:8000`

## API Deployment

To deploy the API to Vercel:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel deploy
   ```

The API will be available at: `https://your-project.vercel.app/api/check-mowing`

## Disclaimer

This tool provides guidance only. Use your judgment for final mowing decisions based on local conditions and grass type.
