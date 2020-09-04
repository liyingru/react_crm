import { Upload, message, Button, Icon, Modal } from 'antd';
import React, { Component } from 'react';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';



function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/*删除数组中的某一个对象
_arr:数组
_obj:需删除的对象
*/
function removeAaary(_arr, _obj) {
  var length = _arr.length;
  for (var i = 0; i < length; i++) {
    if (_arr[i] == _obj) {
      _arr.splice(i, 1); //删除下标为i的元素
      return _arr
      break
    }
  }
}

interface ImageUploadState {
  fileList: any[];
  previewVisible: boolean,
  previewImage: '',
}

const props = {
  name: 'file',
  action: URL.uploadFile,
  headers: {
    authorization: 'authorization-text',
  },
  withCredentials: true,
  showUploadList: {
    showPreviewIcon: true,
    showDownloadIcon: false,
    downloadIcon: 'download ',
    showRemoveIcon: true,
  },
  multiple: true,
  listType: 'picture-card'
};

export interface ImageUploadProps {
  fileList: []
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
  disabled: boolean,
  previewImage: '',
  listType?: string,
}

class ImageUpload extends Component<ImageUploadProps, ImageUploadState> {
  static defaultProps = {
    text: '上传',
    name: 'file',
    action: URL.uploadFile,
    accept: 'image/*',
    listType: 'picture-card',
    headers: {
      authorization: 'authorization-text'
    },
    disabled: false,
    previewImage: '',
  };

  constructor(props: ImageUploadProps) {
    super(props);

    this.state = {
      fileList: [],
      previewVisible: false,
      previewImage: '',
    };
  }

  componentWillReceiveProps(nextProps: any) {

    if (nextProps.fileList !== this.props.fileList) {
      this.setState({
        fileList: nextProps.fileList
      })
    }
  }

  handleRemoveFile = (file: any) => {
    if (file.status !== 'uploading') {
      const { fileList } = this.state;
      const newFileList = removeAaary(fileList, file)
      this.setState({ fileList: newFileList });
      const { onUploadDone } = this.props;
      onUploadDone && onUploadDone(fileList);
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
        console.log(res);
        info.file.status = 'done';
        this.onSingleSuccess(info, res.data.result.full_path, res.data.result.path);
      } else {
        onUploadError && onUploadError(info, res.msg);
      }
    });
  };

  onSingleSuccess(info: any, url: string, name: string) {
    console.log("info  = " + JSON.stringify(info))
    let currentFile = {
      uid: info.file.uid,
      name: name,
      status: info.file.status,
      url: url,
      thumbUrl: url,
    };
    if (currentFile.status == 'done') {
      const fileList = [
        ...this.state.fileList,
        currentFile,
      ];
      this.setState({ fileList });
      // message.success(`${info.file.name} 文件已上传。`);

      const { onUploadDone } = this.props;
      onUploadDone && onUploadDone(fileList);
    }
  };


  handleCancel = () => this.setState({
    previewVisible: false
  });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


  render() {
    const { text, accept, disabled, listType, multiple } = this.props;
    const {fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          {...props}
          onRemove = {this.handleRemoveFile}
          fileList={fileList}
          customRequest={this.customRequest}
          disabled = {disabled}
          onPreview={this.handlePreview}
          accept={accept} >
          {fileList.length >= 9 ? null : uploadButton}
        </Upload >
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    );
  }
}

export default ImageUpload;
