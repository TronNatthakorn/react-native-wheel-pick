function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * 
 *
 */

import * as React from 'react';
import { unstable_createElement } from 'react-native-web';
import { forwardRef } from 'react';
import PickerItem from './PickerItem';
const Select = /*#__PURE__*/forwardRef((props, forwardedRef) => unstable_createElement('select', {
  ...props,
  ref: forwardedRef
}));
const Picker = /*#__PURE__*/forwardRef((props, forwardedRef) => {
  const {
    enabled,
    onValueChange,
    selectedValue,
    itemStyle,
    mode,
    prompt,
    dropdownIconColor,
    ...other
  } = props;
  const handleChange = React.useCallback(e => {
    const {
      selectedIndex,
      value
    } = e.target;
    if (onValueChange) {
      onValueChange(value, selectedIndex);
    }
  }, [onValueChange]);
  return (
    /*#__PURE__*/
    // $FlowFixMe
    React.createElement(Select, _extends({
      disabled: enabled === false ? true : undefined,
      onChange: handleChange,
      ref: forwardedRef,
      value: selectedValue
    }, other))
  );
});

// $FlowFixMe
Picker.Item = PickerItem;
export default Picker;
//# sourceMappingURL=Picker.web.js.map