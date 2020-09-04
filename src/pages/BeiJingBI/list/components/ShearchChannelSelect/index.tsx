import { Modal, Form, Tabs } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import ShearchChannelSelectCheckGroupPage from '../ShearchChannelSelectCheckGroup';


/* function handleChange(value) {
    console.log(`selected ${ value }`);
} */


interface ShearchChannelSelectProps extends FormComponentProps {
    saveFunction: Function;
    onCancel: Function;
    visible: boolean;
    data: any[];
}

const ShearchChannelSelectCreateForm = Form.create({ name: 'form_in_modal' })(
    class extends React.Component<> {

        constructor(props: any) {
            super(props);
        }

        okTestCreate = () => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const { onCreate } = this.props;
                    onCreate(values)
                }
            });
        }

        tempOnSelectChange = (index: number, subIndex: number, datas: any[]) => {
            const { onSelectChange } = this.props;
            onSelectChange(index, subIndex, datas);
        }

        render() {
            const { visible, onCancel, form, data } = this.props;
            const { TabPane } = Tabs;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title=""
                    okText="确定"
                    onCancel={onCancel}
                    // onOk={onCreate}
                    onOk={this.okTestCreate}
                    centered
                >
                    <div >
                        <Form layout='horizontal' onSubmit={this.okTestCreate}>
                            <div >
                                <Tabs style={{ marginTop: '20px' }} defaultActiveKey="0" >

                                    {data && data?.map((item, index) => {
                                        return (
                                            <TabPane tab={item.title} key={index.toString()} forceRender={true}>
                                                <Form.Item  >
                                                    {getFieldDecorator((index.toString()), {
                                                        rules: [{ required: false, message: '请选择' }]
                                                    })(
                                                        <ShearchChannelSelectCheckGroupPage
                                                            data={item}
                                                            showIndex={index}
                                                            onSelectChange={this.tempOnSelectChange}
                                                        />
                                                    )}
                                                </Form.Item>
                                            </TabPane>
                                        )
                                    })}
                                </Tabs>
                            </div>
                        </Form>
                    </div>

                </Modal>
            );
        }
    },
);


class ShearchChannelSelectPropsPage extends React.Component<ShearchChannelSelectProps> {

    constructor(props: ShearchChannelSelectProps) {
        super(props);
        this.state = {
            currentData: JSON.parse(JSON.stringify(props.data)),
            changeData: JSON.parse(JSON.stringify(props.data)),
        }

    }

    componentWillReceiveProps(nextProps: any) {
        const { data } = nextProps;
        if (data.length !== this?.state.currentData?.length) {
            this.setState({
                currentData: JSON.parse(JSON.stringify(data)),
                changeData: JSON.parse(JSON.stringify(data)),
            })
        }
    }

    handleCancel = () => {
        this.setState({
            currentData: [],
            changeData: []
        })
        this.props.onCancel()
    };

    handleCreate = (values: any) => {
        const { saveFunction } = this.props;
        var paramValues = [];
        // 这个地方需要处理搜索数据

        for (let index = 0; index < this.state.currentData.length; index++) {
            const itemM = this.state.currentData[index];
            if (itemM?.selectKeys?.length > 0) {
                paramValues.push([...itemM?.selectKeys])
            }
        };
        var results = '';
        if (paramValues.length > 0) {
            results = paramValues.join(',')
        }

        saveFunction(results, this.state?.changeData)
    };

    optionOnSelectChange = (index: number, subIndex: number, datas: any[]) => {

        const newData = JSON.parse(JSON.stringify(this.state.changeData));
        const tempData = newData[index];
        tempData.selectKeys = datas?.selectKeys;
        newData[index] = tempData;
        this.setState({
            changeData: newData
        })
    }

    render() {
        const { visible } = this.props;
        return (
            <div>
                <ShearchChannelSelectCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    data={this.state.currentData}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    onSelectChange={this.optionOnSelectChange}
                />
            </div>
        );
    }
}
export default ShearchChannelSelectPropsPage;