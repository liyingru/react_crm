import React, { Component } from 'react';
import styles from "./index.less";
import { List, Card, Button } from "antd";
import { ReceivablesRecord } from '../../data';
import OneRecivabRecord from "../OrderDetailsReceivableRecord"
import { FormComponentProps } from 'antd/es/form';


interface ReceivablesRecordProps extends FormComponentProps {
  refunRecordModels: ReceivablesRecord[],
  showAddModal: Function,
  editModal: Function,
  deleteModal: Function,
  editPlanModel: Function,
  showItemDetails: (model: any) => void,
}

class receivablesRecord extends Component<ReceivablesRecordProps> {

  onClickPlan = (e: any) => {
    console.log(e)
    const { refunRecordModels } = this.props;
    if (refunRecordModels && refunRecordModels.length > 0) {
      if (e) {

        var model = undefined
        refunRecordModels.map((item) => {
          if (e == item.contract_id) {
            model = item
          }
        })
        if (model) {
          this.props.editPlanModel(model)
        }
      } else {
        var item = refunRecordModels[0];
        this.props.editPlanModel(item)
      }
    }
  }

  render() {

    const { refunRecordModels, showAddModal, editModal, deleteModal, showItemDetails, orderInfo } = this.props;
    return (

      <div style={{ maxHeight: 700, overflowY: 'auto' }}>

        {refunRecordModels && refunRecordModels.map((model) => {
          return (
            <div >
              <div style={{ display: 'flex', padding: 10, alignItems: 'center' }}>
                <div style={{ fontWeight: "bolder", fontSize: 15 }}>{model.title}</div>
                {orderInfo?.show_money_button ? <>
                  {orderInfo?.phase !== 320 ? <>
                    <Button style={{ marginLeft: '10px' }} size='small' onClick={() => this.onClickPlan(model.contract_id)} >配置回款计划</Button>
                    <Button style={{ marginLeft: '10px' }} size='small' onClick={() => editModal(model, undefined, undefined)} >新增回款记录</Button>
                  </> : ''}
                </> : ''}
              </div>
              <div>
                <Card>
                  <div style={{ overflowX: 'auto', justifyContent: 'left', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                    <span className={styles.styleSpane} >计划回款总金额:{model && model?.total_plan_receivables_money}</span>
                    <span className={styles.styleSpane} >计划内已回款总金额:{model && model?.total_already_receivables_money}</span>
                    <span className={styles.styleSpane} >计划内未回款总金额:{model && model?.total_no_receivables_money}</span>
                    <span className={styles.styleSpane} >（逾期未回款金额:{model && model?.total_overdue_no_receivables_money})</span>
                  </div>
                </Card>
              </div>
              <div>
                <div >
                  <List
                    itemLayout="horizontal"
                    dataSource={model && model?.plans}
                    renderItem={(plansItem, index) => (
                      <List.Item>
                        <Card style={{ width: '100%' }}>
                          <OneRecivabRecord
                            editDisable={index == 0}
                            recordItemModel={plansItem}
                            contacsInfo={model}
                            showAddModal={showAddModal}
                            editModal={editModal}
                            deleteModal={deleteModal}
                            showItemDetails={showItemDetails}
                            orderInfo={orderInfo}
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

}


export default receivablesRecord;
