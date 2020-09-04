import { Upload, message, Button, Icon, Card, Modal } from 'antd';
import React, { Component } from 'react';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from "./index.less";
import Dialog from '@/components/Dialog';

const props = {
  name: 'file',
  action: URL.uploadFile,
  headers: {
    authorization: 'authorization-text',
  },
  className: 'upload-list-inline',
  // listType: 'picture',
  showUploadList: false,
};

export interface FileUploadProps {
  text: string;
  name: string;
  action: string;
  accept: string;
  headers: {
    authorization: string;
  },
  customRequest?: () => {},
  requestFinsh?: (fileArray: any) => void,
  disabled: boolean,
  superFileList: []
}

class FileUpload extends Component<FileUploadProps> {
  static defaultProps = {
    text: '数据导入',
    name: 'file',
    action: URL.uploadFile,
    accept: 'image/*',
    headers: {
      authorization: 'authorization-text'
    },
    disabled: false,
  };

  constructor(props: FileUploadProps) {
    super(props);

    this.state = {
      text: props.text,
      disabled: props.disabled,
      isShowImage: false,
      showImageUrl: '',
    };
  }
  customRequest = (info: any) => {
    const { onUploadDone, onUploadError, action } = this.props;
    const param = new FormData();
    param.append("file", info.file);
    const config = {
      headers: { "Content-Type": "multipart/form-data" }
    };
    Axios.post(action, param, config).then(res => {
      const { superFileList, requestFinsh } = this.props;
      var tempFileList = superFileList
      if (res.code === 200) {

        tempFileList.map((item) => {
          if (item?.uid == info.file?.uid) {
            item.status = 'done';
            item.url = res.data.result.full_path;
            item.thumbUrl = res.data.result.full_path;
            console.log("thumbUrl", item)
          }
        })

      } else {

        var errorIndex = -1
        tempFileList.map((item, index) => {
          if (item?.uid == info.file?.uid) {
            errorIndex = index
            item.status = 'error'
          }
        })
        if (errorIndex >= 0 && errorIndex < tempFileList.length) {
          tempFileList.splice(errorIndex, 1)
        }
      }
      requestFinsh(tempFileList)
    });
  };

  changeData = (info: any) => {
    console.log('info', info)
    const { requestFinsh, superFileList } = this.props;
    var tempFileList = superFileList;
    tempFileList = [...info.fileList]
    requestFinsh(tempFileList)
  }

  onDelete = (index: number) => {
    console.log('index', index)
    const { superFileList, requestFinsh } = this.props;
    if (index >= 0 && index < superFileList.length) {
      var tempFileList = superFileList;
      tempFileList.splice(index, 1)
      console.log('tempFileList', tempFileList);
      if (tempFileList?.length > 0) {
        requestFinsh(tempFileList);
      } else {
        requestFinsh([]);
      }
    };
  }

  showImageClick = (url) => {
    this.setState({
      isShowImage: true,
      showImageUrl: url
    })

  }
  hiddenImageClick = () => {
    this.setState({
      isShowImage: false,
      showImageUrl: ''
    })
  }

  render() {
    const { text, accept, disabled, superFileList } = this.props;
    return (
      <div >
        <Upload {...props} fileList={superFileList} onChange={this.changeData} customRequest={this.customRequest} accept={accept}>
          {superFileList.length>=9 ? null :<Button disabled={disabled}>
            {text}
          </Button>}
        </Upload >
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }} >
            {superFileList && superFileList?.map((item, index) => {
              return (
                <div>
                  <div className={styles.itemStyle}>
                    <img className={styles.itemContentImgStyle} src={item?.thumbUrl} onClick={() => {
                      this.showImageClick(item?.thumbUrl)
                    }} />
                    <p className={styles.itemContentTitleStyle}>{item?.name}</p>
                    <span style={{ paddingTop: 15 }}>
                      <a>
                        <span className={styles.itemContentDeleteStyle} >
                          <DeleteOutlined onClick={() => {
                            this.onDelete(index)
                          }} />
                        </span>
                      </a>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <Dialog dialogFlag={!this.state?.isShowImage} closeCtrl={this.hiddenImageClick} src={this.state?.showImageUrl}/>
      </div>
    );
  }
}

export default FileUpload;
