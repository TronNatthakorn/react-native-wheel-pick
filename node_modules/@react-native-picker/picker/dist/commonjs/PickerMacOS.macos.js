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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _RNCPickerNativeComponent = _interopRequireDefault(require("./RNCPickerNativeComponent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
        textColor: (0, _reactNative.processColor)(child.props.color),
        testID: child.props.testID
      });
    });
    return {
      selectedIndex,
      items
    };
  }
  render() {
    return /*#__PURE__*/React.createElement(_reactNative.View, {
      style: this.props.style
    }, /*#__PURE__*/React.createElement(_RNCPickerNativeComponent.default, {
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
const styles = _reactNative.StyleSheet.create({
  pickerMacOS: {
    // The picker will conform to whatever width is given, but we do
    // have to set the component's height explicitly on the
    // surrounding view to ensure it gets rendered.
    height: 24
  }
});
var _default = exports.default = PickerMacOS;
//# sourceMappingURL=PickerMacOS.macos.js.map