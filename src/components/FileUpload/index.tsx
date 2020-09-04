import { Upload, message, Button, Icon } from 'antd';
import React, { Component } from 'react';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';

const props = {
  name: 'file',
  action: URL.uploadFile,
  headers: {
    authorization: 'authorization-text',
  },
  withCredentials: true,
  showUploadList: false
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
  onUploadDone?: (url: string, info: any) => void,
  onUploadError?: (info: any) => {},
  disabled:boolean
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
    disabled:false
  };

  constructor(props: FileUploadProps) {
    super(props);

    this.state = {
      text: props.text,
      disabled:props.disabled
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
      console.log(res);
      if (res.code === 200) {
        info.file.status = 'done';
        onUploadDone && onUploadDone(res.data.result.full_path, info);
        this.onChange(info);
      } else {
        onUploadError && onUploadError(info, res.msg);
      }
    });
  };

  onChange(info: any) {

    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件已上传。`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败。`);
    }
  };

  render() {
    const { text, accept ,disabled} = this.props;
    return (
      <Upload {...props} customRequest={this.customRequest} accept={accept} disabled={disabled}>
        <Button>
          <Icon type="upload" /> {text}
        </Button>
      </Upload >
    );
  }
}

export default FileUpload;
