export default class DatePickerWeb extends PureComponent {
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

  render() {
      console.error("Unsupported platform 'web'");
      return (
         null
      );
  }
}
