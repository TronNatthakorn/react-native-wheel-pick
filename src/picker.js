import React, { Component } from 'react';
import { ColorPropType, StyleSheet, View, ViewPropTypes as RNViewPropTypes, Text } from 'react-native';
import PropTypes from 'prop-types';
import WheelCurvedPicker from './WheelCurvedPicker';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

const PickerItem = WheelCurvedPicker.Item;

const styles = StyleSheet.create({
  picker: {
    backgroundColor: '#d3d3d3',
    height: 220,
  },
});


export default class Picker extends Component {
  static propTypes = {
    textColor: ColorPropType,
    textSize: PropTypes.number,
    itemSpace: PropTypes.number,
    itemStyle: ViewPropTypes.style,
    onValueChange: PropTypes.func.isRequired,
    pickerData: PropTypes.array.isRequired,
    style: ViewPropTypes.style,
    selectedValue: PropTypes.any,
  };

  static defaultProps = {
    textColor: '#333',
    textSize: 26,
    itemSpace: 20,
    itemStyle: null,
    style: null,
  };

  state = {
    selectedValue: this.props.selectedValue,
  };

  handleChange = (selectedValue) => {
    this.setState({ selectedValue });
    this.props.onValueChange(selectedValue);
  };

  render() {
    const { pickerData, style, ...props } = this.props;

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
            value={typeof data.value !== 'undefined' ? data.value : data}
            label={typeof data.label !== 'undefined' ? data.label : data.toString()}
          />
        ))}
      </WheelCurvedPicker>
    );
  }

  getValue() {
    return this.state.selectedValue;
  }
}
