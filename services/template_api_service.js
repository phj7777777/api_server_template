const { error, info } = require('log');
const db = require('../../../services/database');


module.exports.createBooking = async (booking) => {

  const currentTime = new Date();
  const {
    employee_id,
    service_id,
    package_id,
  } = booking;
  const { rows } = await db.query(
    'INSERT INTO bookings (employee_id, service_id, package_id, last_update_time, created_time) VALUES ($1, $2, $3, $4,$4)',
    [employee_id, service_id, package_id, currentTime],
  );

  if (rows) {
    return { status: '200', result: 'ok', message: rows };
  }

};

module.exports.getBooking = async (id) => {
  const response = await db.query(
    'SELECT * FROM bookings WHERE id = $1 LIMIT 1',
    [id],
  );

  if (response?.rows) {
    return { status: '200', result: 'ok', message: response.rows[0] };
  }
};

module.exports.updateBooking = async (id, booking) => {
  const currentTime = new Date();
  const {
    employee_id,
    service_id,
    package_id,
  } = booking;

  const response = await db.query(
    'UPDATE bookings SET employee_id = COALESCE($1,employee_id), service_id = COALESCE($2,service_id), package_id= COALESCE($3,package_id), last_update_time = $4  WHERE id = $5',
    [employee_id, service_id, package_id, currentTime, id],
  );

  if (response) {
    return { status: '200', result: 'ok', message: 'Update successfully' };
  }
};


module.exports.deleteBooking = async (id) => {
  const response = await db.query(
    'DELETE FROM bookings WHERE id = $1',
    [parseInt(id)],
  );
  if (response) {
    return { status: '200', result: 'ok', message: 'Delete successfully' };
  }
};




