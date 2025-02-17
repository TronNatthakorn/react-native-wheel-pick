import React, { PureComponent } from 'react';
// import { DatePickerIOS } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';

export default class DatePicker extends PureComponent {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
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
    date: new Date(),
  };

  // @react-native-community/datetimepicker
  //2022 use value instead of date
  //2022 use onChange instead of onDateChange (and first param not date anymore)
  render() {
    return (
      <DateTimePicker
        {...this.props}
        onChange={(event, date) => this.onDateChange(date)}
        display='spinner'
        value={this.state.date}
      />
    );
  }

  componentDidMount() {
    this.setState({ date: this.props.date })
  }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this.setState({ date: this.props.date })
    }
  }

  onDateChange = (date) => {
    this.setState({ date });
    this.props.onDateChange(date);
  }
}
