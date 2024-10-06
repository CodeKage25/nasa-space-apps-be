const axios = require('axios');

// Fetch NASA data (e.g., temperature, precipitation) based on location
const getNASAData = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://power.larc.nasa.gov/api/temporal/daily/point`, {
      params: {
        parameters: 'T2M,PRECTOTCORR',
        latitude,
        longitude,
        start: '20200101', 
        end: '20211231',
            format: 'JSON',
            community: 'ag',
            header: 'true',
            'time-standard': 'lst'
        },
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }          
    });
    console.log(response)
      return response.data.properties.parameter;
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    throw new Error('Error fetching NASA data');
  }
};

// Fetch soil data (e.g., moisture, pH) based on location
const getSoilData = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://sdmdataaccess.nrcs.usda.gov/Tabular/post.rest`, {
      params: {
        lat: latitude,
        lon: longitude,
      },headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching soil data:', error);
    throw new Error('Error fetching soil data');
  }
};

module.exports = { getNASAData, getSoilData };
