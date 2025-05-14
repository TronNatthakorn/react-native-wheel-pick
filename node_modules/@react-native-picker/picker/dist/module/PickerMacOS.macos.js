/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * This is a controlled component version of RNCPickerMacOS
 *
 * @format
 * 
 */

'use strict';

import * as React from 'react';
import { processColor, StyleSheet, View } from 'react-native';
import RNCPickerNativeComponent from './RNCPickerNativeComponent';
const PickerMacOSItem = props => {
  return null;
};
class PickerMacOS extends React.Component {
  _picker = null;
  state = {
    selectedIndex: 0,
    items: []
  };
  static Item = PickerMacOSItem;
  static getDerivedStateFromProps(props) {
    let selectedIndex = 0;
    const items = [];
    React.Children.toArray(props.children).forEach(function (child, index) {
      if (child.props.value === props.selectedValue) {
        selectedIndex = index;
      }
      items.push({
        value: child.props.value,
        label: child.props.label,
        textColor: processColor(child.props.color),
        testID: child.props.testID
      });
    });
    return {
      selectedIndex,
      items
    };
  }
  render() {
    return /*#__PURE__*/React.createElement(View, {
      style: this.props.style
    }, /*#__PURE__*/React.createElement(RNCPickerNativeComponent, {
      ref: picker => {
        this._picker = picker;
      },
      testID: this.props.testID,
      style: [styles.pickerMacOS, this.props.itemStyle]
      // $FlowFixMe
      ,
      items: this.state.items,
      selectedIndex: this.state.selectedIndex,
      onChange: this._onChange
    }));
  }
  _onChange = event => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onValueChange) {
      this.props.onValueChange(event.nativeEvent.newValue, event.nativeEvent.newIndex);
    }

    // The picker is a controlled component. This means we expect the
    // on*Change handlers to be in charge of updating our
    // `selectedValue` prop. That way they can also
    // disallow/undo/mutate the selection of certain values. In other
    // words, the embedder of this component should be the source of
    // truth, not the native component.
    if (this._picker && this.state.selectedIndex !== event.nativeEvent.newIndex) {
      this._picker.setNativeProps({
        selectedIndex: this.state.selectedIndex
      });
    }
  };
}
const styles = StyleSheet.create({
  pickerMacOS: {
    // The picker will conform to whatever width is given, but we do
    // have to set the component's height explicitly on the
    // surrounding view to ensure it gets rendered.
    height: 24
  }
});
export default PickerMacOS;
//# sourceMappingURL=PickerMacOS.macos.js.map