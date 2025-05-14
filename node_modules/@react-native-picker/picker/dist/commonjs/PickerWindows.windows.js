/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 *
 * 
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const RNCPicker = (0, _reactNative.requireNativeComponent)('RNCPicker');
/**
 * Not exposed as a public API - use <Picker> instead.
 */

class PickerWindows extends _react.default.Component {
  static getDerivedStateFromProps(props) {
    let selectedIndex = -1;
    const items = [];
    _react.default.Children.toArray(props.children).forEach((c, index) => {
      const child = c;
      if (child.props.value === props.selectedValue) {
        selectedIndex = index;
      }
      items.push({
        value: child.props.value,
        label: child.props.label,
        textColor: (0, _reactNative.processColor)(child.props.color),
        testID: child.props.testID
      });
    });
    return {
      selectedIndex,
      items
    };
  }
  state = PickerWindows.getDerivedStateFromProps(this.props);
  render() {
    const nativeProps = {
      enabled: this.props.enabled,
      items: this.state.items,
      onChange: this._onChange,
      placeholder: this.props.placeholder,
      selectedIndex: this.state.selectedIndex,
      testID: this.props.testID,
      style: [styles.pickerWindows, this.props.style, this.props.itemStyle],
      accessibilityLabel: this.props.accessibilityLabel
    };
    return /*#__PURE__*/_react.default.createElement(RNCPicker, _extends({
      ref: this._setRef
    }, nativeProps, {
      onStartShouldSetResponder: () => true,
      onResponderTerminationRequest: () => false
    }));
  }
  _setRef = comboBox => {
    this._picker = comboBox;
  };
  _onChange = event => {
    if (this._picker) {
      this._picker.setNativeProps({
        selectedIndex: this.state.selectedIndex,
        text: this.props.text
      });
    }
    this.props.onChange && this.props.onChange(event);
    this.props.onValueChange && this.props.onValueChange(event.nativeEvent.value, event.nativeEvent.itemIndex, event.nativeEvent.text);
  };
}
const styles = _reactNative.StyleSheet.create({
  pickerWindows: {
    height: 32
  }
});
var _default = exports.default = PickerWindows;
//# sourceMappingURL=PickerWindows.windows.js.map