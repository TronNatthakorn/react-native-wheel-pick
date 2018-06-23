import React, { PureComponent } from 'react';
import { DatePickerIOS } from 'react-native';
import PropTypes from 'prop-types';

export default class DatePicker extends PureComponent {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    maximumDate: PropTypes.instanceOf(Date),
    minimumDate: PropTypes.instanceOf(Date),
    mode: PropTypes.oneOf(['date', 'time', 'datetime']),
    onDateChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    mode: 'date',
    date: new Date(),
  };

  state = {
    date: null,
  };

  onDateChange = (date) => {
    this.setState({ date });
    this.props.onDateChange(date);
  };

  // componentWillMount() {
  //   this.setState({ date: this.props.date });
  // }

  componentDidMount() {
    this.setState({ date: this.props.date });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.date !== nextProps.date) {
      return { date: nextProps.date }
    }
    else return null;
  }

  // componentWillReceiveProps({ date }) {
  //   this.setState({ date });
  // }

  render() {
    return (
      <DatePickerIOS
        {...this.props}
        onDateChange={this.onDateChange}
        date={this.state.date}
      />
    );
  }

  getValue() {
    return this.state.date;
  }
}