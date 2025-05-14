/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * This is a controlled component version of RNCPickerIOS
 *
 * @format
 * 
 */

'use strict';

import * as React from 'react';
import { processColor, StyleSheet, View } from 'react-native';
import RNCPickerNativeComponent, { Commands as iOSPickerCommands } from './RNCPickerNativeComponent';
/**
 * Constructs a new ref that forwards new values to each of the given refs. The
 * given refs will always be invoked in the order that they are supplied.
 *
 * WARNING: A known problem of merging refs using this approach is that if any
 * of the given refs change, the returned callback ref will also be changed. If
 * the returned callback ref is supplied as a `ref` to a React element, this may
 * lead to problems with the given refs being invoked more times than desired.
 */
function useMergeRefs(...refs) {
  return React.useCallback(current => {
    for (const ref of refs) {
      if (ref != null) {
        if (typeof ref === 'function') {
          ref(current);
        } else {
          ref.current = current;
        }
      }
    }
  }, [...refs] // eslint-disable-line react-hooks/exhaustive-deps
  );
}

// $FlowFixMe
const PickerIOSItem = props => {
  return null;
};
const PickerIOSWithForwardedRef = /*#__PURE__*/React.forwardRef(function PickerIOS(props, forwardedRef) {
  const {
    children,
    selectedValue,
    selectionColor,
    themeVariant,
    testID,
    itemStyle,
    numberOfLines,
    onChange,
    onValueChange,
    style,
    accessibilityLabel,
    accessibilityHint
  } = props;
  const nativePickerRef = React.useRef(null);

  // $FlowFixMe
  const ref = useMergeRefs(nativePickerRef, forwardedRef);
  const [nativeSelectedIndex, setNativeSelectedIndex] = React.useState({
    value: null
  });
  const [items, selectedIndex] = React.useMemo(() => {
    // eslint-disable-next-line no-shadow
    let selectedIndex = 0;
    // eslint-disable-next-line no-shadow
    const items = React.Children.toArray(children).map((child, index) => {
      if (child === null) {
        return null;
      }
      if (child.props.value === selectedValue) {
        selectedIndex = index;
      }
      return {
        value: child.props.value,
        label: child.props.label,
        textColor: processColor(child.props.color),
        testID: child.props.testID
      };
    });
    return [items, selectedIndex];
  }, [children, selectedValue]);
  let parsedNumberOfLines = Math.round(numberOfLines ?? 1);
  if (parsedNumberOfLines < 1) {
    parsedNumberOfLines = 1;
  }
  React.useLayoutEffect(() => {
    let jsValue = 0;
    React.Children.toArray(children).forEach(function (child, index) {
      if (child.props.value === selectedValue) {
        jsValue = index;
      }
    });
    // This is necessary in case native updates the switch and JS decides
    // that the update should be ignored and we should stick with the value
    // that we have in JS.
    const shouldUpdateNativePicker = nativeSelectedIndex.value != null && nativeSelectedIndex.value !== jsValue;
    if (shouldUpdateNativePicker && nativePickerRef.current) {
      var _global;
      if ((_global = global) !== null && _global !== void 0 && _global.nativeFabricUIManager) {
        iOSPickerCommands.setNativeSelectedIndex(nativePickerRef.current, jsValue);
      } else {
        nativePickerRef.current.setNativeProps({
          selectedIndex: jsValue
        });
      }
    }
  }, [selectedValue, nativeSelectedIndex, children]);
  const _onChange = React.useCallback(event => {
    onChange === null || onChange === void 0 || onChange(event);
    onValueChange === null || onValueChange === void 0 || onValueChange(event.nativeEvent.newValue, event.nativeEvent.newIndex);
    setNativeSelectedIndex({
      value: event.nativeEvent.newIndex
    });
  }, [onChange, onValueChange]);
  return /*#__PURE__*/React.createElement(View, {
    style: style
  }, /*#__PURE__*/React.createElement(RNCPickerNativeComponent, {
    ref: ref,
    themeVariant: themeVariant,
    testID: testID,
    accessibilityLabel: accessibilityLabel,
    accessibilityHint: accessibilityHint,
    style: [styles.pickerIOS, itemStyle]
    // $FlowFixMe
    ,
    items: items,
    onChange: _onChange,
    numberOfLines: parsedNumberOfLines,
    selectedIndex: selectedIndex,
    selectionColor: processColor(selectionColor)
  }));
});
const styles = StyleSheet.create({
  pickerIOS: {
    // The picker will conform to whatever width is given, but we do
    // have to set the component's height explicitly on the
    // surrounding view to ensure it gets rendered.
    height: 216
  }
});

// $FlowFixMe
PickerIOSWithForwardedRef.Item = PickerIOSItem;
export default PickerIOSWithForwardedRef;
//# sourceMappingURL=PickerIOS.ios.js.map