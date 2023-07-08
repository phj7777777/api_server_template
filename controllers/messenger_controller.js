
const express = require('express');
const controller = require('../services/messenger_service');

const router = express.Router();

// *****  Whatsapp API ***** //

router.post(`/send-whatsapp`,
  async (req, res) => {

    if (!req.body.receiver || !req.body.message) {
      return res.status(400).json({ result: 'error_param' });
    }

    const result = await controller.sendWhatsapp(req.body);

    if (result) {
      res.status(parseInt(result.status)).json(result);
    }

    return res.status(400).json({ result: 'error_server' });


  },
);

// ***** Email SMTP API **** //

router.post(`/send-email`,
  async (req, res) => {

    if (!req.body.receiver || !req.body.message || !req.body.subject) {
      return res.status(400).json({ result: 'error_param' });
    }

    const result = await controller.sendEmail({
      to: req.body.receiver,
      subject: req.body.subject,
      text: req.body.message,
    });

    if (result) return res.status(parseInt(result.status)).json(result);
    return res.status(400).json({ result: 'error_server' });

  },
);

router.post('/testConnectDB', async (req, res) => {

  const result = await controller.createProduct(req.body);
  if (result) return res.status(parseInt(result.status)).json({ result: result.result });
  return res.status(400).json({ result: 'error_server' });
});

router.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ result: 'error_server' });

  const result = await controller.getProduct(id);
  if (result) return res.status(parseInt(result.status)).json({ result: result.message });
  return res.status(400).json({ result: 'error_server' });
});

router.put('/products/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ result: 'error_param' });
  const result = await controller.updateProduct(id, req.body);
  if (result) return res.status(parseInt(result.status)).json({ result: result.message });
  return res.status(400).json({ result: 'error_server' });
});

router.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ result: 'error_param' });
  }
  const result = await controller.deleteProduct(id);
  if (result){
    return res.status(parseInt(result.status)).json({ result: result.message });
  }
  return res.status(400).json({ result: 'error_server' });
});

module.exports = router;
