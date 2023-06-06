import React, { Component } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
// import { ColorPropType, ViewPropTypes as RNViewPropTypes, } from 'deprecated-react-native-prop-types'
import PropTypes from 'prop-types';
import WheelCurvedPicker from './WheelCurvedPicker';

// const ViewPropTypes = RNViewPropTypes || View.propTypes;
const PickerItem = WheelCurvedPicker.Item;

const styles = StyleSheet.create({
  picker: {
    backgroundColor: '#d3d3d3',
    height: 220,
  },
});


export default class Picker extends Component {
  static propTypes = {
    // textColor: ColorPropType,
    textSize: PropTypes.number,
    // itemStyle: ViewPropTypes.style,
    onValueChange: PropTypes.func.isRequired,
    pickerData: PropTypes.array.isRequired,
    // style: ViewPropTypes.style,
    selectedValue: PropTypes.any,
  };

  static defaultProps = {
    textColor: '#333',
    textSize: 26,
    itemStyle: null,
    // onValueChange: () => {}, // Require
    // pickerData: [''], // Require
    style: {},
    selectedValue: '',
  };

  state = {
    selectedValue: this.props.selectedValue,
  };

  handleChange = (selectedValue) => {
    this.setState({ selectedValue });
    this.props.onValueChange(selectedValue);
  };

  validateDeprecateProps = (oldProp = 'curtain', newProp = '') => {
    if(this.props){
      if(typeof this.props[oldProp] !== 'undefined'){
        this.props[oldProp] = undefined;

        if(newProp === ''){
          console.warn(`react-native-wheel-pick : "${oldProp}" Prop was deprecated. Please remove it for improve native performance.`)
        } else {
          console.warn(`react-native-wheel-pick : "${oldProp}" Prop was deprecated. Please use "${newProp}" instead.`)
        }
      }
    }
  }

  render() {
    const { pickerData, style, ...props } = this.props;

    if(Platform.OS === 'android'){
      //checkDeprecatedProp
      this.validateDeprecateProps('atmospheric');
      this.validateDeprecateProps('curved');
      this.validateDeprecateProps('visibleItemCount');
      this.validateDeprecateProps('itemSpace');
      this.validateDeprecateProps('curtain', 'isShowSelectBackground');
      this.validateDeprecateProps('curtainColor', 'selectBackgroundColor');

      this.validateDeprecateProps('indicator', 'isShowSelectLine');
      this.validateDeprecateProps('indicatorColor', 'selectLineColor');
      this.validateDeprecateProps('indicatorSize', 'selectLineSize');
    }

    return (
      <WheelCurvedPicker
        {...props}
        style={[styles.picker, style]}
        selectedValue={this.state.selectedValue}
        onValueChange={this.handleChange}
      >
        {pickerData.map((data, index) => (
          <PickerItem
            key={index}
            value={typeof data.value !== 'undefined' ? data.value : data.toString()}
            label={typeof data.label !== 'undefined' ? data.label : data.toString()}
            color={props.textColor}
          />
        ))}
      </WheelCurvedPicker>
    );
  }

  getValue() {
    return this.state.selectedValue;
  }
}
