import AMapLoader from '@amap/amap-jsapi-loader';
import './assets/map.less';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Drawer, FloatButton, Space, Spin, message } from 'antd';
import MapMarkerList from './components/MapMarkerList';
import MapModal from './components/MapModal';

type ListMarkerType = {
  title: string;
  position: { lat: number; lng: number };
  poster?: string;
  remark: string;
  fileList: { id: string | number; name: string; url: string; createdAt?: string }[];
}[];

const Map: React.FC = () => {
  const [map, setMap] = useState<Record<string, any> | null>(null);
  const amp = useRef(null);

  const [mapMarkerList, setMapMarkerList] = useState<ListMarkerType>([
    {
      title: '标记点1',
      position: { lat: 22.534887, lng: 113.943242 },
      remark: '一段描述一段描述一段描述一段描述一段描述一段描述一段描述一段描述',
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
    {
      title: '标记点2',
      position: { lat: 22.543667, lng: 113.948507 },
      remark: '一段描述',
      fileList: [],
      createdAt: '2025年4月1日10:50:55',
    },
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
          viewMode: '3D', //是否为3D地图模式
          zoom: 6, //初始化地图级别
        });

        const setSelfPosition = () => {
          // 获取用户当前位置
          const geolocation = new AMap.Geolocation({
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 300, // 定位结果缓存0毫秒，默认：0
            showButton: true, // 显示定位按钮，默认：true
            zoomToAccuracy: true, // 定位成功后自动调整地图视野范围使定位点及精度范围视野内可见，默认：false
          });

          instance.geolocation = geolocation;

          geolocation.getCurrentPosition((status: string, result: any) => {
            if (status === 'complete') {
              console.log('定位成功', result);
              const { position } = result;
              instance.setCenter([position.lng, position.lat]);
              instance.setZoom(15); // 设置缩放级别
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

  // 添加标记
  const [showRemark, setShowRemark] = useState<boolean>(false); // 显示备注
  const mapMarkers = useRef<Record<string, any>[]>([]); // 地图上的标记点
  const updateMarkerList = useCallback(() => {
    const AMap = amp.current;
    if (AMap && map) {
      console.log('开始更新锚点', mapMarkerList);
      mapMarkers.current.forEach((marker) => {
        map.remove(marker);
      });
      // 添加点标记
      const mapMarkerArr = mapMarkerList.map((item) => {
        const poster = item.fileList[0]?.url;
        const obj = {
          position: new AMap.LngLat(item.position.lng, item.position.lat),
          title: item.title,
          offset: new AMap.Pixel(-13, -30),
          extData: item,
          content: `<div class="marker-box">
                        <div class="marker-icon">
                            <img src="https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png" alt="img" />
                        </div>
                        <div class="marker-content">
                            <h3 class='marker-title'>${item.title}</h3>
                            <p class="marker-remark" style="display:${showRemark ? 'block' : 'none'}">${item.remark}</p>
                            <img class="marker-img" src="${poster}"  alt="img" style="display:${showRemark && poster ? 'block' : 'none'}" />
                        </div>
                    </div>`,
        };
        const marker = new AMap.Marker(obj);
        marker.on('click', (e: any) => {
          const data = e.target.getExtData();
          console.log(e, 'click Marker', data);
          openModal(data);
        });
        return marker;
      });
      mapMarkers.current = mapMarkerArr;
      map.add(mapMarkerArr);
    }
  }, [map, showRemark]);

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

      const address = pathResult.current.end.name; // 终点名称

      // 构造各地图URL
      const mapUrls = {
        gaode: `iosamap://navi?dname=${encodeURIComponent(address)}&lat=${endLat}&lon=${endLng}&dev=0&t=0`,
        baidu: `baidumap://map/direction?destination=${endLat},${endLng}&mode=driving&coord_type=gcj02`,
        tencent: `qqmap://map/routeplan?type=drive&to=${encodeURIComponent(address)}&tocoord=${endLat},${endLng}`,
        apple: `http://maps.apple.com/?daddr=${endLat},${endLng}&directionsmode=driving`
      };

      // 尝试打开地图App
      Object.values(mapUrls).forEach(url => {
        window.location.href = url;
      });
    } catch (error) {
      console.log(error, 'toAppNavigateError');
    }
  };

  const walkTo = (endPosition:[number, number], startPosition:[number, number]) => {
    const setPath = (start: [number, number], end: [number, number]) => {
      map?.walk.search(start, end, (status: string, result: unknown) => {
        if (status === 'complete') {
          console.log('步行导航路径规划成功', result);
          pathResult.current = result;
        } else {
          console.log('步行导航路径规划失败：' + result);
        }
        setLoading(false);
      });
    };

    try {
      console.log('walkTo');
      if (!map || !amp.current) return;
      setShowDig(false);
      setShowPath(true);
      setLoading(true);
      if (!startPosition?.length) {
        map.geolocation.getCurrentPosition((status: string, result: any) => {
          if (status === 'complete') {
            console.log('定位成功', result);
            const { position } = result;
            setPath([position.lng, position.lat], endPosition);
          } else {
            console.log('定位失败', result);
            setLoading(false);
          }
        });
      }else{
        setPath(startPosition, endPosition);
      }

    } catch (error) {
      console.log(error, 'walkToError');
    }
  };


  // 移动到指定位置
  const movePointCenter = (position: [number, number]) => {
    setMarkerShow(false);
    map?.setCenter(position);
    // map?.setZoom(15); // 设置缩放级别

  };

  // 添加当前位置
  const [showDig, setShowDig] = useState<boolean>(false);
  const [formModel, setFormModel] = useState({
    position: { lat: 0, lng: 0 },
    title: '',
    remark: '',
    fileList: [],
  });

  const openModal = (data?: ListMarkerType[number]) => {
    let result = {} as ListMarkerType[number];
    if (data) {
      result = data;
    } else {
      const position = { lat: 0, lng: 0 };
      if (map) {
        const { lng, lat } = map.getCenter();
        position.lat = lat;
        position.lng = lng;
      }
      result = {
        position,
        title: '',
        remark: '',
        fileList: [],
      };
    }
    console.log(result, 'openModal');
    setFormModel(result);
    setTimeout(() => {
      setShowDig(true);
    }, 0);
  };

  const onConfirm = (data: Record<string, any>) => {
    setMapMarkerList((prev) => [...prev, data]);
    message.success('添加成功');
    setShowDig(false);
  };

  // 锚点列表
  const [markerShow, setMarkerShow] = useState(false);

  const openList = () => {
    setMarkerShow(true);
  };

  useEffect(() => {
    mapInit();
    return () => {
      map?.destroy();
    };
  }, []);

  useEffect(() => {
    updateMarkerList();
  }, [mapMarkerList, map, showRemark]);

  return (
    <div className="map-warp">
      <div id="container" className="map-container"></div>
      <Space>
        <Button type="primary" onClick={() => openModal()}>
          添加当前位置
        </Button>
        <Button type="primary" onClick={openList}>
          锚点列表
        </Button>
        <Button type="primary" onClick={() => setShowRemark(!showRemark)}>
          {showRemark ? '隐藏' : '展示'}描述
        </Button>
        <Button type="primary" onClick={() => walkTo()}>
          walkTo
        </Button>
      </Space>
      <Drawer title="导航路线" placement="bottom" open={showPath} onClose={() => setShowPath(false)}>
        {loading && <Spin size="large" />}
        <div id="path-result"></div>
        <Button type="primary" onClick={toAppNavigate}>
          高德地图导航
        </Button>
      </Drawer>
      <MapMarkerList list={mapMarkerList} show={markerShow} onClose={() => setMarkerShow(false)} onMove={movePointCenter} onWalk={walkTo}></MapMarkerList>
      <MapModal visible={showDig} onConfirm={onConfirm} formModel={formModel} onCancel={() => setShowDig(false)} onWalk={walkTo}></MapModal>
    </div>
  );
};

export default Map;
