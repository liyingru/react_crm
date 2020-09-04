import React, { Component } from 'react';
import styles from './index.less';

export default class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1584521081&di=3672a6078c2f781ab6c958ecdb7b6149&src=http://a3.att.hudong.com/68/61/300000839764127060614318218_950.jpg'
        }
    }
    componentWillMount() {

    }
    closeCtrlChild = (flag)=>{
        const {closeCtrl} = this.props;
        closeCtrl(false);
    }

    render() {
        const { dialogFlag ,src} = this.props;
        return (
            <div className={`${styles.dialog} ${!dialogFlag?styles.acitvePar:''}`} onClick={this.closeCtrlChild}>
                <div className={`${styles.dialog_content} ${!dialogFlag?styles.acitve:''}`}>
                    <img src={src?src:this.state.src}/>
                </div>
            </div>
        )
    }
}