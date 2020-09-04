import React, { Component } from "react";
import ReactZmage from 'react-zmage';
import { Form } from "antd";
import { FormComponentProps } from "antd/es/form";
import styles from "./index.less"
import { ContractData } from "../../data";

export interface ContractInfoPros extends FormComponentProps {
    contractInfo: Partial<ContractData>;
}

export interface ContractInfoState {
}

class ContractInfo extends Component<ContractInfoPros, ContractInfoState>{

    state: ContractInfoState = {
    }

    render() {
        const {contractInfo} = this.props;
        const defaultConfig = {
            backdrop: 'rgba(95, 95, 95, .48)',
            alt: '示例图片',
        };
        return (
            <div className={styles.container}>
                <ul className={styles.ullist}>
                    {
                        contractInfo && contractInfo.map(item=>{
                            if(item.key == '合同照片'){
                                return <li>
                                    <span>{item.key}：</span>
                                    <div className={styles.pic}>
                                        {item.value && item.value.map(pic=><ReactZmage src={pic} {...defaultConfig}/>)}
                                    </div>
                                    </li>
                            }else if(item.key == '产品信息'){
                                return <li>
                                    <span>{item.key}：</span>
                                    <div>
                                        {item.value && item.value.map(ite=>{
                                        <div><span>{ite.name}</span><span>{ite.merchant_name}</span></div>
                                        })}
                                    </div>
                                </li>
                            }else if(item.key == '优惠信息'){
                                return <li>
                                    <span>{item.key}：</span>
                                    <div>
                                        {item.value && item.value.map(ite=><div><span>{ite.content}</span>-<span>{ite.type_txt}</span></div>)}
                                    </div>
                                </li>
                            }
                            return <li><span>{item.key}：</span><span>{item.value}</span></li>
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default Form.create<ContractInfoPros>()(ContractInfo)