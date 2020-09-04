import React, { Component } from 'react';
import { Card, Col, Row, Select, Radio, DatePicker } from 'antd';
// import { SelectValue } from 'antd/lib/select';
import styles from './index.less';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

interface WorkplaceConditionsState {
  companyValue: string | undefined,
  structureValue: string | undefined,
  structureDisabled: boolean,
  customizeTimeDisabled: boolean
}
export interface WorkplaceConditionsProps {
  companyList: [];
  structureList: [];
  loading?: boolean;
  companyOnChange?: (value: string, option?: React.ReactElement<any> | React.ReactElement<any>[]) => void;
  structureOnChange?: (value: string, option?: React.ReactElement<any> | React.ReactElement<any>[]) => void;
  onTimeChange: (time: Array<string>) => void;
  onTimeRangeChange: (start: string, end: string) => void;
}

class WorkplaceConditions extends Component<WorkplaceConditionsProps, WorkplaceConditionsState> {

  state: WorkplaceConditionsState = {
    companyValue: undefined,
    structureValue: undefined,
    structureDisabled: true,
    customizeTimeDisabled: true
  }

  componentDidMount() {

  }

  companyChanged = (value: string) => {
    this.setState({
      structureValue: undefined,
      structureDisabled: false
    });

    const { companyOnChange } = this.props;
    companyOnChange && companyOnChange(value);
  }

  structureChanged = (value: string) => {
    this.setState({
      structureValue: value
    });
    const { structureOnChange } = this.props;
    structureOnChange && structureOnChange(value);
  }

  onRadioButtonChange = (e: any) => {
    const { onTimeChange } = this.props;
    console.log(`radio checked:${e.target.value}`);
    switch (e.target.value) {
      case 'today':
        const today = [moment().format(dateFormat), moment().format(dateFormat)];
        // console.log(today);
        onTimeChange && onTimeChange(today);
        break;
      case 'thisWeek':
        // 本周
        const thisWeek = [moment().startOf('week').format(dateFormat), moment().endOf('week').format(dateFormat)];
        // console.log(thisWeek);
        onTimeChange && onTimeChange(thisWeek);
        break;
      case 'thisMonth':
        // 本月
        const thisMonth = [moment().startOf('month').format(dateFormat), moment().endOf('month').format(dateFormat)];
        // console.log(thisMonth);
        onTimeChange && onTimeChange(thisMonth);
        break;
      case 'lastWeek':
        // 上周
        const lastWeek = [moment().week(moment().week() - 1).startOf('week').format(dateFormat), moment().week(moment().week() - 1).endOf('week').format(dateFormat)];
        // console.log(lastWeek);
        onTimeChange && onTimeChange(lastWeek);
        break;
      case 'lastMonth':
        // 上月
        const lastMonth = [moment().month(moment().month() - 1).startOf('month').format(dateFormat), moment().month(moment().month() - 1).endOf('month').format(dateFormat)];
        // console.log(lastMonth);
        onTimeChange && onTimeChange(lastMonth);
        break;
      case 'thisYear':
        // 今年
        const thisYear = [moment().startOf('year').format(dateFormat), moment().endOf('year').format(dateFormat)];
        // console.log(lastMonth);
        onTimeChange && onTimeChange(thisYear);
        break;
      default:

        break;
    }

    if (e.target.value == 'customize') {
      this.setState({
        customizeTimeDisabled: false
      }, () => {
        const today = [moment().format(dateFormat), moment().format(dateFormat)];
        // console.log(today);
        onTimeChange && onTimeChange(today);
      });
    } else {
      this.setState({
        customizeTimeDisabled: true
      });
    }
  }

  onRangePickerChange = (value: Array<moment>, dateString: Array<string>) => {
    const { onTimeRangeChange } = this.props;
    onTimeRangeChange && onTimeRangeChange(dateString[0], dateString[1]);
  }

  render() {
    const { companyList, structureList, loading } = this.props;
    return (
      <Card className={styles.projectList} style={{ marginBottom: 24 }} bordered={false} loading={loading}>
        <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col>
            所属公司：
          </Col>
          <Col span={20}>
            <Row type="flex" gutter={16} align="middle">
              <Col span={6}>
                <Select
                  showSearch
                  defaultValue={this.state.companyValue}
                  style={{ width: '100%' }}
                  placeholder="请选择公司"
                  filterOption={(input, option) =>
                    option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={this.companyChanged}>
                  {companyList && companyList.map((company, index) => (
                    <Option value={company.id} key={company.name} index={index}>{company.name}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  showSearch
                  value={this.state.structureValue}
                  style={{ width: '100%' }}
                  placeholder="请选择部门"
                  disabled={this.state.structureDisabled}
                  filterOption={(input, option) =>
                    option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={this.structureChanged}>
                  {structureList && structureList.map((structure, index) => (
                    <Option value={structure.id} key={structure.name} index={index}>{structure.name}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>

              </Col>
            </Row>
          </Col>
        </Row>
        <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col>
            时间范围：
          </Col>
          <Col>
            <Row type="flex" align="middle">
              <Col>
                <Radio.Group defaultValue="today" buttonStyle="solid" onChange={this.onRadioButtonChange}>
                  <Radio.Button value="today">今天</Radio.Button>
                  <Radio.Button value="thisWeek">本周</Radio.Button>
                  <Radio.Button value="thisMonth">本月</Radio.Button>
                  <Radio.Button value="lastWeek">上周</Radio.Button>
                  <Radio.Button value="lastMonth">上月</Radio.Button>
                  <Radio.Button value="thisYear">今年</Radio.Button>
                  <Radio.Button value="customize">自定义</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
          </Col>
          <Col>
            <RangePicker style={{ width: 240 }} defaultValue={[moment(), moment()]} format={dateFormat} disabled={this.state.customizeTimeDisabled} onChange={this.onRangePickerChange} />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default WorkplaceConditions;
