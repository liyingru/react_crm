import { Upload, message, Button, Icon } from 'antd';
import React, { Component } from 'react';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';

interface MultiFilesUploadState {
  fileList: any[];
}

const props = {
  name: 'file',
  action: URL.uploadFile,
  headers: {
    authorization: 'authorization-text',
  },
  withCredentials: true,
  showUploadList: {
    showPreviewIcon: false,
    showDownloadIcon: false,
    downloadIcon: 'download ',
    showRemoveIcon: true,
  },
};

export interface MultiFilesUploadProps {
  text: string;
  name: string;
  action: string;
  accept: string;
  headers: {
    authorization: string;
  },
  customRequest?: () => {},
  onUploadDone?: (full_paths: string[]) => void,
  onUploadError?: (info: any) => {},
  disabled:boolean
}

class MultiFilesUpload extends Component<MultiFilesUploadProps, MultiFilesUploadState> {
  static defaultProps = {
    text: '数据导入',
    name: 'file',
    action: URL.uploadFile,
    accept: 'image/*',
    headers: {
      authorization: 'authorization-text'
    },
    disabled:false
  };

  constructor(props: MultiFilesUploadProps) {
    super(props);

    this.state = {
      fileList: [],
    };
  }

  handleRemoveFile = (file) => {
    if (file.status !== 'uploading') {
      const {fileList} = this.state;
      const newFileList = fileList.filter(item=>item.url!=file.url);
      this.setState({ fileList: newFileList });

      const {onUploadDone} = this.props;
      // let urlList = new Array();
      const urlList = newFileList.flatMap(item=>item.url);
      // newFileList.map(item => urlList.push(item.url)) 
      onUploadDone && onUploadDone(urlList);
    }
  }

  customRequest = (info: any) => {
    const { onUploadError, action } = this.props;
    const param = new FormData();
    param.append("file", info.file);
    const config = {
      headers: { "Content-Type": "multipart/form-data" }
    };

    Axios.post(action, param, config).then(res => {
      console.log(res);
      if (res.code === 200) {
        info.file.status = 'done';
        this.onSingleSuccess(info, res.data.result.full_path, res.data.result.path);
      } else {
        onUploadError && onUploadError(info, res.msg);
      }
    });
  };

  onSingleSuccess(info: any, url: string, name: string) {
    console.log("info  = " + JSON.stringify(info))
    let currentFile ={
      uid: info.file.uid,
      name: name,
      status: info.file.status,
      url: url,
    };
    const fileList = [
      ...this.state.fileList,
      currentFile,
    ];
    this.setState({ fileList });
    message.success(`${info.file.name} 文件已上传。`);

    const {onUploadDone} = this.props;
    // let urlList = new Array();
    // fileList.map(item => urlList.push(item.url)) 
    const urlList = fileList.flatMap(item=>item.url);
    onUploadDone && onUploadDone(urlList);
    
    // if (info.file.status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    // if (info.file.status === 'done') {
    // } else if (info.file.status === 'error') {
    //   message.error(`${info.file.name} 文件上传失败。`);
    // }
  };

  render() {
    const { text, accept } = this.props;
    return (
      <Upload 
      {...props} 
      onRemove={this.handleRemoveFile}
      fileList={this.state.fileList}
      customRequest={this.customRequest} 
      accept={accept} > 
        {
          this.state.fileList.length >= 9 ? null :
          <Button>
            <Icon type="upload" /> {text}
          </Button>
        }
        
      </Upload >
    );
  }
}

export default MultiFilesUpload;
