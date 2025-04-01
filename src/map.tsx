import AMapLoader from '@amap/amap-jsapi-loader';
import './assets/map.less';
import { useEffect, useRef, useState } from 'react';
import { Button, Drawer, FloatButton, Space, Spin } from 'antd';
import MapMarkerList from './components/MapMarkerList';
import MapModal from './components/MapModal';

type ListMarkerType = {
  title: string;
  position: { lat: number; lng: number };
  poster?: string;
  remark?: string;
  fileList?: { id: string | number; name: string; url: string; createdAt?: string }[];
}[];

const Map: React.FC = () => {
  const [map, setMap] = useState<Record<string, any> | null>(null);
  const amp = useRef(null);

  const [list, setList] = useState<ListMarkerType>([
    { title: '北京', position: { lat: 39.90403, lng: 116.407525 }, poster: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png' },
  ]);

  const mapInit = () => {
    console.log('mapInit');
    (window as any)._AMapSecurityConfig = {
      securityJsCode: '85600aef888c4653899f17c23dd1390f',
    };

    AMapLoader.load({
      key: '2ecba12966505e6a26a977ae42e5b836', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    })
      .then((AMap: any) => {
        amp.current = AMap;
        const instance = new AMap.Map('container', {
          //设置地图容器id
          viewMode: '3D', //是否为3D地图模式
          zoom: 6, //初始化地图级别
          // center: [105.602725, 37.076636], // 初始化地图中心点位置
        });
        const addMarker = (markerData: any) => {
          console.log(markerData, 'mm');
          const marker = new AMap.Marker(markerData);
          instance.add(marker);
        };

        // 添加点标记
        list.forEach((item) => {
          const obj = {
            position: new AMap.LngLat(item.position.lng, item.position.lat),
            title: item.title,
            offset: new AMap.Pixel(-13, -30),
            content: `<div class="marker-content">
                        <span>经度：${item.position.lng}</span>
                        <span>纬度：${item.position.lat}</span>
                        <img src="${item.poster}" width="120px" alt="img" />
                    </div>`,
          };
          addMarker(obj);
        });

        const setSelfPosition = () => {
          // 获取用户当前位置
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: 'RB', // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, // 定位成功后自动调整地图视野范围使定位点及精度范围视野内可见，默认：false
          });

          geolocation.getCurrentPosition((status: string, result: any) => {
            if (status === 'complete') {
              console.log('定位成功', result);
              const { position } = result;
              instance.setCenter([position.lng, position.lat]);
              instance.setZoom(15); // 设置缩放级别

              // 添加用户当前位置的标记
              const userMarker = {
                position: new AMap.LngLat(position.lng, position.lat),
                title: '当前位置',
                offset: new AMap.Pixel(-13, -30),
                img: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
              };
              addMarker(userMarker);

              // 更新状态中的锚点列表
              setList((prevList) => [userMarker, ...prevList]);
            } else {
              console.log('定位失败', result);
            }
          });
        };

        AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye', 'AMap.MapType', 'AMap.Geolocation', 'AMap.ControlBar', 'AMap.Walking'], function () {
          //添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          //   instance.addControl(new AMap.ToolBar());

          //添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          instance.addControl(
            new AMap.Scale({
              position: 'RB',
            })
          );

          //添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
          instance.addControl(new AMap.MapType());

          //添加定位控件，用来获取和展示用户主机所在的经纬度位置
          instance.addControl(
            new AMap.Geolocation({
              position: 'LB',
            })
          );

          //添加控制罗盘控件，用来控制地图的旋转和倾斜
          instance.addControl(new AMap.ControlBar());

          // 添加步行导航控件
          instance.walk = new AMap.Walking({
            map: instance,
            autoFitView: true,
            useGeoLocation: true,
            panel: 'path-result',
          });
        });

        instance.on('complete', () => {
          console.log('地图加载完成', instance);
          setSelfPosition();
        });

        instance.on('click', (e: any) => {
          console.log(e);
          //   const { lnglat } = e;
          //   const data = {
          //     position: lnglat,
          //     title: `新锚点`,
          //     offset: new AMap.Pixel(-13, -30),
          //     content: '<div class="marker-content">新锚点</div>',
          //   };
          //   addMarker(data);
        });

        setMap(instance);
      })
      .catch((e: unknown) => {
        console.log(e);
      });
  };

  // 导航到指定位置
  const [showPath, setShowPath] = useState<boolean>(false); // 显示路径规划
  const [loading, setLoading] = useState<boolean>(false); // 加载中
  const pathResult = useRef<any>();

  const toAppNavigate = () => {
    try {
      // 构建 amapuri 协议链接
      const startPosition = [pathResult.current.start.location.lat, pathResult.current.start.location.lng]; // 起点坐标
      const endPosition = [pathResult.current.end.location.lat, pathResult.current?.end.location.lng]; // 终点坐标
      const [startLat, startLng] = startPosition; // 起点坐标 [经度, 纬度]
      const [endLat, endLng] = endPosition; // 终点坐标 [经度, 纬度

      const uri = `amapuri://route/plan?dlat=${endLat}&dlon=${endLng}&dname=终点&slat=${startLat}&slon=${startLng}&sname=起点&t=2`;
      // 拉起高德地图 APP
      window.location.href = uri;
    } catch (error) {
      console.log(error, 'toAppNavigateError');
    }
  };

  const walkTo = (startPosition = [113.943242, 22.534887], endPosition = [113.944143, 22.527911]) => {
    try {
      console.log('walkTo');
      if (!map || !amp.current) return;
      //   amp.current.event.addListener(map.walk, 'complete', (data: unknown) => {
      //     console.log('导航完成', data);
      //   }); //返回导航查询结果
      setShowPath(true);
      setLoading(true);
      map.walk.search(startPosition, endPosition, (status: string, result: unknown) => {
        if (status === 'complete') {
          console.log('步行导航路径规划成功', result);
          pathResult.current = result;
        } else {
          console.log('步行导航路径规划失败：' + result);
        }
        setLoading(false);
      });
    } catch (error) {
      console.log(error, 'walkToError');
    }
  };

  // 添加当前位置
  const [showDig, setShowDig] = useState<boolean>(false);
  const [formModel, setFormModel] = useState({
    position: { lat: 0, lng: 0 },
    title: '',
    remark: '',
    fileList: [],
  });

  const openModal = () => {
    const position = { lat: 0, lng: 0 };
    if (map) {
      const { lng, lat } = map.getCenter();
      position.lat = lat;
      position.lng = lng;
    }
    setFormModel({
      position,
      title: '',
      remark: '',
      fileList: [],
    });
    setShowDig(true);
  };

  const onConfirm = (data: Record<string, any>) => {
    setMapMarkerList([...mapMarkerList, data]);
  };

  // 锚点列表
  const [markerShow, setMarkerShow] = useState(false);
  const [mapMarkerList, setMapMarkerList] = useState<ListMarkerType>([
    {
      title: '北京',
      position: { lat: 39.90403, lng: 116.407525 },
      remark: '一段描述',
      fileList: [
        {
          id: 1,
          name: 'image.png',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          id: 2,
          name: 'image.png',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          id: 3,
          name: 'image.png',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          id: 4,
          name: 'image.png',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
      createdAt: '2025年4月1日10:50:55',
    },
  ]);

  const openList = () => {
    setMarkerShow(true);
  };

  useEffect(() => {
    mapInit();
    return () => {
      map?.destroy();
    };
  }, []);

  return (
    <div className="map-warp">
      <div id="container" className="map-container"></div>
      <Space>
        <Button type="primary" onClick={openModal}>
          添加当前位置
        </Button>
        <Button type="primary" onClick={openList}>
          锚点列表
        </Button>
        <Button type="primary" onClick={() => walkTo()}>
          walkTo
        </Button>
      </Space>
      <Drawer title="导航路线" placement="bottom" open={showPath} onClose={() => setShowPath(false)}>
        {loading && <Spin size="large" />}
        <div id="path-result"></div>
        <Button type="primary" onClick={toAppNavigate}>高德地图导航</Button>
      </Drawer>
      <MapMarkerList list={mapMarkerList} show={markerShow} onClose={() => setMarkerShow(false)}></MapMarkerList>
      <MapModal visible={showDig} onConfirm={onConfirm} formModel={formModel} onCancel={() => setShowDig(false)}></MapModal>
    </div>
  );
};

export default Map;
