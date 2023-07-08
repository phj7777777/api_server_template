const axios = require('axios');
const { error, info } = require('log');

// POST HTTP request
module.exports.postHttp = async (url, data = {}, headers = {}) => {
  axios.post(url, data, { headers: headers })
    .then(function(response) {
      info(response);
      console.log(response)
      return { status: response.status, result: 'ok', message: response.data };
    })
    .catch(function(err) {
      error(err);
      console.log(err)
      return { status: err.status, result: 'error', message: 'error_server' };
    });
};

// GET HTTP request
module.exports.getHttp = async (url, params = {}) => {
  axios.get(url, {
    params: params,
  })
    .then(function(response) {
      info(response);
      return { result: 'ok', message: response.data };
    })
    .catch(function(err) {
      error(err);
      return { result: 'error', message: 'error_server' };
    });
};

