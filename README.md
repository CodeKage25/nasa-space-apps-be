```markdown
# API Integration for Soil Quality Assessment

## Endpoint

### Assess Soil Quality
- **URL**: `/v1/assess`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body
The request body should include the `plantType` and `location` (latitude and longitude) as follows:

```json
{
  "plantType": "corn",
  "location": {
    "latitude": 34.05,
    "longitude": -118.25
  }
}
```

### Parameters
- **plantType**: A string representing the type of plant (e.g., "corn", "wheat").
- **location**: An object containing:
  - **latitude**: A float representing the latitude of the farm location.
  - **longitude**: A float representing the longitude of the farm location.

## Response Structure
Upon successful assessment, the API will return a JSON response structured as follows:

```json
{
  "message": "Soil assessment completed",
  "farm": {
    "plantType": "corn",
    "location": {
      "latitude": 34.05,
      "longitude": -118.25
    },
    "soilAssessment": "Soil needs improvement",
    "recommendations": [
      "Increase irrigation.",
      "Adjust crop variety for temperature tolerance."
    ]
  },
  "nasaData": {
    "T2M": [/* temperature data */],
    "PRECTOTCORR": [/* precipitation data */]
  },
  "soilData": {
    // Soil data structure (moisture, pH, etc.)
  }
}
```

### Response Parameters
- **message**: A string indicating the status of the request.
- **farm**: An object containing:
  - **plantType**: The type of plant submitted for assessment.
  - **location**: The submitted location coordinates.
  - **soilAssessment**: A string summarizing the assessment result (e.g., "Soil is suitable" or "Soil needs improvement").
  - **recommendations**: An array of strings providing specific recommendations based on the assessment.
- **nasaData**: An object containing environmental data retrieved from NASA:
  - **T2M**: An array of temperature data.
  - **PRECTOTCORR**: An array of precipitation data.
- **soilData**: An object representing soil quality data (e.g., moisture, pH levels).

## Error Handling
If an error occurs during the request, the API will respond with a JSON object structured as follows:

```json
{
  "message": "Error performing soil assessment",
  "error": "Detailed error message"
}
```

### Example of an Error Response
```json
{
  "message": "Error performing soil assessment",
  "error": "Error fetching NASA data"
}
```
```
