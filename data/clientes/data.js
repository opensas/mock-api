var _ = require('lodash');

var cantClientes = 1000;

var nombres = [
  'juan', 'abel', 'jose', 'julio', 'julián', 'fidel', 'carlos', 'rodolfo',
  'federico', 'jonás', 'eric', 'néstor', 'martín', 'andrés', 'gustavo', 'lucas',
  'jorge', 'pablo', 'matias', 'ernesto', 'leandro', 'sebastian', 'juan'
];

var apellidos = [
  'mango', 'sanchez', 'perez', 'fanon', 'castro', 'ramirez', 'casullo',
  'castro', 'guevara', 'antonello', 'fabricci', 'licastro', 'centenera', 'viey',
  'rivadavia', 'nicastro', 'sacado', 'fertuchelli', 'matas', 'mactas', 'lupo',
  'gonzalez', 'alsina', 'marchet', 'orondo', 'riglos', 'amenabar'
];

var edadDesde = 18;
var edadHasta = 65;

var random = function(from, to) {
  from = from === undefined ? 0 : from;
  to = to === undefined ? 1 : to;
  var max = to - from +1;
  return from + parseInt(Math.floor(Math.random() * max));
};

var pick = function(array, count) {
  return _.shuffle(array).slice(0, count);
};

var randomCliente = function(id) {
  return {
    id:       id,
    edad:     random(edadDesde, edadHasta),
    nombre:   pick(nombres, 2).join(' '),
    apellido: pick(apellidos, 2).join(' ')
  };
};

var generateClientes = function(maxClientes) {
  var clientes = [];

  for (var i = 0; i < maxClientes; i++) {
    clientes.push(randomCliente(i+1));
  }
  return clientes;
};

module.exports = generateClientes(cantClientes);

/*
module.exports = [
  { id: 1,    nombre: 'juan',       apellido: 'mango',      edad: 22 },
  { id: 2,    nombre: 'abel',       apellido: 'sanchez',    edad: 23 },
  { id: 3,    nombre: 'jose',       apellido: 'perez',      edad: 43 },
  { id: 4,    nombre: 'julio',      apellido: 'fanon',      edad: 59 },
  { id: 5,    nombre: 'julian',     apellido: 'castro',     edad: 28 },
  { id: 6,    nombre: 'fidel',      apellido: 'ramirez',    edad: 13 },
  { id: 7,    nombre: 'carlos',     apellido: 'casullo',    edad: 29 },
  { id: 8,    nombre: 'rodolfo',    apellido: 'gonzalez',   edad: 62 },
  { id: 9,    nombre: 'jorge',      apellido: 'alsina',     edad: 83 },
  { id: 10,   nombre: 'pablo',      apellido: 'rivadavia',  edad: 53 },
  { id: 11,   nombre: 'matias',     apellido: 'orondo',     edad: 93 },
  { id: 12,   nombre: 'ernesto',    apellido: 'riglos',     edad: 77 }
];
*/
