import React, { Component } from 'react';
import RcViewer from '@hanyk/rc-viewer';
export default class ImgViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            res: [],
            imgSrc: 'http://public.baihe.com/hunli/2018/03/19/5aaf87e119684.jpg'
        }
    }
    componentWillMount() {

    }

    render() {
        return (
            <div>
                <RcViewer options={{
                    url(image) {
                        return image.src.replace('carimages_small', 'carimages');
                    }
                }}>
                    <div className="cur" id="images" style={{listStyle:'none',padding:'none'}} >
                        {/* {
                            this.state.res.map((item,index) => <li key = {index}><img src={`${item.src}`} /></li>)
                        } */}
                        <img style={{ width: this.props.wt, height: this.props.ht }} src={this.props.imgSrc} />
                    </div>
                </RcViewer>
            </div>
        )
    }
}