import { Button, Space } from 'antd';
import { Welcome } from '@ant-design/x';
import { ShareAltOutlined, EllipsisOutlined } from '@ant-design/icons';
import '../assets/home.less';
const ChatHeader: React.FC = () => {
  const styles = {
    borderStartStartRadius: 10,
    backgroundColor: '#fff',
  };

  return (
    <Welcome
      variant="borderless"
      icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
      title="Hello, I'm Ant Design X"
      description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
      style={styles}
      extra={
        <Space>
          <Button icon={<ShareAltOutlined />} />
          <Button icon={<EllipsisOutlined />} />
        </Space>
      }
    />
  );
};

export default ChatHeader;
