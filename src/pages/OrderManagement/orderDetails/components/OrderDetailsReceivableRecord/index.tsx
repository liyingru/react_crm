import React, { Component } from 'react';
import styles from "./index.less";
import { Table, Divider } from "antd";
import { PlansItem, PlansItemList } from '../../data';
import { FormComponentProps } from 'antd/es/form';
import PicBrowser from '@/components/PicBrowser';




interface recordItemProps extends FormComponentProps {
  contacsInfo: any,
  recordItemModel: PlansItem,
  showAddModal: Function,
  editModal: Function,
  deleteModal: Function,
  showItemDetails: Function,
  orderInfo: any,

}

class recordItem extends Component<recordItemProps>{

  addNewFunction = () => {
    const { recordItemModel } = this.props;
    this.props.showAddModal(recordItemModel && recordItemModel.plan_id)
  }

  editFunction = (value: any) => {
    const { recordItemModel, contacsInfo } = this.props;

    recordItemModel && recordItemModel.list.map((item) => {
      if (item.id == value) {
        this.props.editModal(contacsInfo, recordItemModel, item)
      }
    })
  }

  showCheckDetail = (model: PlansItemList) => {
    const { showItemDetails } = this.props;
    showItemDetails(model)
  }

  deleteFunction = (value: any) => {

    const { recordItemModel } = this.props;
    const planId = recordItemModel && recordItemModel.plan_id

    let plansItem: PlansItemList = {}
    recordItemModel && recordItemModel.list.map((item) => {
      if (item.id == value) {
        plansItem = item
      }
    })


    if (plansItem.id) {
      this.props.deleteModal(planId, plansItem)
    }
  }

  render() {
    const { recordItemModel } = this.props;
    console.log(recordItemModel)
    const columns = [
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        width: 100,
        fixed: 'left',
        render: (id: any) => {
          // 0:待提交;1:待审核 2:审核驳回 3:审核通过
          const { recordItemModel } = this.props;
          var itemModel = undefined;

          recordItemModel && recordItemModel?.list?.map(item => {
            if (item.id == id) {
              itemModel = item
            }
          })

          if (itemModel) {
            if (itemModel?.check_status == 0) {
              // 待提交
              return (
                <div>
                    <a onClick={() => this.editFunction(id)}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.deleteFunction(id)}>删除</a>

                </div>
              );
            }

            if (itemModel?.check_status === 1 || itemModel.check_status === 3) {
              // 待审批
              return (
                <div>
                  <a onClick={() => this.showCheckDetail(itemModel)}>查看</a>
                </div>
              );
            }

            if (itemModel.check_status == 2) {
              // 审批驳回
              return (
                <div>
                  <a onClick={() => this.showCheckDetail(itemModel)}>查看</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.editFunction(id)}>编辑</a>
                </div>
              );
            }

            return (
              <div />
            )
          }

          return (
            <div />
          )

        },
      },

      {
        title: "回款日期",
        dataIndex: "receivables_date",
        key: "receivables_date"
      },
      {
        title: "回款金额",
        dataIndex: "money_txt",
        key: "money_txt"
      },
      {
        title: "付款方式",
        dataIndex: "payment_mode_txt",
        key: "payment_mode_txt"
      },
      {
        title: "回款类型",
        key: "receivables_type_txt",
        dataIndex: "receivables_type_txt",
      },
      {
        title: "回款销售",
        key: "payee_txt",
        dataIndex: "payee_txt",
      },
      {
        title: "收款票据",
        key: "receipt_note",
        dataIndex: "receipt_note",
      },
      {
        title: "支付凭证",
        key: "payment_voucher",
        dataIndex: "payment_voucher",
        render: (payment_voucher: any) => {
          return (
            <span>
              {payment_voucher && payment_voucher.map((item) => {
                return (
                  <div className={styles.pingzheng} >
                    <PicBrowser wt={25} ht={25} imgSrc={item} />
                  </div>
                )
              })}
            </span>
          )
        },
      },
      {
        title: "状态",
        key: "check_status_txt",
        dataIndex: "id",
        render: (id: string) => {

          const { recordItemModel } = this.props;
          var itemModel = undefined
          recordItemModel && recordItemModel?.list?.map(item => {
            if (item.id == id) {
              itemModel = item
            }
          })
          if (itemModel) {
            // 0:待提交;1:待审核 2:审核驳回 3:审核通过
            if (itemModel?.check_status == 2) {
              return (
                <div style={{ color: 'red' }} >{itemModel?.check_status_txt}</div>
              );
            } else {
              return (
                <div >{itemModel?.check_status_txt}</div>
              );
            }
          }


        },
      },
      {
        title: "备注",
        key: "remark",
        dataIndex: "remark",
      }
    ];

    return (

      <div className={styles.container}>

        {/* <div className={styles.headerViewStyle}>
          <div className={styles.titleFontStyle} style={{ height: '50px' }}>
            {recordItemModel && recordItemModel.title}
          </div> white-space
        </div> */}
        <div style={{ display: 'flex', marginBottom: 5, overflowX: 'auto', justifyContent: 'left', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
          <span className={styles.styleSpane} style={{ fontWeight: 'bolder' }}>
            {recordItemModel && recordItemModel.title}
          </span>
          <span className={styles.styleSpane}>
            计划回款日期：{recordItemModel && recordItemModel.plan_receivables_date}
          </span>

          <span className={styles.styleSpane}>
            计划回款金额：{recordItemModel && recordItemModel.plan_receivables_money_txt}
          </span>
          <span className={styles.styleSpane}>
            已回款金额：{recordItemModel && recordItemModel.already_receivables_money_txt}
          </span>
          <span className={styles.styleSpane}>
            未回款金额：{recordItemModel && recordItemModel.no_receivables_money_txt}
          </span>
          <span className={styles.styleSpane} style={{ color: 'red' }}>
            逾期未回款金额：{recordItemModel && recordItemModel.overdue_no_receivables_money_txt}
          </span>
          <span className={styles.styleSpane}>
            回款状态：{recordItemModel && recordItemModel.status_txt}
          </span>
        </div>
        <div style={{ padding: 0 }}>
          <Table scroll={{ x: 'max-content' }} columns={columns} dataSource={recordItemModel && recordItemModel.list} pagination={false} />
        </div>
      </div>
    );
  }
}

export default recordItem;
