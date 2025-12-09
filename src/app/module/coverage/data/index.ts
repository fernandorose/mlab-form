import { globalMlabItf } from '@core/coverage/interface';
import { FieldNames, FieldTypes } from '@modMlab/coverage/enums';

export const linea = ['LINEA 1', 'LINEA 2'];

export const muestra = ['RUTINARIAS', 'ESPECIALES'];

export const transportista = [
  'TRANSPORTES ESPECIALIZADOS CARMEX',
  'TRANSGRANEL',
  'FERROTOLVAS/TRANSTOVLAS',
  'LOGISTICA DEL MAYAB',
];

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

type DisplayMode =
  | { type: 'FIELD'; prop: keyof globalMlabItf }
  | { type: 'INPUT' }
  | { type: 'NONE' };

export const USE_NAME_INSTEAD_OF_ID: FieldNames[] = [
  FieldNames.HOPPER_COMPARTMENT,
  FieldNames.FREIGHT_CAR_COMPARTMENT,
];

export const VALIDATOR_MAX_LENGTH_MAP: Record<string, number> = {
  [FieldNames.FOLIO_NUMBER]: 10,
};

export const VALIDATOR_COMPARE_MAP: Record<string, 'NOMBRE' | 'ID' | 'NONE'> = {
  [FieldNames.INSPECTION_LOT]: 'NOMBRE',
  [FieldNames.FOLIO_NUMBER]: 'NONE',
  [FieldNames.OPERATOR]: 'ID',
};

export const VALIDATOR_EXACT_MATCH_MAP: Record<string, boolean> = {
  [FieldNames.INSPECTION_LOT]: true,
  [FieldNames.FOLIO_NUMBER]: false,
  [FieldNames.OPERATOR]: false,
};

export const VALIDATOR_DISPLAY_MAP: Record<string, DisplayMode> = {
  [FieldNames.INSPECTION_LOT]: { type: 'FIELD', prop: 'NOMBRE' },
  [FieldNames.FOLIO_NUMBER]: { type: 'INPUT' },
  [FieldNames.OPERATOR]: { type: 'FIELD', prop: 'NOMBRE' },
};

export const sendNameInsteadOfId: FieldNames[] = [FieldNames.OPERATOR];

export const fields = [
  {
    name: FieldNames.ORIGIN,
    type: FieldTypes.SELECTOR,
    label: 'procedencia',
    options: [],
  },
  {
    name: FieldNames.PRODUCT,
    type: FieldTypes.SELECTOR,
    label: 'producto',
    options: [],
  },
  {
    name: FieldNames.FOLIO_NUMBER,
    type: FieldTypes.VALIDATOR,
    label: 'número de lote',
  },
  {
    name: FieldNames.OPERATOR,
    type: FieldTypes.SELECTOR,
    label: 'número de trabajador',
  },
  {
    name: FieldNames.INSPECTION_LOT,
    type: FieldTypes.VALIDATOR,
    label: 'lote de inspección',
  },
  {
    name: FieldNames.HOPPER_COMPARTMENT,
    type: FieldTypes.SELECTOR,
    label: 'compartimiento tolva',
    options: [],
  },
  {
    name: FieldNames.FREIGHT_CAR_COMPARTMENT,
    type: FieldTypes.SELECTOR,
    label: 'compartimiento furgon',
    options: [],
  },
  {
    name: FieldNames.CARRIER,
    type: FieldTypes.SELECTOR,
    label: 'transportista',
  },
  {
    name: FieldNames.PACKAGE_CODE,
    type: FieldTypes.TEXT,
    label: 'código de empaque',
  },
  {
    name: FieldNames.VEHICLE_CODE,
    type: FieldTypes.TEXT,
    label: 'código de vehiculo',
  },
  {
    name: FieldNames.SAMPLE_TYPE,
    type: FieldTypes.SELECTOR,
    label: 'tipo de muestra',
    options: [],
  },
  {
    name: FieldNames.LINE,
    type: FieldTypes.SELECTOR,
    label: 'línea',
    options: [],
  },
];

