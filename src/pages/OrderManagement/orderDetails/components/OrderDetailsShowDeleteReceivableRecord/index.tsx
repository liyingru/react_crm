import { Modal, Form, Select, DatePicker, Input } from 'antd';
import React from 'react';
import styles from "./index.less";
import { FormComponentProps } from 'antd/es/form';
import { PlansItemList, configDataItem, userlistInfoItem } from '../../data';
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';


/* function handleChange(value) {
    console.log(`selected ${ value }`);
} */


interface CollectionsProps extends FormComponentProps {
    saveFunction: Function;
    onCancel: Function;
    visible: false;
    data: PlansItemList;
    planId: string;
}

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        constructor(props: Readonly<{}>) {
            super(props);
        }


        render() {
            const { visible, onCancel, onCreate } = this.props;

            return (
                <Modal 
                    visible={visible}
                    title="删除"
                    okText="确定"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <div>
                        确定删除？
                    </div>
                </Modal>
            );
        }
    },
);

class CollectionsPage extends React.Component<CollectionsProps> {
    [x: string]: any;

    handleCancel = () => {
        this.props.onCancel()
    };

    handleCreate = () => {
        const { data, planId } = this.props;

        let values = {}
        values['planId'] = planId
        if (data.id && data.id != '') {
            values['id'] = data.id
        }
        this.props.saveFunction(values)
    };


    render() {
        const { visible, data } = this.props;

        return (
            <div>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    data={data}
                />
            </div>
        );
    }
}
export default CollectionsPage;