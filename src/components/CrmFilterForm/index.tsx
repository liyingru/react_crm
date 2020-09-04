import { Form, Row, Col, Button } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

export interface CrmFilterFormProps {
  expandable?: boolean;
  retainFilterNumber?: number;
  formItemList: JSX.Element[];
  onFilterSearch: () => void;
  onFilterReset: () => void;

  /** 顶部的区域 */
  renderFilterTop?: () => React.ReactNode;
}

export interface CrmFilterFormState {
  /** 展开true或收起false状态 */
  isExpanded: boolean;
}

class CrmFilterForm extends Component<CrmFilterFormProps, CrmFilterFormState> {

  constructor(props: CrmFilterFormProps) {
    super(props);
    this.state = {
      isExpanded: false,
    }
  }

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { onFilterSearch } = this.props;
    if (onFilterSearch) {
      onFilterSearch();
    }
  }

  renderFilterForm = () => {
    const { formItemList, onFilterReset, expandable, retainFilterNumber } = this.props;
    const { isExpanded } = this.state;
    let formList = [];
    if (expandable && !isExpanded) {
      if (retainFilterNumber) {
        if (retainFilterNumber <= 0) {
          return <></>
        } else {
          formList = [
            ...formItemList.slice(0, retainFilterNumber)
          ]

        }
      }
    } else {
      formList = [
        ...formItemList
      ];
    }

    formList.push(
      <div style={{ display: 'flex', }}>
        {/* {
          expandable && <Button style={{ flex: 1, marginLeft: 20,  textAlign: "center",borderColor: '#1791FF', color: '#1791FF'}} onClick={this.switchFilterForm} >{isExpanded?'收起':"展开"}{isExpanded?<UpOutlined/>:<DownOutlined/>}</Button>
        } */}
        <Button style={{ flex: 1, marginLeft: 10, borderColor: '#1791FF', color: '#1791FF' }} onClick={onFilterReset}>重置</Button>
        <Button style={{ flex: 1, marginLeft: 10 }} type="primary" htmlType="submit">筛选</Button>
      </div>
    )

    // let formList = formItemList;
    let last = formList.length % 3;
    let x = Math.floor(formList.length / 3) + ((formList.length % 3 == 0) ? 0 : 1);
    let rowsView = [];
    for (let i = 0; i < x; i++) {
      let row: any;
      if (i == (x - 1) && formList.length % 3 != 0) {
        let cols = [];
        for (let j = 0; j < last; j++) {
          let offset = (j == last - 1) ? ((2 - j) * 8) : 0
          cols.push(<Col span={8} key={i + "" + j} offset={offset}>{formList[i * 3 + j]}</Col>);
        }
        row = <Row gutter={{ md: 6, lg: 24, xl: 48 }} key={i}>{cols}</Row>
      } else {
        row = <Row gutter={{ md: 6, lg: 24, xl: 48 }} key={i}>
          <Col span={8} key={i + "1"} >{formList[i * 3 + 0]}</Col>
          <Col span={8} key={i + "2"}>{formList[i * 3 + 1]}</Col>
          <Col span={8} key={i + "3"}>{formList[i * 3 + 2]}</Col>
        </Row>
      }
      rowsView.push(row)
    }
    return rowsView
  }

  switchFilterForm = () => {
    const { isExpanded } = this.state;
    this.setState({
      isExpanded: !isExpanded
    })
  }

  render() {
    const { expandable } = this.props;
    const { isExpanded } = this.state;
    return (
      <div className={styles.tableListForm}>
        {
          expandable && (
            <div style={{ display: 'flex', marginBottom: 20 }}>
              <span style={{ flex: 1 }}></span>
              {
                this.props.renderFilterTop && this.props.renderFilterTop()
              }
              <Button style={{ marginLeft: 10, textAlign: "center", borderColor: '#1791FF', color: '#1791FF' }} onClick={this.switchFilterForm} >{isExpanded ? '收起' : "展开"}{isExpanded ? <UpOutlined /> : <DownOutlined />}</Button>
            </div>
          )
        }
        <Form onSubmit={this.handleSearch} layout="inline">
          {
            this.renderFilterForm()
          }
        </Form>
      </div>
    )
  }
}

export default CrmFilterForm;
