import { Modal } from 'antd';
import React from 'react';

export interface ConfirmDialogProps {
    modalTitle:string;
    modalText:string;
    dialogVisible: boolean;
    dialogLoading: boolean;
    handleConfirmOk: (values: any) => void;
    handleConfirmCancel:()=> void;
    values: any;
  }

interface ConfirmDialogState {
    ModalTitle: string;
    ModalText: string;
  }

class ConfirmDialog extends React.Component<ConfirmDialogProps, ConfirmDialogState> {

    static defaultProps = {
        modalTitle: "",
        modalText:"",
        dialogVisible: false,
        dialogLoading: false,
        handleConfirmOk: () => {},
        handleConfirmCancel: () => {},
        values: {},
    };

    constructor(props: ConfirmDialogProps) {
        super(props);
        this.state = {
            ModalTitle: props.modalTitle,
            ModalText: props.modalText,
        };
    }

    handleOk = (values: any) => {
        const { handleConfirmOk} = this.props;
        handleConfirmOk(values);
    };

    handleCancel = () => {
        const { handleConfirmCancel} = this.props;
        const {ModalTitle, ModalText} = this.state;
        console.log('Clicked cancel button');
        this.setState({
            ModalTitle: ModalTitle,
            ModalText: ModalText,
        });
        handleConfirmCancel();
    };

    render() {
        const { ModalTitle, ModalText } = this.state;
        const { dialogVisible,dialogLoading, values } = this.props;
        return (
            <div>
                <Modal
                    title={ModalTitle}
                    visible={dialogVisible}
                    destroyOnClose={true}
                    onOk={() => this.handleOk(values)}
                    confirmLoading={dialogLoading}
                    onCancel={this.handleCancel}
                    >
                    <p>{ModalText}</p>
                </Modal>
            </div>
        );
    }
}

export default ConfirmDialog;