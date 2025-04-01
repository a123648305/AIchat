import { Drawer, Avatar, List, Space, Row, Image } from 'antd';
import { ReactNode, useState } from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import React from 'react';

type MarkerListProps = {
  show: boolean;
  list: { title: string; position: { lat: number; lng: number }; poster?: string; remark?: string; fileList?: { id: string; name: string; url: string }[] }[];
  children?: ReactNode;
  onClose: () => void;
};
const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const ListItem: React.FC<{ data: MarkerListProps['list'][number] }> = ({ data }) => {
  const { title, remark, position, fileList = [] } = data;
  console.log(data, 'rrr');
  return (
    <div className="map-marker-list-content">
      <h3>{title}</h3>
      <p>
        {' '}
        经度：{position.lng} 维度: {position.lat}
      </p>
      <p className="map-marker-list-content-remark">{remark}</p>
      <div className="map-marker-list-content-img">
        {fileList.map((file: { url: string }, index: number) => (
          <Image width={120} key={index} src={file.url} />
        ))}
      </div>
    </div>
  );
};

const MapMarkerList: React.FC<MarkerListProps> = (props) => {
  const { list, children, show, onClose } = props;
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
          <ListItem data={item} key={item.title} />
        ))}
      </Drawer>
    </div>
  );
};

export default MapMarkerList;
