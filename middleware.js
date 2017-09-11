'use strict';

// Third-party packages.
const inside = require('point-in-polygon');
const PolygonLookup = require('polygon-lookup');

const get = require('./get');

const config = require('./config');

async function fetch(req, res, next) {
  try {
    res.locals.cars = await get(`https://${config.source}/caba/customer/v2/vehicles/${config.location}`);
  } catch (e) {
    return next(e);
  }
  return next();
}

function locate(req, res, next) {
  const lookup = new PolygonLookup(req.app.locals.polygons);
  res.locals.result = res.locals.cars.map(car => {
    const polygon = lookup.search(car.longitude, car.latitude);
    car.polygonId = polygon ? polygon._id : null;
    return car;
  });
  return next();
}

function allocate(req, res, next) {
  res.locals.result = req.app.locals.polygons.features.map(polygon => {
    polygon.vehicles = [];
    for (let i = 0; i < res.locals.cars.length; i++) {
      const car = res.locals.cars[i];
      if (inside([car.longitude, car.latitude], polygon.geometry.coordinates[0])) {
        polygon.vehicles.push(car.vin);
      }
    }
    return polygon;
  });
  return next();
}

function respond(req, res, next) {
  res.status(200).json(res.locals.result);
  return next();
}

module.exports = {
  fetch,
  locate,
  allocate,
  respond,
};
