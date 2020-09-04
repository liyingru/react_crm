import React, { Component } from 'react';
import styles from './index.less';
import { Map, Marker, Markers, Circle, CircleEditor, InfoWindow } from 'react-amap';
import { Tabs, Select, AutoComplete, Button, message, Input, Spin } from 'antd';
import AreaSelect from '@/components/AreaSelect';
import URL from '@/api/serverAPI.config';
import Axios from 'axios';
const { Option } = Select;
const { Search } = Input;

/* 测试----数据---START */
let result = [
  {
    "store_name": "上海通茂大酒店",
    "address": "上海市浦东新区松林路357号",
    "price_min": "4188.00",
    "price_max": "5988.00",
    "contain_tag": "table",
    "contain_min": 1,
    "contain_max": 35,
    "latitude": "31.232368",
    "longitude": "121.541951"
  },
  {
    "store_name": "圣拉维婚礼会馆（滨江店）",
    "address": "上海浦东新区世博大道168号",
    "price_min": "5288.00",
    "price_max": "8988.00",
    "contain_tag": "table",
    "contain_min": 0,
    "contain_max": 35,
    "latitude": "31.208421",
    "longitude": "121.514875"
  },
  {
    "store_name": "圣拉维婚礼会馆（浦东店）",
    "address": "上海浦东新区成山路216号",
    "price_min": "5288.00",
    "price_max": "7988.00",
    "contain_tag": "table",
    "contain_min": 0,
    "contain_max": 45,
    "latitude": "31.22739",
    "longitude": "121.550544"
  }
];
const center = {
  longitude: 116.4747189423828,
  latitude: 39.99653001057585
};
const randomPosition = () => ({
  longitude: 116.474718942382 + Math.random() * 0.01,
  latitude: 39.9965300105758 + Math.random() * 0.01
});
const TestRandomMarker = (len: any) => (
  Array(len).fill(true).map((e, idx) => ({
    position: randomPosition()
  }))
);
/* 测试----数据---END */
const randomMarker = (res: any) => {
  let arr = res ? res : result
  return (
    arr.map((e, idx) => ({
      position: { longitude: Number(e.longitude), latitude: Number(e.latitude) },
      data: e,
      index: idx
    }))
  )
};

