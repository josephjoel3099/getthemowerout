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
- **Weather Data**: [Open-Meteo API](https://open-meteo.com/) (free, no API key required)
- **Hosting**: GitHub Pages

## Files

- `index.html` - Main application page
- `style.css` - Styling and theme
- `script.js` - Weather fetching and mowing logic
- `demo.html` - Demo page with sample data (for testing/preview)

## Local Development

1. Clone the repository
2. Open `index.html` in a web browser, or
3. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```
4. Visit `http://localhost:8000`

## Disclaimer

This tool provides guidance only. Use your judgment for final mowing decisions based on local conditions and grass type.
