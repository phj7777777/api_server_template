const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./routes/health_service.js']

swaggerAutogen(outputFile, endpointsFiles)