const MapLoading = <div className={styles.loadingStyle}>Loading Map...</div>
class CrmMap extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      center: this.props.long ? { longitude: this.props.long, latitude: this.props.lat } : center,
      markers: [],
      // markers: randomMarker(false),
      resetArea: false,
      loading: false,
      category: '',
      list: [],
      isNull: '查询酒店，请先搜索关键字',
      cityCode: '',
      city: '',
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      close: false,
      zoom: 13,
      options: []

    }
    this.markerEvents = {
      mouseover: (e, marker) => {
        marker.render(this.renderMarkerHover);
      },
      mouseout: (e, marker) => {
        marker.render(this.renderMarkerInit);
      }
    }
  }
  componentDidMount() {
    this.initMapDataCtrl(this.props.lat, this.props.long, this.props.category);
    this.setState({
      center: { longitude: this.props.long, latitude: this.props.lat},
      category: this.props.category,
      name:this.props.hotleName
    });
  }
  componentWillReceiveProps(nextProps: any) {
    const { lat, long,visible } = nextProps;
    
    // if (lat != this.props.lat || long != this.props.long) {
    //   this.initMapDataCtrl(nextProps.lat, nextProps.long, nextProps.category);
    //   this.setState({
    //     center: { longitude: long, latitude: lat },
    //     category: nextProps.category,
    //     name:nextProps.hotleName
    //   });
    // }
    if (visible != this.props.visible) {
      this.initMapDataCtrl(nextProps.lat, nextProps.long, nextProps.category);
      this.setState({
        center: { longitude: long, latitude: lat },
        category: nextProps.category,
        name:nextProps.hotleName,
        resetArea: true,
      });
    }
    
  }
  // 酒店 附近酒店查询
  initMapDataCtrl = (latitude: any, longitude: any, category: any) => {
    let params = {};
    params.latitude = latitude;
    params.longitude = longitude;
    params.category = category;
    Axios.post(URL.nearbyMerchant, params).then(
      res => {
        if (res.code == 200) {
          if(res.data.other) message.warning(res.data.other);
          if (res.data.result&&res.data.result.length > 0) {
            if(!res.data.result[0].longitude){
              message.warning('搜索区域没有相对应地理坐标');
              this.setState({loading: false})
              return;
            }
            if (!category) {
              this.setState({
                markers: randomMarker(res.data.result),
                center: { longitude: longitude, latitude: latitude },
                zoom: 13,
              });
            } else {
              this.setState({
                markers: randomMarker(res.data.result),
                center: { longitude: res.data.result[0].longitude, latitude: res.data.result[0].latitude },
                zoom: 13,
              });
              if (Number(category) == 5) {
                this.setState({
                  zoom: 8
                })
              }
            }
          } else {
            message.success('搜索区域没有相关内容');
          }
          this.setState({loading: false})
        }else{
          this.setState({loading: false})
        }

      }
    );
  }
  // 地图地点重绘
  renderMarkerHover(extData: any) {

    return (
      <div className={styles.inforWindow}>
        <div className={styles.inforDesc}>
          <p className={styles.store_name}>酒店名字：{extData.data.store_name}</p>
          <p>价格范围：{parseInt(extData.data.price_min)}-{parseInt(extData.data.price_max)}元/{extData.data.contain_tag == 'table' ? '桌' : '人'}</p>
          <p>容纳{extData.data.contain_tag == 'table' ? '桌' : '人'}数：{extData.data.contain_max}</p>
          <p>商家地址：{extData.data.address}</p>
        </div>
        <div className={`${styles.local} ${extData.index == 0 ? styles.targetHotel : ''}`}></div>
      </div>
    )
  }
  // 默认地图描点
  renderMarkerInit(extData: any) {
    if (extData.index == 0) {
      return <div className={styles.inforWindow}>
        <div className={styles.inforDesc} style={{ zIndex: 99 }}>
          <p className={styles.store_name}>酒店名字：{extData.data.store_name}</p>
          <p>价格范围：{parseInt(extData.data.price_min)}-{parseInt(extData.data.price_max)}元/{extData.data.contain_tag == 'table' ? '桌' : '人'}</p>
          <p>容纳{extData.data.contain_tag == 'table' ? '桌' : '人'}数：{extData.data.contain_max}</p>
          <p>商家地址：{extData.data.address}</p>
          {/* <p className={styles.closeInfor}>&times;</p> */}
        </div>

        <div className={`${styles.local} ${extData.index == 0 ? styles.targetHotel : ''}`}></div>
      </div>
    }
    return <div className={`${styles.local}`}></div>
  }
  closeInforCtrl = () => {
    this.setState({
      close: true
    })
  }
  // 测试函数
  randomMarkers = () => {
    this.setState({
      markers: randomMarker(false)
    });
  }
  // 区域选择
  areaSelectChange = (code: string, province: string, city: string, distruct: any) => {
    //console.log('province', province, 'city', city, 'distruct', distruct);
    let nameCity = city;
    let address = '';
    city = city == '市辖区' ? '' : city == undefined ? '' : city;
    distruct = distruct == '市辖区' ? '' : distruct == undefined ? '' : distruct;
    if (nameCity == '市辖区') {
      address = province;
      city = province;
    } else {
      address = province + city + distruct;
    }


    this.setState({
      cityCode: code,
      city: city,
      address: address,
      resetArea: false,
    });
  };
  timeOut: NodeJS.Timeout | undefined = undefined;
  currentKeyWord: string | undefined = undefined;

  searchNameCtrl = (currentKey: string) => {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
      this.timeOut = undefined;
    }
    if (!currentKey) {
      this.setState({
        list: [],
      })
    };
    this.setState({
      customerList: []
    })
    this.currentKeyWord = currentKey;
    if (currentKey.length == 0) return;
    this.timeOut = setTimeout(() => {
      this.initListDataCtrl(currentKey);
    }, 1000);

  }
  // 酒店检索查询
  initListDataCtrl = (keyword: any) => {
    this.setState({ loading: true });
    let params = {};
    params.name = keyword;
    Axios.post(URL.researchName, params).then(
      res => {
        if (res.code == 200) {
          if(res.data.result&&res.data.result.length > 0){
            let list = res.data.result.splice(0,20);
            this.setState({
              list: list,
            });
          }
          this.setState({loading: false})
        }else{
          this.setState({loading: false})
        }

      }
    );
  }
  // 重置
  handleFormReset = () => {
    this.setState({
      resetArea: true,
      name: '',
      address: '',
      city: ''
    })
  }
  // 查询酒店 位置
  handleFormSure = () => {
    this.setState({ loading: true })
    const { cityCode,city, name, address, latitude, longitude, category } = this.state;
    let params = {};
    params.city = city;
    params.name = name;
    params.address = address;
    params.latitude = latitude;
    params.longitude = longitude;
    params.category = category;
    params.cityCode = cityCode;
    Axios.post(URL.researchBuild, params).then(
      res => {
        if (res.code == 200) {
          if(res.data.other) message.warning(res.data.other);
          if (res.data.result&&res.data.result.length > 0) {
            if(!res.data.result[0].longitude){
              message.warning('搜索区域没有相对应地理坐标');
              this.setState({loading: false})
              return;
            }
            this.setState((prevState) => {
              return {
                markers: randomMarker(res.data.result),
                center: { longitude: res.data.result[0].longitude, latitude: res.data.result[0].latitude },
                zoom: 13,
              }
            });
          } else {
            message.warning('搜索区域没有相关内容');
          }
          this.setState({loading: false})
        }else{
          this.setState({loading: false})
        }
      }
    );
  }
  // 酒店选择
  storeChangeCtrl = (value: any) => {
    this.setState((prevState) => {
      return (
        {
          name: value ? value.store_name : '',
          latitude: value ? value.latitude : '',
          longitude: value ? value.longitude : '',
        }
      )
    })
  }



  render() {
    let h = document.body.clientHeight;
    const { loading, list, isNull, center, markers, zoom, options } = this.state;
    return <Spin spinning={loading} size="large">
      <div style={{ width: '100%', height: h }}>

        <div style={{ width: '100%', height: '8%', display: 'flex' }}>
          <div style={{ width: '30%' }}>
            <AreaSelect level3 areaSelectChange={this.areaSelectChange} reset={this.state.resetArea} />
          </div>
          <div style={{ width: '30%', marginLeft: '15px', position: 'relative' }}>

            <Select
              allowClear
              showSearch
              placeholder={"请输入关键词"}
              optionFilterProp="children"
              style={{ width: '100%' }}
              filterOption={false}
              showArrow={false}
              defaultActiveFirstOption={false}
              onSearch={this.searchNameCtrl}
              onChange={this.storeChangeCtrl}
              value={this.state.name}
              notFoundContent={null}
            >
              {list && list.map((item, index) =>
                <Option value={item} label={item.store_name} key={item.store_name}>
                  {item.store_name}
                </Option>)
              }
            </Select>
          </div>
          <div style={{ width: '30%' }}>
            <Button type="primary" style={{ margin: '0 20px 0 60px' }} onClick={this.handleFormSure}>确定</Button>
            <Button type="primary" onClick={this.handleFormReset}>重置</Button>
          </div>
        </div>
        <div style={{ width: '100%', height: '87%' }}>
          <Map
            loading={MapLoading}
            amapkey='e7af6dd391117098904c7d8267092b72'
            version='1.4.15'
            plugins={['ToolBar', 'Scale']}
            center={center}
            zoom={zoom}
          >
            {
              markers.length != 0 ?
                (
                  <Markers
                    markers={this.state.markers}
                    events={this.markerEvents}
                    render={this.renderMarkerInit}
                  />
                ) : ''}
            {/* {
          markers.length != 0?
          (
          <Circle
            radius={3000}
            center={center}
            style={{ fillColor: '#1493ff', strokeWeight: '0', fillOpacity: 0.5, strokeOpacity: 0 }}
          >
            <CircleEditor active={true} />
          </Circle>
        ):''} */}
          </Map>
        </div>

      </div>
    </Spin>
  }
}

export default CrmMap;
