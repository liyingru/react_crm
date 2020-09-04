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
  showItemDetails: Function,
  orderInfo: any,
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

    const { refunRecordModels, showAddModal, editModal, deleteModal, showItemDetails } = this.props;
    return (

      <div style={{ maxHeight: 700, overflowY: 'auto' }}>

        {refunRecordModels && refunRecordModels.map(model => (
            <div >
              <div style={{ display: 'flex', padding: 10, alignItems: 'center' }}>
                <div>{model.title}</div>
                  <Button style={{ marginLeft: '10px' }} type="primary" onClick={() => this.onClickPlan(model.contract_id)} >调整回款计划</Button>
                  <Button style={{ marginLeft: '10px' }} type="primary" onClick={() => editModal(model, undefined, undefined)} >新增回款记录</Button>
              </div>
              <div>
                <div >
                  <List
                    itemLayout="horizontal"
                    dataSource={model && model?.plans}
                    renderItem={plansItem => (
                      <List.Item>
                        <Card style={{ width: '100%' }}>
                          <OneRecivabRecord
                            recordItemModel={plansItem}
                            contacsInfo={model}
                            showAddModal={showAddModal}
                            editModal={editModal}
                            deleteModal={deleteModal}
                            showItemDetails={showItemDetails}
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

}


export default receivablesRecord;
