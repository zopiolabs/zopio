/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
export default {
  form: {
    submit: 'Enviar',
    reset: 'Restablecer',
    required: 'Obligatorio',
    validation: {
      required: 'Este campo es obligatorio',
      min: 'El valor debe ser al menos {{min}}',
      max: 'El valor debe ser como máximo {{max}}',
      minLength: 'Debe tener al menos {{min}} caracteres',
      maxLength: 'Debe tener como máximo {{max}} caracteres',
      pattern: 'Formato inválido',
      email: 'Dirección de correo electrónico inválida',
      url: 'URL inválida',
    },
  },
  table: {
    noData: 'No hay datos disponibles',
    loading: 'Cargando datos...',
    pagination: {
      showing: 'Mostrando {{start}} a {{end}} de {{total}} entradas',
      next: 'Siguiente',
      previous: 'Anterior',
      rowsPerPage: 'Filas por página:',
    },
    filters: {
      title: 'Filtros',
      apply: 'Aplicar',
      clear: 'Limpiar',
      add: 'Añadir filtro',
    },
    actions: {
      edit: 'Editar',
      delete: 'Eliminar',
      view: 'Ver',
      bulkDelete: 'Eliminar seleccionados',
    },
  },
  fields: {
    generic: {
      select: 'Seleccionar...',
      search: 'Buscar...',
      upload: 'Subir',
      remove: 'Eliminar',
    },
  },
};
