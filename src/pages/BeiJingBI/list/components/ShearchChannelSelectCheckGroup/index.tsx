import { Tree, TreeSelect } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
const { SHOW_PARENT } = TreeSelect;


interface ShearchChannelSelectCheckGroupPageProps extends FormComponentProps {
    data: any;
    showIndex: number;
    subShowIndex: number;
    onSelectChange: Function;
    value: any[];
    onChange?: (value: any) => void;
}

class ShearchChannelSelectCheckGroupPage extends React.Component<ShearchChannelSelectCheckGroupPageProps> {

    synchronousSuperFunction = (checkedKeys: any[]) => {
        const { data, showIndex, subShowIndex, onSelectChange } = this.props;
        var newData = data;
        newData.selectKeys = [...checkedKeys];
        onSelectChange(showIndex, subShowIndex, newData)
    }


    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);



        this.props?.onChange([...checkedKeys]);
        this.synchronousSuperFunction(checkedKeys);
    };

    onChange = value => {

        this.props?.onChange([...value]);
        this.synchronousSuperFunction(value);
    };


    render() {
        const { data } = this.props;
        const tProps = {
            treeData: data?.optionGroups,
            onChange: this.onChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            defaultValue: data?.selectKeys,
            listHeight: '100px',
            dropdownStyle: { maxHeight: '300px', overflow: 'auto' },
            placeholder: "请选择(多选)",
            treeNodeLabelProp: "title",
            treeDefaultExpandAll: true,
        };
        return (
            <div style={{ height: '200xp' }} >
                <TreeSelect 
                    filterTreeNode={(inputValue: string, treeNode: any) => treeNode.props.title.indexOf(inputValue) >= 0}
                    {...tProps} />
            </div>
        );
    }
}
export default ShearchChannelSelectCheckGroupPage;