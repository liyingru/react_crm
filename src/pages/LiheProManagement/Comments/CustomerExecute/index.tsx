import React, { Component, Dispatch } from 'react';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import { Divider, Card, PageHeader, Row, Col, Affix, Tabs, Select } from 'antd';
import { Action } from "redux";
import { connect } from "dva";
import { StateType } from '../../LiheProDetail/model';

interface CustomerConsultProps extends FormComponentProps {
    dispatch: Dispatch<any>;
    liheDetail: StateType;
}
@connect(
  ({
    LiheProDetail,
    loading,
  }: {
    LiheProDetail: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    LiheProDetail,
    loading: loading.models.LiheProDetail,
  }),
)

class CustomerExecute extends Component<CustomerConsultProps> {
    constructor(props) {
        super(props);
        this.state = {
            detailsId: 1,
            menuTab: 0
        }
    }
    componentDidMount() {

    }
  

  

    render() {
      
        return (
            <Card style={{ width: '100%' }}>
              <div>执行阶段</div>               
            </Card>

        );
    }
}
export default CustomerExecute;