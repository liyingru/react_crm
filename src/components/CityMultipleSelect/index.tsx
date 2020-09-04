import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { SelectValue } from 'antd/lib/select';
import LOCAL from '@/utils/LocalStorageKeys';
const { Option } = Select;

interface CityMultipleSelectState {
  areaData: [],
  cityData: [],
  selectedCodes: [],
  disabled: boolean,
  reset: boolean
}

interface CityMultipleSelectProps extends FormComponentProps {
  areaData: [];
  cityData: [];
  disabled?: boolean;
  reset?: boolean;
  selectedCodes?: [];
  citySelectChange: (codes: string[]) => void;
}

class CityMultipleSelect extends Component<CityMultipleSelectProps, CityMultipleSelectState> {
  static defaultProps = {
    disabled: false,
    reset: false,
    selectedCodes: [],
    citySelectChange: (codes: string[]) => { }
  };

  constructor(props: CityMultipleSelectProps) {
    super(props);

    this.state = {
      areaData: [],
      cityData: [],
      selectedCodes: (props.selectedCodes ? props.selectedCodes : []),
      disabled: (props.disabled ? props.disabled : false),
      reset: (props.reset ? props.reset : false)
    };
  }

  componentDidMount() {
    // const { citySelectChange, selectedCodes } = this.props;
    const that = this;

    let areaJsonData = localStorage ? JSON.parse(localStorage.getItem(LOCAL.CITY_AREA)) : undefined;
    if (areaJsonData === null || areaJsonData === undefined) {
      fetch('/area.json')
        .then(res => res.json())
        .then(json => {
          localStorage.setItem(LOCAL.CITY_AREA, JSON.stringify(json));
          areaJsonData = json;
          that.loadData(areaJsonData);
        });
    } else {
      that.loadData(areaJsonData);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const that = this;
    if (this.props.disabled !== nextProps.disabled || this.props.reset !== nextProps.reset || this.props.selectedCodes !== nextProps.selectedCodes) {
      this.setState({
        disabled: nextProps.disabled ? nextProps.disabled : false,
        reset: this.props.reset !== nextProps.reset ? nextProps.reset : false,
        selectedCodes: this.props.selectedCodes !== nextProps.selectedCodes ? nextProps.selectedCodes : this.props.selectedCodes
      }, () => {
        if (that.state.reset) {
          this.setState({
            selectedCodes: []
          });
          console.log("我要重置了");
          const option = {
            props: {}
          }
          that.onCityChange('', option);
        }
      });
    }
  }

  loadData(areaJsonData: any) {
    const that = this;
    that.setState({
      areaData: areaJsonData
    }, () => {
      var tempCityData = [];
      that.state.areaData && that.state.areaData.map((area, index) => {
        if (area.code && (area.code == '110000' || area.code == '120000' || area.code == '310000' || area.code == '500000')) {
          tempCityData.push(area);
        } else {
          var c = area.children;
          c && c.map((city, index) => {
            tempCityData.push(city);
          });
        }

      });

      that.setState({
        cityData: tempCityData
      }, () => {
        let isArea = localStorage ? JSON.parse(localStorage.getItem('tempCityData')) : undefined;
        if (isArea === null || isArea === undefined) {
          localStorage.setItem('tempCityData', JSON.stringify(tempCityData));
        }
      });

    });
  }

  onCityChange = (value: SelectValue, option: React.ReactElement<any> | React.ReactElement<any>[]) => {
    console.log(`selected ${value}`);
    // console.log(value);

    this.props.citySelectChange(value);
    this.setState({
      selectedCodes: value
    });
  }

  render() {
    const { cityData, selectedCodes, disabled, reset } = this.state;
    console.log(selectedCodes, '--------selectedCodes')
    if (cityData === null || cityData === undefined) {
      return (<div></div>);
    } else {
      return (
        <div style={{ width: '100%', display: 'flex' }}>
          {
            reset ? (
              <Select
                showSearch
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择城市"
                onChange={this.onCityChange}
                filterOption={(input, option) =>
                  option.props.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={selectedCodes}
                disabled={disabled}
              >
                {cityData && cityData.map((city, index) => (
                  <Option name={city.name} value={city.code} key={index}>{city.name}</Option>
                ))}
              </Select>
            ) : (
                <Select
                  showSearch
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择城市"
                  onChange={this.onCityChange}
                  filterOption={(input, option) =>
                    option.props.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  defaultValue={selectedCodes}
                  disabled={disabled}
                >
                  {cityData && cityData.map((city, index) => (
                    <Option name={city.name} value={city.code} key={index}>{city.name}</Option>
                  ))}
                </Select>
              )
          }

        </div>
      );
    }
  }
}

export default Form.create<CityMultipleSelectProps>()(CityMultipleSelect);