export type Areas =
  | 'ADITIVACION'
  | 'BULK'
  | 'DESCARGADERAS'
  | 'EMBARQUE'
  | 'EMPAQUE'
  | 'ESPECIALES'
  | 'ESPECIALES ALMACEN'
  | 'EXPLANADA 1'
  | 'EXPLANADA 2'
  | 'EXTRUSION 1'
  | 'EXTRUSION 2'
  | 'F.G.R.U.'
  | 'LABORATORIO'
  | 'MATERIAS PRIMAS'
  | 'MERICHEM'
  | 'OTRA'
  | 'POLIMERIZACION 1'
  | 'POLIMERIZACION 2'
  | 'SILOS DE HOMOGENIZADO'
  | 'SILOS DE PRODUCTO TERMINADO'
  | 'SILOS INTERMEDIOS'
  | 'SPLITTER'
  | 'TEPEAL';

export type AreaConfigMap = {
  [A in Areas]: AreaDefinition;
};

export interface AreaDefinition {
  BASE_FIELDS: FieldNames[];
  CONDITIONAL_FIELDS?: {
    [key: string]: FieldNames[];
  };
}

export const areaConfig: AreaConfigMap = {
  ADITIVACION: {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.FOLIO_NUMBER,
      FieldNames.OPERATOR,
      FieldNames.SAMPLE_TYPE,
      FieldNames.INSPECTION_LOT,
      FieldNames.LINE,
    ],
  },

  BULK: {
    BASE_FIELDS: [FieldNames.ORIGIN, FieldNames.PRODUCT, FieldNames.OPERATOR, FieldNames.LINE],
  },

  DESCARGADERAS: {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.OPERATOR,
      FieldNames.VEHICLE_CODE,
      FieldNames.LINE,
    ],
    CONDITIONAL_FIELDS: {
      'DUCTO PEMEX': [FieldNames.ORIGIN, FieldNames.PRODUCT, FieldNames.OPERATOR, FieldNames.LINE],
      'DUCTO TEPEAL': [FieldNames.ORIGIN, FieldNames.PRODUCT, FieldNames.OPERATOR, FieldNames.LINE],
    },
  },

  EMBARQUE: {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.FOLIO_NUMBER,
      FieldNames.OPERATOR,
      FieldNames.LINE,
      FieldNames.PACKAGE_CODE,
    ],

    CONDITIONAL_FIELDS: {
      TOLVA: [
        FieldNames.ORIGIN,
        FieldNames.FOLIO_NUMBER,
        FieldNames.OPERATOR,
        FieldNames.HOPPER_COMPARTMENT,
        FieldNames.LINE,
        FieldNames.VEHICLE_CODE,
      ],

      FURGON: [
        FieldNames.ORIGIN,
        FieldNames.FOLIO_NUMBER,
        FieldNames.OPERATOR,
        FieldNames.FREIGHT_CAR_COMPARTMENT,
        FieldNames.LINE,
        FieldNames.VEHICLE_CODE,
      ],
    },
  },

  EMPAQUE: {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.FOLIO_NUMBER,
      FieldNames.OPERATOR,
      FieldNames.LINE,
      FieldNames.PACKAGE_CODE,
    ],

    CONDITIONAL_FIELDS: {
      FURGON: [
        FieldNames.ORIGIN,
        FieldNames.FOLIO_NUMBER,
        FieldNames.OPERATOR,
        FieldNames.FREIGHT_CAR_COMPARTMENT,
        FieldNames.LINE,
        FieldNames.VEHICLE_CODE,
      ],
    },
  },

  ESPECIALES: {
    BASE_FIELDS: [FieldNames.ORIGIN, FieldNames.PRODUCT, FieldNames.OPERATOR, FieldNames.LINE],
  },

  'ESPECIALES ALMACEN': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PACKAGE_CODE,
      FieldNames.FOLIO_NUMBER,
      FieldNames.OPERATOR,
      FieldNames.LINE,
    ],
    CONDITIONAL_FIELDS: {
      TOLVA: [
        FieldNames.ORIGIN,
        FieldNames.CARRIER,
        FieldNames.FOLIO_NUMBER,
        FieldNames.OPERATOR,
        FieldNames.HOPPER_COMPARTMENT,
        FieldNames.LINE,
      ],
      FURGON: [
        FieldNames.ORIGIN,
        FieldNames.CARRIER,
        FieldNames.FOLIO_NUMBER,
        FieldNames.OPERATOR,
        FieldNames.FREIGHT_CAR_COMPARTMENT,
        FieldNames.VEHICLE_CODE,
        FieldNames.LINE,
      ],
    },
  },

  'EXPLANADA 1': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PACKAGE_CODE,
      FieldNames.FOLIO_NUMBER,
      FieldNames.OPERATOR,
      FieldNames.LINE,
    ],
  },

  'EXPLANADA 2': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PACKAGE_CODE,
      FieldNames.FOLIO_NUMBER,
      FieldNames.OPERATOR,
      FieldNames.LINE,
    ],
  },

  'EXTRUSION 1': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.FOLIO_NUMBER,
      FieldNames.OPERATOR,
      FieldNames.SAMPLE_TYPE,
      FieldNames.INSPECTION_LOT,
      FieldNames.LINE,
    ],
  },

  'EXTRUSION 2': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.FOLIO_NUMBER,
      FieldNames.OPERATOR,
      FieldNames.SAMPLE_TYPE,
      FieldNames.INSPECTION_LOT,
      FieldNames.LINE,
    ],
  },

  'F.G.R.U.': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.OPERATOR,
      FieldNames.SAMPLE_TYPE,
      FieldNames.INSPECTION_LOT,
      FieldNames.LINE,
    ],
  },

  LABORATORIO: {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.OPERATOR,
      FieldNames.SAMPLE_TYPE,
      FieldNames.INSPECTION_LOT,
      FieldNames.LINE,
    ],
  },

  'MATERIAS PRIMAS': {
    BASE_FIELDS: [FieldNames.ORIGIN, FieldNames.PRODUCT, FieldNames.OPERATOR, FieldNames.LINE],
  },

  MERICHEM: {
    BASE_FIELDS: [FieldNames.ORIGIN, FieldNames.PRODUCT, FieldNames.OPERATOR, FieldNames.LINE],
  },

  OTRA: {
    BASE_FIELDS: [FieldNames.ORIGIN, FieldNames.PRODUCT, FieldNames.OPERATOR, FieldNames.LINE],
  },

  'POLIMERIZACION 1': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.OPERATOR,
      FieldNames.SAMPLE_TYPE,
      FieldNames.INSPECTION_LOT,
      FieldNames.LINE,
    ],
  },

  'POLIMERIZACION 2': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.OPERATOR,
      FieldNames.SAMPLE_TYPE,
      FieldNames.INSPECTION_LOT,
      FieldNames.LINE,
    ],
  },

  'SILOS DE HOMOGENIZADO': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.FOLIO_NUMBER,
      FieldNames.OPERATOR,
      FieldNames.SAMPLE_TYPE,
      FieldNames.LINE,
    ],
  },

  'SILOS DE PRODUCTO TERMINADO': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.FOLIO_NUMBER,
      FieldNames.OPERATOR,
      FieldNames.SAMPLE_TYPE,
      FieldNames.LINE,
    ],
  },

  'SILOS INTERMEDIOS': {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.OPERATOR,
      FieldNames.INSPECTION_LOT,
      FieldNames.LINE,
    ],
  },

  SPLITTER: {
    BASE_FIELDS: [
      FieldNames.ORIGIN,
      FieldNames.PRODUCT,
      FieldNames.OPERATOR,
      FieldNames.SAMPLE_TYPE,
      FieldNames.LINE,
    ],
  },

  TEPEAL: {
    BASE_FIELDS: [FieldNames.ORIGIN, FieldNames.PRODUCT, FieldNames.OPERATOR],
  },
};
