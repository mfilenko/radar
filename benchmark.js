// Candidates.
const turf = require('@turf/turf');
const inside = require('point-in-polygon');
const PolygonLookup = require('polygon-lookup');

// Sample data.
const polygons = {
  type: 'FeatureCollection',
  features: require('./polygons'),
};

const point = turf.point([9.13635, 48.77074]);

let polygon;

console.time('@turf/turf');
for (let i = 0; i < polygons.features.length; i++) {
  if (turf.inside(point, polygons.features[i])) {
    polygon = polygons.features[i]._id;
  }
}
console.timeEnd('@turf/turf');
console.log('@turf/turf:', polygon);

console.time('point-in-polygon');
for (let i = 0; i < polygons.features.length; i++) {
  if (inside(point.geometry.coordinates, polygons.features[i].geometry.coordinates[0])) {
    polygon = polygons.features[i]._id;
  }
}
console.timeEnd('point-in-polygon');
console.log('point-in-polygon:', polygon);

const lookup = new PolygonLookup(polygons);
console.time('polygon-lookup');
polygon = lookup.search(point.geometry.coordinates[0], point.geometry.coordinates[1]);
console.timeEnd('polygon-lookup');
console.log('polygon-lookup:', polygon._id);
