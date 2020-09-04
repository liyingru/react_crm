import React from 'react';
import { Tree } from 'antd';
import { ListStructureItem, ListStructureSubItem } from '../data';

const { TreeNode } = Tree;

export interface QueryTreeProps {
    data: ListStructureItem[];
    handleChangeStructure: (company_id?: string, structure_id?: string) => void;
}

interface QueryTreeState {

}

class QueryTree extends React.Component<QueryTreeProps, QueryTreeState> {

    static defaultProps = {
        handleChangeStructure: () => {},
        data:[]
    }

    constructor(props: QueryTreeProps) {
        super(props);
        this.state = {
        };
    }

    onSelect = (selectedKeys: any, info: any) => {
        const {handleChangeStructure} = this.props;
        if(info.selected) {
            let ids = selectedKeys[0].split('_');
            if(ids[0] == 'c') {
                handleChangeStructure(ids[1]);
            } else {
                handleChangeStructure(ids[0], ids[1]?ids[1]:undefined);
            }
        } else {
            // 取消选中
        }
    };

    createTreeNode = function (item:ListStructureSubItem) {
    const self = this;
    return (
            <TreeNode title={item.name} key={item.company_id+'_'+item.id}>
                {item.childlist.length>0?item.childlist.map(val=>self.createTreeNode(val)):null}
            </TreeNode>
        )
    }
    
    render() {
        const {data} = this.props;
        console.log("data = =  " + JSON.stringify(data));
        if(!data || !data[0]) {
            return null;
        }
        return (
            <Tree
                defaultExpandedKeys={data.length==1?['c_'+data[0].company_id]:['0']}
                defaultSelectedKeys={data.length==1?['c_'+data[0].company_id]:['0']}
                onSelect={this.onSelect}
                >
                {
                    data.length == 1 ? (
                        <TreeNode title={data[0].company_name} key={'c_' + data[0].company_id}>
                            {data[0].structureList.map(subItem => this.createTreeNode(subItem))}
                        </TreeNode>
                    ) : (
                        <TreeNode title="全部" key="0">
                            {data.map(item => (
                                <TreeNode title={item.company_name} key={'c_' + item.company_id}>
                                    {item.structureList.map(subItem => this.createTreeNode(subItem))}
                                </TreeNode>
                            ))}
                        </TreeNode>
                    )
                }
                
            </Tree>
        );
    }
}

export default QueryTree;