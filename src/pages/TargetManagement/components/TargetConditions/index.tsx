import React, { Component } from 'react';
import { Card, Col, Row, Select, Button } from 'antd';
import { SelectValue } from 'antd/lib/select';
import styles from './style.less';

const { Option } = Select;

interface TargetConditionsState {
  yearValue: string,
  structureValue: string,
  userValue: string,
  structureDisabled: boolean,
  userDisabled: boolean
}

interface TargetConditionsProps {
  yearValue?: string,
  structureValue?: string,
  userValue?: string,
  structureList?: [];
  userList?: [];
  loading?: boolean;
  // companyOnChange?: (value: T, option: React.ReactElement<any> | React.ReactElement<any>[]) => void;
  yearOnChange?: (value: string, option?: React.ReactElement<any> | React.ReactElement<any>[]) => void;
  structureOnChange?: (value: string, option?: React.ReactElement<any> | React.ReactElement<any>[]) => void;
  userOnChange?: (value: string, option?: React.ReactElement<any> | React.ReactElement<any>[]) => void;
  onReset?: () => void;
  onSearch?: (year: string, structure: string, user?: string) => void;
  // onTimeChange: (time: Array<string>) => void;
  // onTimeRangeChange: (start: string, end: string) => void;
}

class TargetConditions extends Component<TargetConditionsProps, TargetConditionsState> {

  state: TargetConditionsState = {
    yearValue: '2020',
    structureValue: '',
    userValue: '',
    structureDisabled: false,
    userDisabled: true
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      yearValue: this.props.yearValue !== nextProps.yearValue ? nextProps.yearValue : this.props.yearValue,
      structureValue: this.props.structureValue !== nextProps.structureValue ? nextProps.structureValue : this.props.structureValue,
      userValue: this.props.userValue !== nextProps.userValue ? nextProps.userValue : this.props.userValue
    });
  }

  yearChanged = (value: string) => {
    this.setState({
      yearValue: value
    });
    const { yearOnChange } = this.props;
    yearOnChange && yearOnChange(value);
  }

  structureChanged = (value: string) => {
    this.setState({
      structureValue: value
    });
    if (value === '') {
      this.setState({
        userValue: '',
        userDisabled: true
      });
    } else {
      this.setState({
        userDisabled: false
      });
    }
    const { structureOnChange } = this.props;
    structureOnChange && structureOnChange(value);
  }

  userChanged = (value: string) => {
    this.setState({
      userValue: value
    });
    const { userOnChange } = this.props;
    userOnChange && userOnChange(value);
  }

  searchWithConditions = () => {
    const { onSearch } = this.props;
    const { yearValue, structureValue, userValue } = this.state;
    onSearch && onSearch(yearValue, structureValue, userValue);
  }

  resetConditions = () => {
    let that = this;
    this.setState({
      yearValue: '2020',
      structureValue: '',
      userValue: '',
      userDisabled: true
    }, () => {
      const { onReset } = that.props;
      onReset && onReset();
    })
  }

  render() {
    const { userOnChange, structureList, userList, loading } = this.props;
    const { yearValue, structureValue, userValue, structureDisabled, userDisabled } = this.state;
    return (
      <Card className={styles.projectList} style={{ marginBottom: 24 }} bordered={false} loading={loading}>
        <Row type="flex" align="middle" gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col>
            年份：
          </Col>
          <Col span={3}>
            <Select
              showSearch
              value={yearValue}
              style={{ width: '100%' }}
              placeholder="请选择年份"
              filterOption={(input, option) =>
                option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={this.yearChanged}>
              <Option value={'2020'} key={'2020'}>{'2020年'}</Option>
              <Option value={'2021'} key={'2021'}>{'2021年'}</Option>
              <Option value={'2022'} key={'2022'}>{'2022年'}</Option>
              <Option value={'2023'} key={'2023'}>{'2023年'}</Option>
              <Option value={'2024'} key={'2024'}>{'2024年'}</Option>
              <Option value={'2025'} key={'2025'}>{'2025年'}</Option>
            </Select>
          </Col>
          <Col>
            部门：
          </Col>
          <Col span={5}>
            <Select
              showSearch
              value={structureValue}
              style={{ width: '100%' }}
              placeholder="请选择部门"
              disabled={structureDisabled}
              filterOption={(input, option) =>
                option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={this.structureChanged}>
              {structureList && structureList.map((structure, index) => (
                <Option value={structure.id} key={structure.name} index={index}>{structure.name}</Option>
              ))}
            </Select>
          </Col>
          {
            userOnChange &&
            <Col>用户：</Col>
          }
          <Col span={userOnChange ? 5 : 0}>
            {
              userOnChange &&
              <Select
                showSearch
                value={userValue}
                style={{ width: '100%' }}
                placeholder="请选择用户"
                disabled={userDisabled}
                filterOption={(input, option) =>
                  option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={this.userChanged}>
                {userList && userList.map((user, index) => (
                  <Option value={user.id} key={user.name} index={index}>{user.name}</Option>
                ))}
              </Select>
            }
          </Col>
          <Col>
            <Button type="primary" onClick={this.searchWithConditions}>搜索</Button>
          </Col>
          <Col>
            <Button onClick={this.resetConditions}>重置</Button>
          </Col>
        </Row>
      </Card >
    );
  }
}

export default TargetConditions;
