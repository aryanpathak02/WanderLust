// const fetch = require('node-fetch'); // Ensure you have node-fetch installed

async function getLatLong(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const response = await fetch(url);
  const geocodeData = await response.json();

  if (geocodeData.length > 0) {
    return {
      latitude: parseFloat(geocodeData[0].lat),
      longitude: parseFloat(geocodeData[0].lon),
    };
  } else {
    throw new Error('Location not found');
  }
}

// Wrap the call in an async function
async function testGetLatLong() {
  try {
    let data = await getLatLong("J-1 Room no - 304 shree sai Complex Dadra nagar haveli");
    console.log(data);
    console.log(data.latitude);

  } catch (error) {
    console.error(error);
  }
}

testGetLatLong();
