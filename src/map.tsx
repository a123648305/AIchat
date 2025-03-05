import AMapLoader from '@amap/amap-jsapi-loader';
import './assets/map.less';
import { useEffect, useState } from 'react';
import { FloatButton } from 'antd';

type ListMarkerType = { title: string; position: { lat: number; lng: number }; src?: string }[];

const Map: React.FC = () => {
  const [map, setMap] = useState<any>(null);

  const [list, setList] = useState<ListMarkerType>([
    { title: '北京', position: { lat: 39.90403, lng: 116.407525 }, src: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png' },
  ]);

  const mapInit = () => {
    console.log('mapInit');
    (window as any)._AMapSecurityConfig = {
      securityJsCode: '85600aef888c4653899f17c23dd1390f',
    };

    AMapLoader.load({
      key: '2ecba12966505e6a26a977ae42e5b836', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Scale', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.ControlBar'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
      .then((AMap: any) => {
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
                        <img src="${item.src}" alt="img" />
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

        // AMap.plugin(['AMap.PlaceSearch', 'AMap.ControlBar'], function () {
        //   //构造地点查询类
        //   var placeSearch = new AMap.PlaceSearch({
        //     pageSize: 5, // 单页显示结果条数
        //     pageIndex: 1, // 页码
        //     city: '010', // 兴趣点城市
        //     citylimit: true, //是否强制限制在设置的城市内搜索
        //     map: map, // 展现结果的地图实例
        //     panel: 'panel', // 结果列表将在此容器中进行展示。
        //     autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        //   });
        //   //关键字查询
        //   placeSearch.search('北京大学');
        // });

        instance.on('complete', () => {
          console.log('地图加载完成');
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

  const addCurMarker = () => {
    if (map) {
      const { lng, lat } = map.getCenter();
      const data = {
        position: { lng, lat },
        title: `新锚点`,
        content: '<div class="marker-content">新锚点</div>',
      };
  }
}

  useEffect(() => {
    mapInit();
    return () => {
      map?.destroy();
    };
  }, []);

  return (
    <div className="map-warp">
      <div id="container" className="map-container"></div>
      <FloatButton  type="default" style={{ insetInlineEnd: 94 }} onClick={()=>addCurMarker()}>标记位置</FloatButton>
    </div>
  );
};

export default Map;
