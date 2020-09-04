import React, { Component } from 'react';
import { Form, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { SelectValue } from 'antd/lib/select';
import LOCAL from '@/utils/LocalStorageKeys';

const { Option } = Select;

interface AreaSelectState {
  areaData: [],
  cityData: [],
  districtData: [],

  selectedCode: string | undefined,

  selectedProvince: string | undefined,
  selectedCity: string | undefined,
  selectedDistrict: string | undefined,

  cityDisabled: boolean,
  districtDisabled: boolean,

  disabled: boolean,
  reset: boolean
}

interface AreaSelectProps extends FormComponentProps {
  disabled?: boolean;
  reset?: boolean;
  level3?: boolean;
  selectedCode?: string | undefined;
  // selectedProvince?: string;
  // selectedCity?: string;
  // selectedDistrict?: string;
  areaSelectChange: (code?: string, province?: string, city?: string, district?: string) => void;
  size?: "small" | "default" | "large" | undefined;
}

class AreaSelect extends Component<AreaSelectProps, AreaSelectState> {
  static defaultProps = {
    selectedCode: undefined,
    selectedProvince: undefined,
    selectedCity: undefined,
    selectedDistrict: undefined,

    cityDisabled: true,
    districtDisabled: true,

    disabled: false,
    reset: false,
    level3: false,

    // selectedProvince: '全国',
    // selectedCity: '',
    // selectedDistrict: '',
    areaSelectChange: (code: string, province: string, city: string, district: string) => { },
  };

  constructor(props: AreaSelectProps) {
    super(props);

    this.state = {
      areaData: [],
      cityData: [],
      districtData: [],
      selectedCode: props.selectedCode,
      selectedProvince: undefined,
      selectedCity: undefined,
      selectedDistrict: undefined,
      cityDisabled: true,
      districtDisabled: true,
      disabled: (props.disabled ? props.disabled : false),
      reset: (props.reset ? props.reset : false)
    };
  }

  componentDidMount() {
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

    if (this.props.disabled !== nextProps.disabled || this.props.reset !== nextProps.reset || this.props.selectedCode !== nextProps.selectedCode) {
      this.setState({
        disabled: nextProps.disabled ? nextProps.disabled : false,
        reset: this.props.reset !== nextProps.reset ? nextProps.reset : false,
        // selectedProvince: this.props.selectedProvince !== nextProps.selectedProvince ? nextProps.selectedProvince : this.props.selectedProvince,
        selectedCode: this.props.selectedCode !== nextProps.selectedCode ? nextProps.selectedCode : this.props.selectedCode
      }, () => {
        if (that.state.reset) {
          console.log("我要重置了");
          const option = {
            props: {

            }
          }
          that.onProvinceChange('', option);
        } else if (that.state.selectedCode !== undefined) {
          console.log(that.state.selectedCode);
          that.myValue(that, that.props.areaSelectChange, that.state.selectedCode);
        }
      });
    }
  }

  loadData(areaJsonData: any) {
    const { areaSelectChange, selectedCode } = this.props;
    const that = this;
    that.setState({
      areaData: areaJsonData
    }, () => {
      that.myValue(that, areaSelectChange, selectedCode);
    });
  }

  myValue(obj: AreaSelect, areaSelectChange: (code: string, province: string, city: string, district: string) => void, selectedCode: string | undefined) {
    const { areaData } = this.state;
    if (selectedCode !== null && selectedCode !== undefined && selectedCode.length > 0) {
      var tempIndex = 0;
      var tempChildren = '';
      var pCode = selectedCode.length == 6 ? selectedCode.substr(0, 2) + '0000' : '';

      areaData && areaData.map((area, index) => {
        if (area.code == pCode) {
          tempIndex = index;
          tempChildren = area.name;
        }
      });

      const option = {
        props: {
          index: tempIndex.toString(),
          code: pCode,
          children: tempChildren
        }
      }

      obj.onProvinceChange(pCode, option, selectedCode);
    }
  }

  onProvinceChange = (value: SelectValue, option: React.ReactElement<any> | React.ReactElement<any>[], selectedCode?: string) => {
    const { areaData } = this.state;
    if (areaData === undefined) {
      return;
    }

    const { areaSelectChange } = this.props;
    const index = option.props.index;
    const cityData = areaData[index] && areaData[index]['children'];
    const districtData = cityData && cityData[0] && cityData[0] && cityData[0]['children'];
    const that = this;
    if (index == '31') {
      this.setState({
        cityData: [],
        districtData: [],
        selectedCode: option.props.code,
        selectedProvince: option.props.children,
        selectedCity: '',
        selectedDistrict: '',
        cityDisabled: true,
        districtDisabled: true,
        // disabled: disabled,
        // reset: false
      }, () => {

      });

      if (areaSelectChange !== undefined) {
        areaSelectChange(value, option.props.children, '', '');
      }
    } else {
      this.setState({
        cityData: cityData,
        districtData: districtData,
        selectedCode: option.props.code,
        selectedProvince: option.props.children,
        selectedCity: cityData && cityData[0].name,
        selectedDistrict: districtData && districtData[0].name,
        cityDisabled: false,
        districtDisabled: districtData ? false : true,
        // disabled: disabled,
        // reset: false
      }, () => {
        if (cityData) {
          var tempIndex = 0;
          var tempChildren = '';

          if (selectedCode === undefined) {
            cityData.map((city, index) => {
              if (city.code == value) {
                tempIndex = index;
                tempChildren = city.name;
              }
            });
            const option = {
              props: {
                index: tempIndex.toString(),
                code: value,
                children: tempChildren
              }
            }
            that.onCityChange(value, option)
          } else {
            cityData.map((city, index) => {
              if (city.code == selectedCode) {
                tempIndex = index;
                tempChildren = city.name;
              }
            });
            const option = {
              props: {
                index: tempIndex.toString(),
                code: selectedCode,
                children: tempChildren
              }
            }
            that.onCityChange(value, option, selectedCode);
          }
        }
      });

      // if (areaSelectChange !== undefined) {
      //   const city = cityData && cityData[0].name;
      //   const district = districtData && districtData[0].name;
      //   areaSelectChange(value, option.props.children, city, district);
      // }
    }
  };

  onCityChange = (value: SelectValue, option: React.ReactElement<any> | React.ReactElement<any>[], selectedCode?: string) => {
    if (value === undefined) {
      return;
    }

    const { areaSelectChange } = this.props;
    const { cityData, selectedProvince } = this.state;
    var index = option.props.index;
    var districtData = cityData[index] && cityData[index]['children'];
    var code = cityData[index]['code'];
    var name = cityData[index]['name'];
    const that = this;

    let pCode = code.length == 6 ? code.substr(0, 2) + '0000' : '';

    if (selectedCode !== undefined) {
      var cCode = selectedCode.substr(0, 4) + '00';
      if (cityData) {
        var tempIndex = 0;
        var tempChildren = option.props.children;
        cityData.map((city, index) => {
          if (city.code == cCode) {
            tempIndex = index;
            tempChildren = city.name;
          }
        });

        if (tempChildren === '市辖区') {
          cityData.map((city, index) => {
            if (city.code == selectedCode) {
              tempIndex = index;
              tempChildren = city.name;
            }
          });

          const cOption = {
            props: {
              index: tempIndex.toString(),
              code: pCode,
              children: tempChildren
            }
          }

          index = cOption.props.index;
          districtData = cityData[index] && cityData[index]['children'];
          name = cityData[index]['name'];
        } else {
          const cOption = {
            props: {
              index: tempIndex.toString(),
              code: cCode,
              children: tempChildren
            }
          }

          index = cOption.props.index;
          districtData = cityData[index] && cityData[index]['children'];
          name = cityData[index]['name'];
        }
      }
    }

    this.setState({
      districtData: districtData,
      selectedCode: name === '市辖区' ? pCode : selectedCode,
      selectedCity: name,
      selectedDistrict: districtData && districtData[0] && districtData[0].name,
      districtDisabled: districtData ? false : true,
      // disabled: disabled,
      // reset: false
    }, () => {
      if (districtData) {
        var tempIndex = 0;
        var tempChildren = '';
        districtData.map((district, index) => {
          if (district.code == selectedCode) {
            tempIndex = index;
            tempChildren = district.name;
          }
        });

        const option = {
          props: {
            index: tempIndex.toString(),
            code: selectedCode ? selectedCode : code,
            children: tempChildren
          }
        }

        that.onDistrictChange(selectedCode, option);
      } else if (name === '市辖区') {
        if (areaSelectChange !== undefined) {
          areaSelectChange(pCode, selectedProvince, name, districtData && districtData[0] && districtData[0].name);
        }
      } else {
        if (areaSelectChange !== undefined) {
          areaSelectChange(selectedCode ? selectedCode : code, selectedProvince, name, districtData && districtData[0] && districtData[0].name);
        }
      }
    });
  };

  onDistrictChange = (value: SelectValue, option: React.ReactElement<any> | React.ReactElement<any>[]) => {
    const { areaSelectChange } = this.props;
    const { districtData, selectedProvince, selectedCity } = this.state;
    const index = option.props.index;
    const name = districtData[index]['name'];
    if (name === '市辖区') {
      let dCode = option.props.code.length == 6 ? option.props.code.substr(0, 5) + '0' : '';
      this.setState({
        selectedCode: dCode,
        selectedDistrict: name
      }, () => {
        if (areaSelectChange !== undefined) {
          areaSelectChange(dCode, selectedProvince, selectedCity, name);
        }
      });
    } else {
      this.setState({
        selectedCode: option.props.code,
        selectedDistrict: name
      }, () => {
        if (areaSelectChange !== undefined) {
          areaSelectChange(option.props.code, selectedProvince, selectedCity, name);
        }
      });
    }
  }

  render() {
    const { level3, size } = this.props;
    const { areaData, cityData, districtData, selectedProvince, selectedCity, selectedDistrict, cityDisabled, districtDisabled, disabled } = this.state;
    if (areaData === undefined) {
      return (<div></div>);
    } else if (level3) {
      return (
        <div style={{ width: '100%', display: 'flex' }}>
          <Select
            size={size}
            showSearch
            style={{ width: '30%' }}
            placeholder="请选择"
            optionFilterProp="children"
            onChange={this.onProvinceChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={disabled}
            value={selectedProvince}
          >
            {areaData && areaData.map((area, index) => (
              <Option code={area.code} value={area.code} key={area.code} index={index}>{area.name}</Option>
            ))}
          </Select>
          <span>&nbsp;~&nbsp;</span>
          <Select
            size={size}
            showSearch
            style={{ width: '30%' }}
            placeholder="请选择"
            optionFilterProp="children"
            onChange={this.onCityChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={disabled ? true : cityDisabled}
            value={selectedCity}
          >
            {cityData && cityData.map((city, index) => (
              <Option code={city.code} value={city.code} key={city.code} index={index}>{city.name}</Option>
            ))}
          </Select>
          <span>&nbsp;~&nbsp;</span>
          <Select
            size={size}
            showSearch
            style={{ width: '30%' }}
            placeholder="请选择"
            optionFilterProp="children"
            onChange={this.onDistrictChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={disabled ? true : districtDisabled}
            value={selectedDistrict}
          >
            {districtData && districtData.map((district, index) => (
              <Option code={district.code} value={district.code} key={district.code} index={index}>{district.name}</Option>
            ))}
          </Select>
        </div>
      );
    } else {
      return (
        <div style={{ width: '100%', display: 'flex' }}>
          <Select
            size={size}
            showSearch
            style={{ width: '45%' }}
            placeholder="请选择"
            optionFilterProp="children"
            onChange={this.onProvinceChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={disabled}
            value={selectedProvince}
          >
            {areaData && areaData.map((area, index) => (
              <Option code={area.code} value={area.code} key={area.code} index={index}>{area.name}</Option>
            ))}
          </Select>
          <span>&nbsp;-&nbsp;</span>
          <Select
            size={size}
            showSearch
            style={{ width: '45%' }}
            placeholder="请选择"
            optionFilterProp="children"
            onChange={this.onCityChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={disabled ? true : cityDisabled}
            value={selectedCity}
          >
            {cityData && cityData.map((city, index) => (
              <Option code={city.code} value={city.code} key={city.code} index={index}>{city.name}</Option>
            ))}
          </Select>
        </div>
      );
    }
  }
}

export default Form.create<AreaSelectProps>()(AreaSelect);
