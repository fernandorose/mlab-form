export interface globalMlabItf {
  MANDT: string;
  ID: string;
  NOMBRE: string;
  TIPO_ID: string;
}

export interface MlabFormItf {
  area: string;
  analysis: string[];
  sampling_date: string;
  sampling_time: string;
  delivery_date: string;
  delivery_time: string;
  remarks: string;
  product?: string;
  folio_number?: string;
  line?: string;
  operator?: string;
  origin?: string;
  sample_type?: string;
  inspection_lot?: string;
  package_code?: string;
  vehicle_type?: string;
  vehicle_code?: string;
  compartment?: string[];
  carrier?: string;
  [key: string]: any;
}

export interface MlabListItf {
  ZQT_RMUEST_ID: string;
  ANALISIS: string;
  PRODUCTO: string;
  NO_FOLIO: string;
  LINEA: string;
  AREA: string;
  OPERADOR: string;
  PROCEDENCIA: string;
  TIPO_MUESTRA: string;
  LOTE_INSP: string;
  FECHA_MUESTRA: string;
  HORA_MUESTRA: string;
  FECHA_ENTREGA: string;
  HORA_ENTREGA: string;
  CLAVE_MUESTRA: string;
  OBSERVACIONES: string;
  CODIGO_EMPAQUE: string;
  PRIORIDAD: string;
  STATUS_MUESTRA: string;
  FECHA_TERMINO: string;
  HORA_TERMINO: string;
  ORDINARIA: string;
  TIPO_VEHICULO: string;
  CODIGO_VEHICULO: string;
  COMPARTIMENTO: string;
  TRANSPORTISTA: string;
}

export interface MlabPdfItf {
  folio: string;
  fecha: string;
  hora: string;
  lote: string;
  area: string;
  material: string;
  compartimento: string;
  analisisRequerido: string;
  nombreOperador: string;
  codigoVehiculo: string;
  loteInspeccion: string;
  puntoMuestreo: string;
}
