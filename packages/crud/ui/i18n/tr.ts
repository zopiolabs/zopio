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
    submit: 'Gönder',
    reset: 'Sıfırla',
    required: 'Zorunlu',
    validation: {
      required: 'Bu alan zorunludur',
      min: 'Değer en az {{min}} olmalıdır',
      max: 'Değer en fazla {{max}} olmalıdır',
      minLength: 'En az {{min}} karakter olmalıdır',
      maxLength: 'En fazla {{max}} karakter olmalıdır',
      pattern: 'Geçersiz format',
      email: 'Geçersiz e-posta adresi',
      url: 'Geçersiz URL',
    },
  },
  table: {
    noData: 'Veri bulunamadı',
    loading: 'Veriler yükleniyor...',
    pagination: {
      showing:
        'Toplam {{total}} kayıttan {{start}} - {{end}} arası gösteriliyor',
      next: 'Sonraki',
      previous: 'Önceki',
      rowsPerPage: 'Sayfa başına satır:',
    },
    filters: {
      title: 'Filtreler',
      apply: 'Uygula',
      clear: 'Temizle',
      add: 'Filtre Ekle',
    },
    actions: {
      edit: 'Düzenle',
      delete: 'Sil',
      view: 'Görüntüle',
      bulkDelete: 'Seçilenleri Sil',
    },
  },
  fields: {
    generic: {
      select: 'Seçiniz...',
      search: 'Ara...',
      upload: 'Yükle',
      remove: 'Kaldır',
    },
  },
};
