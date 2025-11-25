export const linea = ['LINEA 1', 'LINEA 2'];

export const muestra = ['RUTINARIAS', 'ESPECIALES'];

export const compartimientoTolva = [
  '1 INFERIOR',
  '2 INFERIOR',
  '3 INFERIOR',
  '4 INFERIOR',
  '5 INFERIOR',
  '1 SUPERIOR',
  '2 SUPERIOR',
  '3 SUPERIOR',
  '4 SUPERIOR',
  '5 SUPERIOR',
];

export const compartimientoFurgon = [
  'A INFERIOR',
  'AC INFERIOR',
  'B INFERIOR',
  'BC INFERIOR',
  'A SUPERIOR',
  'AC SUPERIOR',
  'B SUPERIOR',
  'BC SUPERIOR',
];

export const fields = [
  {
    name: 'procedencia',
    type: 'selector',
    label: 'procedencia',
    options: [],
  },
  {
    name: 'producto',
    type: 'selector',
    label: 'producto',
    options: [],
  },
  {
    name: 'nlote',
    type: 'text',
    label: 'numero de lote',
  },
  {
    name: 'ntrabajador',
    type: 'text',
    label: 'numero de trabajador',
  },
  {
    name: 'loteinspeccion',
    type: 'text',
    label: 'lote de inspeccion',
  },
  {
    name: 'compartimientotolva',
    type: 'selector',
    label: 'compartimiento tolva',
    options: [],
  },
  {
    name: 'compartimientofurgon',
    type: 'selector',
    label: 'compartimiento furgon',
    options: [],
  },
  {
    name: 'transportista',
    type: 'text',
    label: 'transportista',
  },
  {
    name: 'codigoempaque',
    type: 'text',
    label: 'codigo de empaque',
  },
  {
    name: 'codigovehiculo',
    type: 'text',
    label: 'codigo de vehiculo',
  },
  {
    name: 'tmuestra',
    type: 'selector',
    label: 'tipo de muestra',
    options: [],
  },
  {
    name: 'linea',
    type: 'selector',
    label: 'linea',
    options: [],
  },
];

export const areaConfig = {
  ADITIVACION: {
    BASE_FIELDS: [
      'procedencia',
      'producto',
      'nlote',
      'ntrabajador',
      'tmuestra',
      'loteinspeccion',
      'linea',
    ],
  },

  BULK: {
    BASE_FIELDS: ['procedencia', 'producto', 'ntrabajador', 'linea'],
  },

  DESCARGADERAS: {
    BASE_FIELDS: ['procedencia', 'producto', 'ntrabajador', 'codigovehiculo', 'linea'],
    CONDITIONAL_FIELDS: {
      'DUCTO PEMEX': ['procedencia', 'producto', 'ntrabajador', 'linea'],
      'DUCTO TEPEAL': ['procedencia', 'producto', 'ntrabajador', 'linea'],
    },
  },

  EMBARQUE: {
    BASE_FIELDS: ['procedencia', 'producto', 'nlote', 'ntrabajador', 'linea', 'codigoempaque'],

    CONDITIONAL_FIELDS: {
      TOLVA: [
        'procedencia',
        'nlote',
        'ntrabajador',
        'compartimientotolva',
        'linea',
        'codigovehiculo',
      ],

      FURGON: [
        'procedencia',
        'nlote',
        'ntrabajador',
        'compartimientofurgon',
        'linea',
        'codigovehiculo',
      ],
    },
  },

  EMPAQUE: {
    BASE_FIELDS: ['procedencia', 'producto', 'nlote', 'ntrabajador', 'linea', 'codigoempaque'],

    CONDITIONAL_FIELDS: {
      FURGON: [
        'procedencia',
        'nlote',
        'ntrabajador',
        'compartimientofurgon',
        'linea',
        'codigovehiculo',
      ],
    },
  },

  ESPECIALES: {
    BASE_FIELDS: ['procedencia', 'producto', 'ntrabajador', 'linea'],
  },
};
