/**
 * Copyright (c) Nicolas Gallagher.
 *
 * 
 *
 */

import * as React from 'react';
import * as ReactNativeWeb from 'react-native-web';
const Option = props => ReactNativeWeb.unstable_createElement('option', props);

/**
 * PickerItem Component for React Native Web
 * @returns
 */
export default function PickerItem({
  color,
  label,
  testID,
  value,
  enabled = true
}) {
  return /*#__PURE__*/React.createElement(Option, {
    disabled: enabled === false ? true : undefined,
    style: {
      color
    },
    testID: testID,
    value: value,
    label: label
  }, label);
}
//# sourceMappingURL=PickerItem.js.map