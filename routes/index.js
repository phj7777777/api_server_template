const status = require('../controllers/health_controller');
const message = require('../controllers/messenger_controller');
const company = require('../src/companies/routes');
const companyNotification = require('../src/company_notification/routes');
const companyConfig = require('../src/company_config/routes');
const booking = require('../src/bookings/routes');
const customer = require('../src/customers/routes');
const staff = require('../src/staffs/routes');
const package = require('../src/packages/routes');
const image = require('../controllers/image_controller');
const service = require('../src/services/routes');
const { API_PREFIX } = require('../const');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const validateAuth = require('../middlewares/validateAuth');
const getData = require('../middlewares/getData');
const express = require('express');


module.exports = (app) => {


  //app.use(`${API_PREFIX}//users`, validateAuth.checkIfAuthenticated, getData.getGeoip, users);

  app.use(express.static('images'));
  app.use(`${API_PREFIX}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(`${API_PREFIX}/status`, validateAuth.checkIfAuthenticated, getData.getGeoip, status);
  app.use(`${API_PREFIX}/image`, validateAuth.checkIfAuthenticated, getData.getGeoip, image);

  app.use('*', (req, res) => {
    res.status(404).json({ status: 404, result: 'error', message: 'Not Found' });
  });
};
