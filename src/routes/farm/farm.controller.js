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
  
    // Get the actual temperature and precipitation data from NASA
    const temperatures = nasaData.T2M; // Assuming an array of temperature data
    const precipitations = nasaData.PRECTOTCORR; // Assuming an array of precipitation data
  
    const avgTemperature = Array.isArray(temperatures) ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length : null;
    const avgPrecipitation = Array.isArray(precipitations) ? precipitations.reduce((a, b) => a + b, 0) / precipitations.length : null;

    if (avgPrecipitation < optimalConditions.precipitation) {
        // Specific irrigation recommendation based on deficit
        recommendations.push(`Precipitation levels are below optimal for ${plantType}. Consider installing a drip irrigation system to conserve water.`);
        recommendations.push('Additionally, use mulching to reduce soil moisture evaporation.');
    } else if (avgPrecipitation > optimalConditions.precipitation) {
        recommendations.push(`Excess precipitation detected for ${plantType}. Ensure proper drainage systems to avoid waterlogging.`);
        recommendations.push('Consider raising beds to improve water drainage.');
    }

    if (avgTemperature < optimalConditions.minTemp) {
        recommendations.push(`Average temperature is lower than optimal for ${plantType}. Consider row covers or greenhouse growing to maintain warmth.`);
    } else if (avgTemperature > optimalConditions.maxTemp) {
        recommendations.push(`Temperatures exceed the optimal range for ${plantType}. Implement shade netting or windbreaks to reduce heat stress.`);
    }

    // Suggest crop rotation if conditions are consistently unfavorable
    if (avgTemperature < optimalConditions.minTemp || avgTemperature > optimalConditions.maxTemp || avgPrecipitation < optimalConditions.precipitation) {
        recommendations.push('Consider rotating with a hardier crop, like legumes, to improve soil quality and manage extreme conditions.');
    }

    // Suggest soil amendments for nutrient improvement
    if (avgPrecipitation < optimalConditions.precipitation) {
        recommendations.push('Test soil nitrogen levels and consider adding nitrogen-fixing plants or fertilizers.');
    }

    const assessment = recommendations.length === 0 ? 'Soil and conditions are suitable' : 'Soil and environmental conditions need improvement';
    return { assessment, recommendations };
};

  
  
  // Example of getting optimal growing conditions for a specific plant
  const getOptimalConditions = (plantType) => {
    const conditions = {
        // Cereals
        corn: { precipitation: 50, minTemp: 15, maxTemp: 30 },
        wheat: { precipitation: 40, minTemp: 10, maxTemp: 25 },
        rice: { precipitation: 80, minTemp: 20, maxTemp: 35 },
        barley: { precipitation: 30, minTemp: 5, maxTemp: 20 },
        oats: { precipitation: 45, minTemp: 7, maxTemp: 24 },
        millet: { precipitation: 30, minTemp: 20, maxTemp: 35 },
        sorghum: { precipitation: 40, minTemp: 20, maxTemp: 35 },
        rye: { precipitation: 35, minTemp: 8, maxTemp: 22 },
        quinoa: { precipitation: 25, minTemp: 8, maxTemp: 25 },
    
        // Legumes
        soybean: { precipitation: 60, minTemp: 15, maxTemp: 30 },
        chickpeas: { precipitation: 30, minTemp: 10, maxTemp: 30 },
        lentils: { precipitation: 25, minTemp: 10, maxTemp: 25 },
        peas: { precipitation: 60, minTemp: 10, maxTemp: 24 },
        favaBeans: { precipitation: 35, minTemp: 7, maxTemp: 22 },
        blackBeans: { precipitation: 45, minTemp: 15, maxTemp: 30 },
        kidneyBeans: { precipitation: 40, minTemp: 12, maxTemp: 28 },
        limaBeans: { precipitation: 50, minTemp: 20, maxTemp: 35 },
    
        // Root and Tuber Crops
        potatoes: { precipitation: 50, minTemp: 8, maxTemp: 22 },
        sweetPotatoes: { precipitation: 60, minTemp: 20, maxTemp: 32 },
        cassava: { precipitation: 80, minTemp: 25, maxTemp: 35 },
        yams: { precipitation: 70, minTemp: 20, maxTemp: 30 },
        carrots: { precipitation: 50, minTemp: 7, maxTemp: 24 },
        turnips: { precipitation: 40, minTemp: 5, maxTemp: 22 },
        beets: { precipitation: 40, minTemp: 10, maxTemp: 25 },
    
        // Fruits
        apples: { precipitation: 60, minTemp: 0, maxTemp: 24 },
        bananas: { precipitation: 100, minTemp: 20, maxTemp: 35 },
        grapes: { precipitation: 30, minTemp: 12, maxTemp: 30 },
        oranges: { precipitation: 90, minTemp: 15, maxTemp: 35 },
        lemons: { precipitation: 90, minTemp: 18, maxTemp: 35 },
        mangoes: { precipitation: 100, minTemp: 24, maxTemp: 38 },
        pineapples: { precipitation: 120, minTemp: 20, maxTemp: 35 },
        papayas: { precipitation: 80, minTemp: 25, maxTemp: 35 },
        avocados: { precipitation: 100, minTemp: 15, maxTemp: 30 },
        figs: { precipitation: 40, minTemp: 12, maxTemp: 30 },
        peaches: { precipitation: 50, minTemp: 15, maxTemp: 30 },
        strawberries: { precipitation: 50, minTemp: 15, maxTemp: 25 },
        blueberries: { precipitation: 70, minTemp: 5, maxTemp: 25 },
    
        // Vegetables
        tomatoes: { precipitation: 40, minTemp: 18, maxTemp: 27 },
        lettuce: { precipitation: 40, minTemp: 10, maxTemp: 25 },
        onions: { precipitation: 35, minTemp: 10, maxTemp: 24 },
        cucumbers: { precipitation: 50, minTemp: 18, maxTemp: 30 },
        spinach: { precipitation: 45, minTemp: 10, maxTemp: 24 },
        cabbage: { precipitation: 60, minTemp: 7, maxTemp: 21 },
        broccoli: { precipitation: 50, minTemp: 10, maxTemp: 24 },
        cauliflower: { precipitation: 50, minTemp: 8, maxTemp: 20 },
        zucchini: { precipitation: 40, minTemp: 15, maxTemp: 30 },
        eggplant: { precipitation: 50, minTemp: 20, maxTemp: 30 },
        peppers: { precipitation: 40, minTemp: 18, maxTemp: 30 },
        pumpkins: { precipitation: 60, minTemp: 15, maxTemp: 25 },
    
        // Industrial Crops
        cotton: { precipitation: 70, minTemp: 18, maxTemp: 32 },
        sugarcane: { precipitation: 90, minTemp: 22, maxTemp: 40 },
        tobacco: { precipitation: 50, minTemp: 18, maxTemp: 32 },
        coffee: { precipitation: 100, minTemp: 18, maxTemp: 30 },
        cocoa: { precipitation: 150, minTemp: 20, maxTemp: 30 },
        tea: { precipitation: 100, minTemp: 12, maxTemp: 30 },
        flax: { precipitation: 60, minTemp: 10, maxTemp: 25 },
        hemp: { precipitation: 40, minTemp: 16, maxTemp: 27 },
        rubber: { precipitation: 150, minTemp: 25, maxTemp: 35 },
    
        // Others
        alfalfa: { precipitation: 50, minTemp: 5, maxTemp: 30 },
        clover: { precipitation: 60, minTemp: 5, maxTemp: 25 },
        sugarBeets: { precipitation: 40, minTemp: 5, maxTemp: 22 },
        peanuts: { precipitation: 60, minTemp: 20, maxTemp: 32 },
        safflower: { precipitation: 40, minTemp: 10, maxTemp: 32 },
        sesame: { precipitation: 50, minTemp: 20, maxTemp: 35 },
      };
  
    return conditions[plantType] || { precipitation: 45, minTemp: 12, maxTemp: 28 };  // Default
  };
  
  module.exports = { assessSoil };
