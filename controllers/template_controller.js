const express = require('express');
const controller = require('./controllers/index');
const validateSchemas = require('../middlewares/validateSchemas');
const schemas = require('../schemas/user');

const router = express.Router();


router.post('/', async (req, res) => {
  validateSchemas.inputs(schemas.signUp, 'body');
  const result = await controller.createBooking(req.body);
  if (result) return res.status(parseInt(result.status)).json({ result: result.result });
  return res.status(400).json({ result: 'error_server' });
});

router.get('/:id', async (req, res) => {

  const id = req.params.id;
  if (!id) return res.status(400).json({ result: 'error_server' });

  const result = await controller.getBooking(id);
  if (result) return res.status(parseInt(result.status)).json({ result: result.message });
  return res.status(400).json({ result: 'error_server' });
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ result: 'error_param' });
  const result = await controller.updateBooking(id, req.body);
  if (result) return res.status(parseInt(result.status)).json({ result: result.message });
  return res.status(400).json({ result: 'error_server' });
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ result: 'error_param' });
  }
  const result = await controller.deleteBooking(id);
  if (result) {
    return res.status(parseInt(result.status)).json({ result: result.message });
  }
  return res.status(400).json({ result: 'error_server' });
});

module.exports = router;
