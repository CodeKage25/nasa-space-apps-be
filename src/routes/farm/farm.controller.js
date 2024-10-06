const Farm = require('../../model/farm.mongo');
const { getNASAData, getSoilData } = require('../../services/externalData');

// Assess soil quality based on location and plant type
const assessSoil = async (req, res) => {
  try {
    const { plantType, location } = req.body;

    // Fetch environmental data
    const nasaData = await getNASAData(location.latitude, location.longitude);
    // const soilData = await getSoilData(location.latitude, location.longitude);
      console.log(nasaData)

    // Perform soil quality assessment
    const assessmentResult = generateSoilAssessment(plantType, nasaData);

    // Save farm request to the database
    const farm = new Farm({
      plantType,
      location,
      soilAssessment: assessmentResult.assessment,
      recommendations: assessmentResult.recommendations,
    });
    await farm.save();

    res.status(200).json({
      message: 'Soil assessment completed',
      farm,
      nasaData, 
    });
  } catch (error) {
    console.error('Error in assessSoil:', error);
    res.status(500).json({ message: 'Error performing soil assessment', error });
  }
};

// Function to generate soil quality assessment using NASA data
// const generateSoilAssessment = (plantType, nasaData) => {
//     const optimalConditions = getOptimalConditions(plantType);
//     const recommendations = [];
  
//     // Example assessment based on precipitation and temperature
//     const avgTemperature = nasaData.T2M ? nasaData.T2M.reduce((a, b) => a + b, 0) / nasaData.T2M.length : null;
//     const avgPrecipitation = nasaData.PRECTOTCORR ? nasaData.PRECTOTCORR.reduce((a, b) => a + b, 0) / nasaData.PRECTOTCORR.length : null;
  
//     if (avgPrecipitation < optimalConditions.precipitation) {
//       recommendations.push('Increase irrigation.');
//     }
//     if (avgTemperature && (avgTemperature < optimalConditions.minTemp || avgTemperature > optimalConditions.maxTemp)) {
//       recommendations.push('Adjust crop variety for temperature tolerance.');
//     }
  
//     const assessment = recommendations.length === 0 ? 'Soil is suitable' : 'Soil needs improvement';
//     return { assessment, recommendations };
//   };
const generateSoilAssessment = (plantType, nasaData) => {
    const optimalConditions = getOptimalConditions(plantType);
    const recommendations = [];
  
    // Example assessment based on precipitation and temperature
    const temperatures = nasaData.T2M; // Adjust based on actual data structure
    const precipitations = nasaData.PRECTOTCORR; // Adjust based on actual data structure
  
    // Check if temperatures and precipitations are arrays
    const avgTemperature = Array.isArray(temperatures) ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length : null;
    const avgPrecipitation = Array.isArray(precipitations) ? precipitations.reduce((a, b) => a + b, 0) / precipitations.length : null;
  
    if (avgPrecipitation < optimalConditions.precipitation) {
      recommendations.push('Increase irrigation.');
    }
    if (avgTemperature && (avgTemperature < optimalConditions.minTemp || avgTemperature > optimalConditions.maxTemp)) {
      recommendations.push('Adjust crop variety for temperature tolerance.');
    }
  
    const assessment = recommendations.length === 0 ? 'Soil is suitable' : 'Soil needs improvement';
    return { assessment, recommendations };
  };
  
  
  // Example of getting optimal growing conditions for a specific plant
  const getOptimalConditions = (plantType) => {
    const conditions = {
      corn: { precipitation: 50, minTemp: 15, maxTemp: 30 },
      wheat: { precipitation: 40, minTemp: 10, maxTemp: 25 },
    };
  
    return conditions[plantType] || { precipitation: 45, minTemp: 12, maxTemp: 28 };  // Default
  };
  
  module.exports = { assessSoil };
