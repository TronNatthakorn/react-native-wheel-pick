'use strict';

import { Platform } from 'react-native';
import Picker from './picker';
import DatePicker from './date-picker';

let DatePickerComponent = DatePicker;

export const registerCustomDatePickerIOS = (CustomDatePickerIOS) => {
  if (Platform.OS === 'ios') {
    DatePickerComponent = CustomDatePickerIOS;
  }

  return DatePickerComponent;
};

export const Picker;
export const DatePicker;
