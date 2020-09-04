import React, { Component } from 'react';
import CrmMap from '@/components/CrmMap';

export default class Dialog extends Component {
  constructor(props:any) {
      super(props);
      this.state = {
        long:props.long,
        lat:props.lat,
        category:props.category
      };
  }
  componentWillMount() {

  }
  componentWillReceiveProps(nextProps: any) {
    // const { lat, long ,category} = nextProps;
    // if (lat != this.props.lat || long != this.props.long) {
    //   this.setState({
    //     long:long,
    //     lat:lat,
    //     category:category
    //   });
    // }
  }
  render() {
      // const {long,lat,category} = this.state;
      return (
        <CrmMap 
        long={121.491165}
        lat={31.19897}
        category={''}
        hotleName={''}
        visible={true}
      />
      )
  }
}