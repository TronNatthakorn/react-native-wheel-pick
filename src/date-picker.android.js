import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
// import { ColorPropType, ViewPropTypes as RNViewPropTypes } from 'deprecated-react-native-prop-types'
import PropTypes from 'prop-types';
import moment from 'moment';
import Picker from './picker';

// const ViewPropTypes = RNViewPropTypes || View.propTypes;
const firstTimeOnChange = {
  year: true,
  month: true,
  date: true,
  hour: true,
  minute: true,
}

const styles = StyleSheet.create({
  picker: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});

const stylesFromProps = props => ({
  textColor: props.textColor,
  textSize: props.textSize,
  style: props.style,
});

export default class DatePicker extends PureComponent {
  static propTypes = {
    labelUnit: PropTypes.shape({
      year: PropTypes.string,
      month: PropTypes.array,
      date: PropTypes.string,
    }),
    order: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    maximumDate: PropTypes.instanceOf(Date),
    minimumDate: PropTypes.instanceOf(Date),
    mode: PropTypes.oneOf(['date', 'time', 'datetime']),
    onDateChange: PropTypes.func.isRequired,
    // style: ViewPropTypes.style,
    // textColor: ColorPropType,
    textSize: PropTypes.number,
  };

  static defaultProps = {
    labelUnit: {
      year: '',
      month: moment.months(),
      date: ''
    },
    order: 'M-D-Y',
    mode: 'date',
    maximumDate: moment().add(10, 'years').toDate(),
    minimumDate: moment().add(-10, 'years').toDate(),
    date: new Date(),
    style: null,
    textColor: '#333',
    textSize: 26,
  };

  constructor(props) {
    super(props);

    const { date, minimumDate, maximumDate, labelUnit } = props;

    this.state = { date, monthRange: [], yearRange: [] };

    this.newValue = {};

    this.parseDate(date);

    const mdate = moment(date);

    const dayNum = mdate.daysInMonth();
    this.state.dayRange = this.genDateRange(dayNum);

    const minYear = minimumDate.getFullYear();
    const maxYear = maximumDate.getFullYear();

    for (let i = 1; i <= 12; i += 1) {
      this.state.monthRange.push({ value: i, label: `${labelUnit.month[i - 1]}` });
    }

    this.state.yearRange.push({ value: minYear, label: `${minYear}${labelUnit.year}` });

    for (let i = minYear + 1; i <= maxYear; i += 1) {
      this.state.yearRange.push({ value: i, label: `${i}${labelUnit.year}` });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.date !== nextProps.date) {

      if(typeof this === 'object' && typeof this.parseDate === 'function'){
        this.parseDate(nextProps.date);
      }

      return { date: nextProps.date }
    }
    else return null;
  }

  parseDate = (date) => {
    const mdate = moment(date);

    ['year', 'month', 'date', 'hour', 'minute'].forEach((s) => { this.newValue[s] = mdate.get(s); });
  }

  onYearChange = (year) => {
    const oldYear = this.newValue.year;

    this.newValue.year = year;
    this.checkDate(oldYear, this.newValue.month);
    if(firstTimeOnChange.year) {
      firstTimeOnChange.year = false
    }
    this.props.onDateChange(this.getValue());
  };

  onMonthChange = (month) => {
    const oldMonth = this.newValue.month;

    this.newValue.month = month - 1;
    this.checkDate(this.newValue.year, oldMonth);
    if(firstTimeOnChange.month) {
      firstTimeOnChange.month = false
    }
    this.props.onDateChange(this.getValue());
  };

  onDateChange = (date) => {
    this.newValue.date = date;
    this.checkDate(this.newValue.year, this.newValue.month);
    if(firstTimeOnChange.date) {
      firstTimeOnChange.date = false
    }
    this.props.onDateChange(this.getValue());
  };

  onHourChange = (hour) => {
    this.newValue.hour = hour;
    if(firstTimeOnChange.hour) {
      firstTimeOnChange.hour = false
    }
    this.props.onDateChange(this.getValue());
  };

  onMinuteChange = (minute) => {
    this.newValue.minute = minute;
    if(firstTimeOnChange.minute) {
      firstTimeOnChange.minute = false
    }
    this.props.onDateChange(this.getValue());
  };

  genDateRange(dayNum) {
    const days = [];

    for (let i = 1; i <= dayNum; i += 1) {
      days.push({ value: i, label: `${i}${this.props.labelUnit.date}` });
    }

    return days;
  }

  render() {
    const width_wrapper = this.props.style.width || '100%';

    return (
      <View style={{...styles.row, width: width_wrapper}}>
        {['date', 'datetime'].includes(this.props.mode) && this.datePicker}
        {['time', 'datetime'].includes(this.props.mode) && this.timePicker}
      </View>
    );
  }

