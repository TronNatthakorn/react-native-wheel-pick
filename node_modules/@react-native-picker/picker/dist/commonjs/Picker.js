/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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
var _PickerAndroid = _interopRequireDefault(require("./PickerAndroid"));
var _PickerIOS = _interopRequireDefault(require("./PickerIOS"));
var _PickerWindows = _interopRequireDefault(require("./PickerWindows"));
var _PickerMacOS = _interopRequireDefault(require("./PickerMacOS"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const MODE_DIALOG = 'dialog';
const MODE_DROPDOWN = 'dropdown';
/**
 * Individual selectable item in a Picker.
 */
class PickerItem extends React.Component {
  render() {
    // The items are not rendered directly
    throw null;
  }
}
/**
 * Renders the native picker component on iOS and Android. Example:
 *
 *     <Picker
 *       selectedValue={this.state.language}
 *       onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
 *       <Picker.Item label="Java" value="java" />
 *       <Picker.Item label="JavaScript" value="js" />
 *     </Picker>
 */
class Picker extends React.Component {
  pickerRef = /*#__PURE__*/React.createRef();
  /**
   * On Android, display the options in a dialog.
   */
  static MODE_DIALOG = MODE_DIALOG;

  /**
   * On Android, display the options in a dropdown (this is the default).
   */
  static MODE_DROPDOWN = MODE_DROPDOWN;
  static Item = PickerItem;
  static defaultProps = {
    mode: MODE_DIALOG
  };
  blur = () => {
    var _this$pickerRef$curre;
    (_this$pickerRef$curre = this.pickerRef.current) === null || _this$pickerRef$curre === void 0 || _this$pickerRef$curre.blur();
  };
  focus = () => {
    var _this$pickerRef$curre2;
    (_this$pickerRef$curre2 = this.pickerRef.current) === null || _this$pickerRef$curre2 === void 0 || _this$pickerRef$curre2.focus();
  };
  render() {
    if (_reactNative.Platform.OS === 'ios') {
      /* $FlowFixMe(>=0.81.0 site=react_native_ios_fb) This suppression was
       * added when renaming suppression sites. */
      return /*#__PURE__*/React.createElement(_PickerIOS.default, this.props, this.props.children);
    } else if (_reactNative.Platform.OS === 'macos') {
      /* $FlowFixMe(>=0.81.0 site=react_native_ios_fb) This suppression was
       * added when renaming suppression sites. */
      return /*#__PURE__*/React.createElement(_PickerMacOS.default, this.props, this.props.children);
    } else if (_reactNative.Platform.OS === 'android') {
      return (
        /*#__PURE__*/
        /* $FlowFixMe(>=0.81.0 site=react_native_android_fb) This suppression
         * was added when renaming suppression sites. */
        React.createElement(_PickerAndroid.default, _extends({
          ref: this.pickerRef
        }, this.props), this.props.children)
      );
    } else if (_reactNative.Platform.OS === 'windows') {
      return /*#__PURE__*/React.createElement(_PickerWindows.default, this.props, this.props.children);
    } else {
      return null;
    }
  }
}
var _default = exports.default = Picker;
//# sourceMappingURL=Picker.js.map