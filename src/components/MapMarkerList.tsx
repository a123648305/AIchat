import { Drawer, Space, Row, Image, Button } from 'antd';
import { ReactNode, useState } from 'react';
import React from 'react';

type MarkerListProps = {
  show: boolean;
  list: { title: string; position: { lat: number; lng: number }; poster?: string; remark?: string; fileList?: { id: string; name: string; url: string }[] }[];
  children?: ReactNode;
  onClose: () => void;
  onMove: (data: any) => void;
  onWalk: (data: any) => void;
};

const ListItem: React.FC<{ data: MarkerListProps['list'][number] }> = ({ data, onMove, onWalk }) => {
  const { title, remark, position, fileList = [] } = data;
  return (
    <div className="map-marker-list-content">
      <h3>{title}</h3>
      <span>
        经度：{position.lng} 维度: {position.lat}
      </span>
      <p className="map-marker-list-content-remark">{remark}</p>
      <div className="map-marker-list-content-img">
        {fileList.map((file: { url: string }, index: number) => (
          <div className="map-marker-list-content-img-item" key={index}>
            <Image width={120} src={file.url} />
          </div>
        ))}
      </div>
      <div className="map-marker-list-content-btn">
        <Space>
          <Button type="dashed" size="small" onClick={() => onMove([position.lng, position.lat])}>
            查看详情
          </Button>
          <Button type="primary" size="small" onClick={() => onWalk([position.lng, position.lat])}>
            路线规划
          </Button>
        </Space>
      </div>
    </div>
  );
};

const MapMarkerList: React.FC<MarkerListProps> = (props) => {
  const { list, children, show, onClose, onMove, onWalk } = props;
  console.log(list, 'llll');

  const pagination = {
    onChange: (page: number) => {
      console.log(page);
    },
    pageSize: 3,
  };

  return (
    <div className="map-marker-list">
      {children}
      <Drawer title="锚点列表" placement="bottom" open={show} onClose={onClose} size="large">
        {list.map((item) => (
          <ListItem data={item} key={item.title} onMove={onMove} onWalk={onWalk} />
        ))}
      </Drawer>
    </div>
  );
};

export default MapMarkerList;
