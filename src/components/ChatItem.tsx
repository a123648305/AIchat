import { Conversations } from '@ant-design/x';
import { App, type GetProp, theme } from 'antd';
import { DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';

type ChatItemProps = {};
const ChatItem: React.FC<ChatItemProps> = () => {
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const style = {
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    margin: '20px 10px',
  };

  const items = Array.from({ length: 4 }).map((_, index) => ({
    key: `item${index + 1}`,
    label: `Conversation Item ${index + 1}`,
    disabled: index === 3,
  }));

  const menuConfig = (conversation: { key: string }) => ({
    items: [
      {
        label: 'Operation 1',
        key: 'operation1',
        icon: <EditOutlined />,
      },
      {
        label: 'Operation 2',
        key: 'operation2',
        icon: <StopOutlined />,
        disabled: true,
      },
      {
        label: 'Operation 3',
        key: 'operation3',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: (menuInfo: { key: string }) => {
      message.info(`Click ${conversation.key} - ${menuInfo.key}`);
    },
  });

  return (
    <Conversations
      defaultActiveKey="item1"
      menu={menuConfig}
      items={items}
      style={style}
    />
  );
};

export default ChatItem;
