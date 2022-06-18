import React, { PureComponent } from 'react';
import { requireNativeComponent, View } from 'react-native';
import { ColorPropType, ViewPropTypes as RNViewPropTypes, } from 'deprecated-react-native-prop-types'
import PropTypes from 'prop-types';

const ViewPropTypes = RNViewPropTypes || View.propTypes;
let firstTimeOnChange = true

const stateFromProps = (props) => {
  let selectedIndex = 0;

  const items = props.children.map(({ props: { value, label } }, index) => {
    if (value === props.selectedValue) {
      selectedIndex = index;
    }

    return { value, label };
  });

  return { selectedIndex, items };
};

class WheelCurvedPicker extends PureComponent {
  static propTypes = {
    ...ViewPropTypes,
    data: PropTypes.array,
    textColor: ColorPropType,
    textSize: PropTypes.number,
    onValueChange: PropTypes.func.isRequired,
    selectedValue: PropTypes.any,
    // selectedIndex: PropTypes.number,
  };

  static defaultProps = {
    textSize: 26,
    textColor: '#333',
  };

  state = {
    selectedIndex: 0
  }

  onValueChange = ({ nativeEvent: { data } }) => {
    this.props.onValueChange(data); 
    if(firstTimeOnChange) {
      return firstTimeOnChange = false
    }
  }

  // componentDidMount() {
  //   this.setState(stateFromProps(this.props));
  // }

  static getDerivedStateFromProps(nextProps) {
    return stateFromProps(nextProps)
  }

  render() {
    const { children, ...otherProps } = this.props;

    return (
      <WheelCurvedPickerNative
        {...otherProps}
        onValueChange={this.onValueChange}
        data={this.state.items}
        selectedIndex={parseInt(this.state.selectedIndex, 10)}
      />
    );
  }
}

class Item extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
  };

  // These items don't get rendered directly.
  render = () => <></>;
}

WheelCurvedPicker.Item = Item;

const WheelCurvedPickerNative = requireNativeComponent('WheelCurvedPicker', WheelCurvedPicker);

export default WheelCurvedPicker;
