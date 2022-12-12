/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

const FORM_FIELD_TYPE = {
  INPUT: 'input',
  TEXTAREA: 2,
  CHECKBOX: 3,
  NUMBER: 'number',
  DROPDOWN: 5,
  IMAGE: 6,
  DATE: 7,
  DATERANGE: 8,
  SELECTION: 'select',
  TAB: 10,
  PASSWORD: 11,
  CANVA: 12,
  LABELCARD: 13,
  INFORMATION: 14,
  LABELBTN: 15,
  SELECTIONPERSONA: 16,
  DESCRIPTION: 17,
  DAM: 18,
  BIRTHDAY: 19,
  PRICE: 20,
  RADIO: 'radio',
  AGE: 22,
  LOCATION: 23,
  TIMEZONE: 24,
  EDITOR: 25,
};

const FORMAT_DATE = 'dd MMM, yyyy';
const FORMAT_DATE_UPDATE_POST = 'YYYY-MM-DD HH:mm:ss';
const FORMAT_TIME = 'HH:mm:ss';

export { FORM_FIELD_TYPE, FORMAT_DATE, FORMAT_DATE_UPDATE_POST, FORMAT_TIME };
