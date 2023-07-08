const nodemailer = require('nodemailer');
const { error, info } = require('log');
const db = require('../db/database');
const httpService = require('./http_service');

module.exports.sendWhatsapp = async (body) => {

  const { receiver, message, locale } = body;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.WHATSAPP_BEARER_TOKEN}`,
  };
  const result = await httpService.postHttp(process.env.WHATSAPP_MESSAGE_API,
    {
      'messaging_product': 'whatsapp',
      'to': receiver,
      'type': 'template',
      'template': { 'name': message, 'language': { 'code': locale ?? 'en_US' } },
    }, headers);

  if (result) {
    return { status: '200', result: 'ok', message: 'Send successfully' };
  }
};


module.exports.sendEmail = async (mailOptions) => {

  mailOptions.from = process.env.NODEMAILER_USER;

  if (!mailOptions?.to || !mailOptions?.subject || !mailOptions?.text || !mailOptions?.from) {
    return { status: 400, result: 'error_param' };
  }

  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail(mailOptions, function(err, result) {
    if (err) {
      error('Failed send mail - %s, with mailOptions %s', err, mailOptions);
      console.log(err);
      return { status: err.status, result: 'error', message: 'error_server' };
    } else {
      info('Success send mail - %s, with mailOptions %s', result.response, mailOptions);
      console.log('Email sent: ' + result.response);
      return { status: result.status, result: 'ok', message: result.data };
    }
  });

};


module.exports.createProduct = async (product) => {
  const { product_name, quantity, price } = product;
  const { rows } = await db.query(
    'INSERT INTO products (productname, quantity, price) VALUES ($1, $2, $3)',
    [product_name, quantity, price],
  );

  if (rows) {
    return { status: '200', result: 'ok', message: rows };
  }

};

module.exports.getProduct = async (id) => {
  const response = await db.query(
    'SELECT * FROM products WHERE productId = $1 LIMIT 1',
    [id],
  );

  if (response) {
    return { status: '200', result: 'ok', message: response.rows };
  }
};


module.exports.updateProduct = async (id, product) => {
  const productId = parseInt(id);
  const { product_name, quantity, price } = product;
  const response = await db.query(
    'UPDATE products SET productname = $1, quantity = $2, price = $3 WHERE productId = $4',
    [product_name, quantity, price, productId],
  );
  if (response) {
    return { status: '200', result: 'ok', message: 'Update successfully' };
  }
};


module.exports.deleteProduct = async (id) => {
  const productId = parseInt(id);
  const response = await db.query(
    'DELETE FROM products WHERE productId = $1',
    [productId],
  );
  if (response) {
    return { status: '200', result: 'ok', message: 'Delete successfully' };
  }
};




