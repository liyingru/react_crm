import { FormComponentProps } from "antd/es/form";
import { ColloquialismListItem, CategoryItem } from "../../data";
import { Component } from "react";
import { Form, Input, Select, Switch, Button, Tag } from "antd";
import { TweenOneGroup } from 'rc-tween-one';
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import styles from './style.less'
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

interface NewOrEditFormProps extends FormComponentProps {
    /** 话术分类列表 */
    categoryList: CategoryItem[];
    /** 要编辑的话术 */
    editItem?: Partial<ColloquialismListItem>;
    onSubmitForm: (params: { [key: string]: string }) => void;
}

interface NewOrEditFormState {
    /** 相似话术数组 */
    similarColloquilismList: string[],
    /** 标准答案数组 */
    answerList: string[],
    /** 关键词数组 */
    tags: string[],
    /** 录入关键词的输入框可见 */
    inputVisible: boolean,
    inputValue: string,
}

class NewOrEditForm extends Component<NewOrEditFormProps, NewOrEditFormState> {

    state = {
        similarColloquilismList: [''],
        answerList: [''],
        tags: [],
        inputVisible: false,
        inputValue: '',
    };

    componentDidMount() {
        console.log("componentDidMount");
        const { editItem } = this.props;
        if (editItem) {
            const similarColloquilismList = editItem.equals ?? [''];
            const answerList = editItem.answer ?? [''];
            const tags = editItem.keyword ?? [];
            this.setState({ similarColloquilismList, tags, answerList });
        }
    }

    // static getDerivedStateFromProps(nextProps: NewOrEditFormProps) {
    //     console.log("getDerivedStateFromProps");
    //     // clean state
    //     if(nextProps.editItem) {
    //         return {
    //             similarColloquilismList:nextProps.editItem.equals??[''],
    //             answerList: nextProps.editItem.answer??[''],
    //             tags: nextProps.editItem.keyword??[],
    //         };
    //     } else {
    //         return {
    //             similarColloquilismList: [''],
    //             answerList: [''],
    //             tags: [],
    //         };
    //     }
    //   }

    // componentWillReceiveProps(nextProps: NewOrEditFormProps) {
    //     const {editItem} = nextProps;
    //     console.log("will componentWillReceiveProps" + JSON.stringify(editItem?.answer));
    //     console.log("nextProps.editItem  = this.props.editItem ? " +  editItem == this.props.editItem);
    //     if(editItem && editItem == this.props.editItem) {
    //         const similarColloquilismList = editItem.equals??[''];
    //         const answerList = editItem.answer??[''];
    //         const tags = editItem.keyword??[];
    //         this.setState({similarColloquilismList, tags, answerList});
    //     }
    // }

    handleReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            similarColloquilismList: [''],
            answerList: [''],
            tags: [],
        })
    }

    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFieldsAndScroll((errors: any, values: any) => {
            if (!errors) {
                console.log("origin values = " + JSON.stringify(values));
                // 处理多项“相似话术” 和 “标准答案”
                const equalsValues: string[] = [];
                const answersValues: string[] = [];
                for (let key in values) {
                    if (key.startsWith('equals-')) {
                        const index = parseInt(key.substr(key.indexOf('-') + 1, key.length - key.indexOf('-')));
                        console.log("index = " + index);
                        equalsValues[index] = values[key];
                        delete values[key];
                    } else if (key.startsWith('answer-')) {
                        const index = parseInt(key.substr(key.indexOf('-') + 1, key.length - key.indexOf('-')));
                        console.log("index = " + index);
                        answersValues[index] = values[key];
                        delete values[key];
                    }
                }
                values.equals = equalsValues.length > 0 ? equalsValues : undefined;
                values.answer = answersValues.length > 0 ? answersValues : undefined;
                // 把“状态”布尔值转成 1 | 2
                values.status = values.status ? 1 : 2;
                const { editItem } = this.props;
                if (editItem) {
                    values.id = editItem.id
                }
                const { onSubmitForm } = this.props;
                if (onSubmitForm) onSubmitForm(values);
            }
        })
    }

    /** 添加相似话术 */
    handleAddSimilarColloquialism = () => {
        const { similarColloquilismList } = this.state;
        similarColloquilismList.push('');
        this.setState({ similarColloquilismList });
    }

    /** 删除相似话术 */
    handleDeleteSimilarColloquialism = (index: number) => {
        const { similarColloquilismList } = this.state;
        similarColloquilismList.splice(index, 1);
        this.setState({ similarColloquilismList });
        // 给各个input重新赋值
        const { form } = this.props;
        const newValues = {};
        similarColloquilismList.map((item, index) => {
            newValues['equals-' + index] = item;
        })
        form.setFieldsValue(newValues);
    }

    handleSimilarColloquialismChanged = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const { similarColloquilismList } = this.state;
        similarColloquilismList[index] = event.target.value;
        this.setState({ similarColloquilismList });
    }

    /** 添加标准答案 */
    handleAddAnswer = () => {
        const { answerList } = this.state;
        answerList.push('');
        this.setState({ answerList });
    }

    /** 删除标准答案 */
    handleDeleteAnswer = (index: number) => {
        const { answerList } = this.state;
        answerList.splice(index, 1);
        this.setState({ answerList });
        // 给各个input重新赋值
        const { form } = this.props;
        const newValues = {};
        answerList.map((item, index) => {
            newValues['answer-' + index] = item;
        })
        form.setFieldsValue(newValues);
    }

    handleAnswerChanged = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const { answerList } = this.state;
        answerList[index] = event.target.value;
        this.setState({ answerList });
    }

    input: Input | undefined = undefined;
    showInputAndFocus = () => {
        this.setState({ inputVisible: true }, () => this.input?.focus());
    };

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ inputValue: e.target.value });
    };

    /**
     * 添加关键词
     */
    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        }, () => {
            const { form } = this.props;
            form.setFieldsValue({
                keyword: tags
            });
        });
    };

    /**
     * 删除关键词
     * @param removedTag 
     */
    handleRemoveTag = (removedTag: string) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags }, () => {
            const { form } = this.props;
            form.setFieldsValue({
                keyword: tags && tags.length > 0 ? tags : undefined
            });
        });
    };

    render() {
        const { categoryList, editItem, form: { getFieldDecorator } } = this.props;
        const { similarColloquilismList, answerList } = this.state;
        const { tags, inputVisible, inputValue } = this.state;

        return (
            <div className={styles.tableListForm}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem label='话术分类'>
                        {getFieldDecorator('category_id', {
                            initialValue: editItem?.category_id == 0 ? undefined : editItem?.category_id,
                            rules: [{ required: true, message: '话术分类为必选项' }]
                        })(<Select placeholder={'请选择'} showSearch={true} style={{ width: '88%' }} optionFilterProp="children" >
                            {
                                categoryList?.map(item => (<Option value={item.id}>{item.name}</Option>))
                            }
                        </Select>)}
                    </FormItem>

                    <FormItem label='话术标题'>
                        {getFieldDecorator('title', {
                            initialValue: editItem?.title,
                            rules: [{ required: true, message: '话术标题为必填项' }]
                        })(<Input placeholder="请输入话术标题" maxLength={40} style={{ width: '88%' }} />)}
                    </FormItem>

                    <FormItem label='相似话术'>
                        {getFieldDecorator('equals', {
                            initialValue: editItem?.equals,
                        })(
                            <div>
                                {
                                    similarColloquilismList.map((item, index) => (
                                        <FormItem>
                                            {
                                                getFieldDecorator('equals-' + index, {
                                                    initialValue: editItem && editItem.equals ? editItem.equals[index] : undefined,
                                                })(
                                                    <TextArea
                                                        placeholder="请输入相似话术"
                                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                                        maxLength={40}
                                                        style={{ width: '88%' }}
                                                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => this.handleSimilarColloquialismChanged(event, index)}
                                                    />
                                                )
                                            }
                                            {
                                                (index != 0 && similarColloquilismList.length > 1) && (
                                                    <MinusCircleOutlined
                                                        className={styles.dynamicDeleteButton}
                                                        style={{ margin: '0 8px' }}
                                                        onClick={() => {
                                                            this.handleDeleteSimilarColloquialism(index);
                                                        }}
                                                    />
                                                )
                                            }

                                        </FormItem>
                                    ))
                                }
                                {
                                    similarColloquilismList.length < 10 && (
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                this.handleAddSimilarColloquialism();
                                            }}
                                            style={{ width: '88%' }}
                                        >
                                            <PlusOutlined /> 添加相似话术
                                        </Button>
                                    )
                                }

                            </div>
                        )}
                    </FormItem>
                    <FormItem label={'关键词'}>
                        {getFieldDecorator('keyword', {
                            initialValue: tags.length > 0 ? tags : undefined,
                            rules: [{ required: true, message: '关键词为必填项' }]
                        })(
                            <>
                                <div >
                                    {inputVisible && (
                                        <Input
                                            ref={(input: Input) => {
                                                this.input = input;
                                            }}
                                            type="text"
                                            size="small"
                                            style={{ width: 100 }}
                                            maxLength={10}
                                            value={inputValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm}
                                            onPressEnter={this.handleInputConfirm}
                                        />
                                    )}
                                    {!inputVisible && (
                                        <Tag onClick={this.state.tags?.length < 20 ? this.showInputAndFocus : undefined} className={this.state.tags?.length < 20 ? styles.siteTagPlus : styles.siteTagDisable}>
                                            <PlusOutlined /> 添加关键词
                                        </Tag>
                                    )}
                                    <span style={{ color: 'gray', fontSize: 12, marginLeft: 10 }}>提示：最多支持输入20组</span>
                                </div>

                                <div style={{ width: '88%', marginBottom: tags && tags.length > 0 ? 16 : 0 }}>
                                    <TweenOneGroup
                                        enter={{
                                            scale: 0.8, opacity: 0, type: 'from', duration: 100,
                                            onComplete: e => {
                                                e.target.style = '';
                                            },
                                        }}
                                        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                                        appear={false}
                                    >
                                        {tags.map(tag => (
                                            <span key={tag} style={{ display: 'inline-block' }}>
                                                <Tag
                                                    closable
                                                    onClose={e => {
                                                        e.preventDefault();
                                                        this.handleRemoveTag(tag);
                                                    }}
                                                >
                                                    {tag}
                                                </Tag>
                                            </span>
                                        )
                                        )}
                                    </TweenOneGroup>
                                </div>

                            </>
                        )}
                    </FormItem>

                    <FormItem label='标准答案'>
                        {getFieldDecorator('answer', {
                            initialValue: editItem?.answer,
                            rules: [{ required: true, message: " " }]
                        })(
                            <div>
                                {
                                    answerList.map((item, index) => (
                                        <FormItem>
                                            {
                                                getFieldDecorator('answer-' + index, {
                                                    initialValue: editItem && editItem.answer ? editItem.answer[index] : undefined,
                                                    rules: [{ required: true, message: '标准答案不能为空' }]
                                                })(
                                                    <TextArea
                                                        placeholder="请输入标准答案"
                                                        autoSize={{ minRows: 4, maxRows: 12 }}
                                                        maxLength={200}
                                                        style={{ width: '88%' }}
                                                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => this.handleAnswerChanged(event, index)}
                                                    />
                                                )
                                            }
                                            {
                                                (index != 0 && answerList.length > 1) && (
                                                    <MinusCircleOutlined
                                                        className={styles.dynamicDeleteButton}
                                                        style={{ margin: '0 8px' }}
                                                        onClick={() => {
                                                            this.handleDeleteAnswer(index);
                                                        }}
                                                    />
                                                )
                                            }

                                        </FormItem>
                                    ))
                                }
                                {
                                    answerList.length < 10 && (
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                this.handleAddAnswer();
                                            }}
                                            style={{ width: '88%' }}
                                        >
                                            <PlusOutlined /> 添加标准答案
                                        </Button>
                                    )
                                }

                            </div>
                        )}
                    </FormItem>

                    <FormItem label='话术状态'>
                        {getFieldDecorator('status', {
                            initialValue: editItem && editItem.status ? editItem.status === 1 : true,
                            rules: [{ required: true, message: '话术状态为必选项' }]
                        })(<Switch checkedChildren="使用" unCheckedChildren="关闭" defaultChecked={editItem && editItem.status ? editItem.status === 1 : true} />)}
                    </FormItem>

                    <Button type="ghost" style={{ marginLeft: 50, marginRight: 50 }} onClick={this.handleReset}>重置</Button>
                    <Button type="primary" htmlType="submit">提交</Button>

                </Form>
            </div>
        );
    }
}

export default Form.create<NewOrEditFormProps>()(NewOrEditForm);