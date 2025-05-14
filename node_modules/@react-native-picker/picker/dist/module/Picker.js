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

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import * as React from 'react';
import { Platform } from 'react-native';
import PickerAndroid from './PickerAndroid';
import PickerIOS from './PickerIOS';
import PickerWindows from './PickerWindows';
import PickerMacOS from './PickerMacOS';
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
    if (Platform.OS === 'ios') {
      /* $FlowFixMe(>=0.81.0 site=react_native_ios_fb) This suppression was
       * added when renaming suppression sites. */
      return /*#__PURE__*/React.createElement(PickerIOS, this.props, this.props.children);
    } else if (Platform.OS === 'macos') {
      /* $FlowFixMe(>=0.81.0 site=react_native_ios_fb) This suppression was
       * added when renaming suppression sites. */
      return /*#__PURE__*/React.createElement(PickerMacOS, this.props, this.props.children);
    } else if (Platform.OS === 'android') {
      return (
        /*#__PURE__*/
        /* $FlowFixMe(>=0.81.0 site=react_native_android_fb) This suppression
         * was added when renaming suppression sites. */
        React.createElement(PickerAndroid, _extends({
          ref: this.pickerRef
        }, this.props), this.props.children)
      );
    } else if (Platform.OS === 'windows') {
      return /*#__PURE__*/React.createElement(PickerWindows, this.props, this.props.children);
    } else {
      return null;
    }
  }
}
export default Picker;
//# sourceMappingURL=Picker.js.map