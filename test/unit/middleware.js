'use strict';

const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

// Prevent call thru for all stubs resolved by a `proxyquire` instance.
proxyquire.noCallThru();

// Sample data.
const polygon = {
  type: 'FeatureCollection',
  features: [{
    _id: '0fffffffffffffffffffffff',
    type: 'relocationzone',
    geometry: {
      type: 'Polygon',
      coordinates: [[[0, 1], [2, 1], [3, 4], [1, 5]]],
    },
  }],
};

const car = {
  vin: 'YS3AK36E2N7017294',
  latitude: 2,
  longitude: 1,
};

const middleware = proxyquire('../../middleware', {
  redis: {
    createClient: sinon.spy(),
  },
  './get': {},
  './config': {
    cache: {
      host: 'localhost',
      port: 6379,
    },
  },
});

describe('middleware', () => {

  let req = { app: { locals: { polygons: polygon } } };
  let res = { locals: { cars: [] } };
  let next = sinon.spy();

  beforeEach(() => {
    // Avoid mutation.
    res.locals.cars = JSON.parse(JSON.stringify([car]));
  });

  afterEach(() => {
    next.reset();
  });

  describe('.locate()', () => {
    it('should identify a polygon a car belongs to', () => {
      middleware.locate(req, res, next);
      assert.strictEqual(res.locals.result[0].polygonId, polygon.features[0]._id);
      sinon.assert.calledOnce(next);
    });

    it('should identify a car that doesn\'t belong to any of the polygons', () => {
      res.locals.cars[0].latitude = -1;
      middleware.locate(req, res, next);
      assert.strictEqual(res.locals.result[0].polygonId, null);
      sinon.assert.calledOnce(next);
    });

    it('should handle a car with latitude missing', () => {
      delete res.locals.cars[0].latitude;
      middleware.locate(req, res, next);
      assert.strictEqual(res.locals.result[0].polygonId, null);
      sinon.assert.calledOnce(next);
    });
  });

  describe('.allocate', () => {
    it('should find all cars that fall into a specific polygon', () => {
      res.locals.cars.push({ vin: '3G5DB03L86S543512' });
      middleware.allocate(req, res, next);
      assert.strictEqual(res.locals.result[0].vehicles[0], car.vin);
      sinon.assert.calledOnce(next);
    });

    it('should handle absence of cars in a polygon', () => {
      res.locals.cars = [];
      middleware.allocate(req, res, next);
      assert.deepStrictEqual(res.locals.result[0].vehicles, []);
      sinon.assert.calledOnce(next);
    });
  });
});
