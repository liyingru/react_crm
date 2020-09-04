import { Select } from "antd";
import React from "react";
import { SelectProps } from "antd/lib/select";

interface PageLoadingSelectProps extends SelectProps {
    onKeywordChanged: (keyword: string|undefined) => void;
    doSearch: (keyword:string)=>void;
    noMoreData: boolean;
    onClearInputKeys?: ()=>void;
}

export interface PaginationFake {
    page: number;
    pageSize: number;
    total: number;
}

class PageLoadingSelect extends React.Component<PageLoadingSelectProps> {
    timeOut: NodeJS.Timeout | undefined = undefined;
    currentKeyWord: string | undefined = undefined;
    page: number = 1;
    pageSize: number = 10;

    /**
     * 监听键盘变化，但是因为频率太快，每一个字符都会调用进方法里。
     * 所以接收到键盘变化后，开始计时等1秒后再将结果抛出。
     */
    startSearchByKeys = (inputKey: string) => {
        if (this.timeOut) {
          clearTimeout(this.timeOut);
          this.timeOut = undefined;
        }
        this.currentKeyWord = inputKey;
    
        this.timeOut = setTimeout(() => {
            const {
                onKeywordChanged, doSearch, onClearInputKeys
            } = this.props;
            
            if(inputKey) {
                onKeywordChanged(inputKey);
            } else if(onClearInputKeys) {
                onClearInputKeys();
            }
            if (inputKey && inputKey == this.currentKeyWord) {
                doSearch(inputKey);
            }
        }, 1000);
    
    };

    handleOnClearInputKeys = (value: string) => {
        if(this.props.onClearInputKeys) {
            this.props.onClearInputKeys()
        }
    }

    /**
     * 处理分页加载选项
     */
    handleSearchOptionsScroll = (event: React.UIEvent<HTMLDivElement>) => {
        // console.log("scrollTop     === " + event.target.scrollTop);
        // console.log("clientHeight         === " + event.target.clientHeight);
        // console.log("scrollHeight               === " + event.target.scrollHeight);
        // event.stopPropagation;
        // event.preventDefault;
        if (event.target.scrollTop + event.target.clientHeight  == event.target.scrollHeight) {
            // this.loadMore();
            const {
                doSearch, noMoreData,
            } = this.props;
            // console.log("加载下一页 "  + "  noMoreData = " + noMoreData);
            if (this.currentKeyWord && !noMoreData && !this.props.loading) {
                doSearch(this.currentKeyWord);
            }
        }
    }


    render() {
        return (
            <Select
                {...this.props}
                showSearch={true}
                filterOption={false}
                showArrow={false}
                defaultActiveFirstOption={false}
                allowClear={true}
                onSearch={this.startSearchByKeys}
                // onFocus={()=>this.startSearchByKeys("")}
                onPopupScroll={this.handleSearchOptionsScroll}
                onBlur={this.handleOnClearInputKeys}
                >
                {
                    this.props.children
                }
            </Select>
        )
    }
}

export default PageLoadingSelect;

