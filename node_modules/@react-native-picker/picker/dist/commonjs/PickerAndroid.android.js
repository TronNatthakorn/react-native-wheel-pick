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
var _AndroidDialogPickerNativeComponent = _interopRequireWildcard(require("./AndroidDialogPickerNativeComponent"));
var _AndroidDropdownPickerNativeComponent = _interopRequireWildcard(require("./AndroidDropdownPickerNativeComponent"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const MODE_DROPDOWN = 'dropdown';
/**
 * Not exposed as a public API - use <Picker> instead.
 */
function PickerAndroid(props, ref) {
  var _global;
  const pickerRef = React.useRef(null);
  const FABRIC_ENABLED = !!((_global = global) !== null && _global !== void 0 && _global.nativeFabricUIManager);
  const [nativeSelectedIndex, setNativeSelectedIndex] = React.useState({
    value: null
  });
  React.useImperativeHandle(ref, () => {
    const viewManagerConfig = _reactNative.UIManager.getViewManagerConfig(props.mode === MODE_DROPDOWN ? 'RNCAndroidDialogPicker' : 'RNCAndroidDropdownPicker');
    return {
      blur: () => {
        if (!viewManagerConfig.Commands) {
          return;
        }
        if (FABRIC_ENABLED) {
          if (props.mode === MODE_DROPDOWN) {
            _AndroidDropdownPickerNativeComponent.Commands.blur(pickerRef.current);
          } else {
            _AndroidDialogPickerNativeComponent.Commands.blur(pickerRef.current);
          }
        } else {
          _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(pickerRef.current), viewManagerConfig.Commands.blur, []);
        }
      },
      focus: () => {
        if (!viewManagerConfig.Commands) {
          return;
        }
        if (FABRIC_ENABLED) {
          if (props.mode === MODE_DROPDOWN) {
            _AndroidDropdownPickerNativeComponent.Commands.focus(pickerRef.current);
          } else {
            _AndroidDialogPickerNativeComponent.Commands.focus(pickerRef.current);
          }
        } else {
          _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(pickerRef.current), viewManagerConfig.Commands.focus, []);
        }
      }
    };
  });
  React.useLayoutEffect(() => {
    let jsValue = 0;
    React.Children.toArray(props.children).map((child, index) => {
      var _child$props;
      if (child === null) {
        return null;
      }
      if ((child === null || child === void 0 || (_child$props = child.props) === null || _child$props === void 0 ? void 0 : _child$props.value) === props.selectedValue) {
        jsValue = index;
      }
    });
    const shouldUpdateNativePicker = nativeSelectedIndex.value != null && nativeSelectedIndex.value !== jsValue;

    // This is necessary in case native updates the switch and JS decides
    // that the update should be ignored and we should stick with the value
    // that we have in JS.
    if (shouldUpdateNativePicker && pickerRef.current) {
      if (FABRIC_ENABLED) {
        if (props.mode === MODE_DROPDOWN) {
          _AndroidDropdownPickerNativeComponent.Commands.setNativeSelected(pickerRef.current, selected);
        } else {
          _AndroidDialogPickerNativeComponent.Commands.setNativeSelected(pickerRef.current, selected);
        }
      } else {
        pickerRef.current.setNativeProps({
          selected
        });
      }
    }
  }, [props.selectedValue, nativeSelectedIndex, props.children, FABRIC_ENABLED, props.mode, selected]);
  const [items, selected] = React.useMemo(() => {
    // eslint-disable-next-line no-shadow
    let selected = 0;
    // eslint-disable-next-line no-shadow
    const items = React.Children.toArray(props.children).map((child, index) => {
      var _child$props2;
      if (child === null) {
        return null;
      }
      if ((child === null || child === void 0 || (_child$props2 = child.props) === null || _child$props2 === void 0 ? void 0 : _child$props2.value) === props.selectedValue) {
        selected = index;
      }
      const {
        enabled = true
      } = child.props || {};
      const {
        color,
        contentDescription,
        label,
        style = {}
      } = child.props || {};
      const processedColor = (0, _reactNative.processColor)(color);
      return {
        color: color == null ? null : processedColor,
        contentDescription,
        label: String(label),
        enabled,
        style: {
          ...style,
          // there seems to be a problem with codegen, where it would assign to an item
          // the last defined value of the font size if not set explicitly
          // 0 is handled on the native side as "not set"
          fontSize: style.fontSize ?? 0,
          color: style.color ? (0, _reactNative.processColor)(style.color) : null,
          backgroundColor: style.backgroundColor ? (0, _reactNative.processColor)(style.backgroundColor) : null
        }
      };
    });
    return [items, selected];
  }, [props.children, props.selectedValue]);
  const onSelect = React.useCallback(({
    nativeEvent
  }) => {
    const {
      position
    } = nativeEvent;
    const onValueChange = props.onValueChange;
    if (onValueChange != null) {
      if (position >= 0) {
        var _children$position;
        const children = React.Children.toArray(props.children).filter(item => item != null);
        const value = (_children$position = children[position]) === null || _children$position === void 0 || (_children$position = _children$position.props) === null || _children$position === void 0 ? void 0 : _children$position.value;
        if (value !== undefined) {
          onValueChange(value, position);
        }
      } else {
        onValueChange(null, position);
      }
    }
    setNativeSelectedIndex({
      value: position
    });
  }, [props.children, props.onValueChange]);
  const Picker = props.mode === MODE_DROPDOWN ? _AndroidDropdownPickerNativeComponent.default : _AndroidDialogPickerNativeComponent.default;
  const rootProps = {
    accessibilityLabel: props.accessibilityLabel,
    enabled: props.enabled,
    items,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    onSelect,
    prompt: props.prompt,
    selected,
    style: props.style,
    dropdownIconColor: (0, _reactNative.processColor)(props.dropdownIconColor),
    dropdownIconRippleColor: (0, _reactNative.processColor)(props.dropdownIconRippleColor),
    testID: props.testID,
    numberOfLines: props.numberOfLines
  };
  return /*#__PURE__*/React.createElement(Picker, _extends({
    ref: pickerRef
  }, rootProps));
}
var _default = exports.default = /*#__PURE__*/React.forwardRef(PickerAndroid);
//# sourceMappingURL=PickerAndroid.android.js.map