  get datePicker() {
    const propsStyles = stylesFromProps(this.props);

    const { order } = this.props;

    if (!order.includes('D') && !order.includes('M') && !order.includes('Y')) {
      throw new Error(`WheelDatePicker: you are using order prop wrong, default value is 'D-M-Y'`);
    }

    return this.props.order.split('-').map((key) => {
      switch (key) {
        case 'D': return (
          <View key='date' style={styles.picker}>
            <Picker
              {...propsStyles}
              {...this.props}
              style={{...this.props.style, width: '100%'}}
              ref={(date) => { this.dateComponent = date; }}
              selectedValue={this.state.date.getDate()}
              pickerData={this.state.dayRange}
              onValueChange={this.onDateChange}
            />
          </View>
        );
        case 'M': return (
          <View key='month' style={styles.picker}>
            <Picker
              {...propsStyles}
              {...this.props}
              style={{...this.props.style, width: '100%'}}
              ref={(month) => { this.monthComponent = month; }}
              selectedValue={this.state.date.getMonth() + 1}
              pickerData={this.state.monthRange}
              onValueChange={this.onMonthChange}
            />
          </View>
        );
        case 'Y': return (
          <View key='year' style={styles.picker}>
            <Picker
              {...propsStyles}
              {...this.props}
              style={{...this.props.style, width: '100%'}}
              ref={(year) => { this.yearComponent = year; }}
              selectedValue={this.state.date.getFullYear()}
              pickerData={this.state.yearRange}
              onValueChange={this.onYearChange}
            />
          </View>
        );
        default: return null;
      }
    })
  }

  get timePicker() {
    const propsStyles = stylesFromProps(this.props);

    const [hours, minutes] = [[], []];

    for (let i = 0; i <= 23; i += 1) {
      // hours.push(i);
      hours.push({ value: i, label: `${i}` })
    }

    for (let i = 0; i <= 59; i += 1) {
      // minutes.push(i);
      minutes.push({ value: i, label: `${i}` })
    }

    return [
      <View key='hour' style={styles.picker}>
        <Picker
          ref={(hour) => { this.hourComponent = hour; }}
          {...propsStyles}
          selectedValue={this.state.date.getHours()}
          pickerData={hours}
          onValueChange={this.onHourChange}
        />
      </View>,
      <View key='minute' style={styles.picker}>
        <Picker
          ref={(minute) => { this.minuteComponent = minute; }}
          {...propsStyles}
          selectedValue={this.state.date.getMinutes()}
          pickerData={minutes}
          onValueChange={this.onMinuteChange}
        />
      </View>,
    ];
  }

  checkDate(oldYear, oldMonth) {
    const currentMonth = this.newValue.month;
    const currentYear = this.newValue.year;
    const currentDay = this.newValue.date;

    let dayRange = this.state.dayRange;
    let dayNum = dayRange.length;

    if (oldMonth !== currentMonth || oldYear !== currentYear) {
      dayNum = moment(`${currentYear}-${currentMonth + 1}`, 'YYYY-MM').daysInMonth();
    }

    if (dayNum !== dayRange.length) {
      dayRange = this.genDateRange(dayNum);

      if (currentDay > dayNum) {
        this.newValue.date = dayNum;
        this.dateComponent.setState({ selectedValue: dayNum });
      }

      this.setState({ dayRange });
    }

    const unit = this.props.mode === 'date' ? 'day' : undefined;
    const current = Object.assign({}, this.newValue, { date: this.newValue.date });
    let currentTime = moment(current);
    const min = moment(this.props.minimumDate);
    const max = moment(this.props.maximumDate);
    let isCurrentTimeChanged = false;

    if (currentTime.isBefore(min, unit)) {
      [currentTime, isCurrentTimeChanged] = [min, true];
    } else if (currentTime.isAfter(max, unit)) {
      [currentTime, isCurrentTimeChanged] = [max, true];
    }

    if (isCurrentTimeChanged) {
      if (this.monthComponent) {
        this.monthComponent.setState({ selectedValue: currentTime.get('month') + 1 });
      }

      ['year', 'date', 'hour', 'minute'].forEach((segment) => {
        const ref = this[`${segment}Component`];

        return ref && ref.setState({ selectedValue: currentTime.get(segment) });
      });
    }
  }

  getValue() {
    const { year, month, date, hour, minute } = this.newValue;
    const nextDate = new Date(Date.UTC(year, month, date, hour, minute));

    if (nextDate < this.props.minimumDate) {
      return this.props.minimumDate;
    }

    return nextDate > this.props.maximumDate ? this.props.maximumDate : nextDate;
  }
}
