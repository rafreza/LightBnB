const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool.query(`SELECT * FROM users WHERE email = $1`, [email]).then(user => {
    return user.rows[0];
  }).catch(() => {
    return null;
  });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query(`SELECT * FROM users WHERE id = $1`, [id]).then(user => {
    return user.rows[0];
  }).catch(() => {
    return null;
  });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool.query(`INSERT INTO users(name, password, email) VALUES($1, $2, $3) RETURNING *`,
  [user.name, user.password, user.email]).then(user => {
    return user.rows[0];
  }).catch(() => {
    return null;
  });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`SELECT properties.*, reservations.*, AVG(property_reviews.rating) AS "average_rating"
  FROM properties 
  JOIN reservations ON properties.id = reservations.property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`, [guest_id, limit]).then(reso => {
    return reso.rows;
  }).catch(() => {
    return null;
  });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  let queryParams = [];
  let querySearch = [];

  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS "average_rating" 
  FROM properties 
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    querySearch.push(`city LIKE $${queryParams.length}`);
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    querySearch.push(`cost_per_night >= $${queryParams.length}`);
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    querySearch.push(`$${queryParams.length} >= cost_per_night`);
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    querySearch.push(`property_reviews.rating >= $${queryParams.length}`);
  }

  if(querySearch.length > 0){
    querySearch = ' WHERE ' + querySearch.join(' AND ');
    queryString += querySearch;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;


  return pool.query(queryString, queryParams).then(data => {
    return data.rows;
  }).catch(() => {
    return null;
  });
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
