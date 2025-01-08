import {
  UserOutlined,
  SyncOutlined,
  CopyOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  SmileOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Flex, Space, message } from 'antd';
import { Bubble, Prompts, Sender } from '@ant-design/x';
import { useMemo, useRef, useState } from 'react';

type ChatSessionProps = {
  messageList: { content: string; name?: string; time: string }[];
  onSend: (content: string) => void;
};

const ChatSession: React.FC<ChatSessionProps> = (props) => {
  const fooAvatar: React.CSSProperties = {
    color: '#f56a00',
    backgroundColor: '#fde3cf',
  };

  const [senderText, setSenderText] = useState('');
  const listRef = useRef<any>(null);

  const { messageList, onSend } = props;

  const onSubmit = (content: string) => {
    console.log('ggg', content);
    message.success('Send message successfully!');
    onSend(content);
  };

  const bubbleFooter = (
    <Space>
      <Button
        color="default"
        variant="text"
        size="small"
        icon={<SyncOutlined />}
      />
      <Button
        color="default"
        variant="text"
        size="small"
        icon={<CopyOutlined />}
      />
    </Space>
  );

  const items = [
    {
      key: '1',
      icon: <BulbOutlined style={{ color: '#FFD700' }} />,
      label: 'Ignite Your Creativity',
      description: 'Got any sparks for a new project?',
    },
    {
      key: '2',
      icon: <InfoCircleOutlined style={{ color: '#1890FF' }} />,
      label: 'Uncover Background Info',
      description: 'Help me understand the background of this topic.',
    },
    {
      key: '3',
      icon: <RocketOutlined style={{ color: '#722ED1' }} />,
      label: 'Efficiency Boost Battle',
      description: 'How can I work faster and better?',
    },
    {
      key: '4',
      icon: <SmileOutlined style={{ color: '#52C41A' }} />,
      label: 'Tell me a Joke',
      description:
        'Why do not ants get sick? Because they have tiny ant-bodies!',
    },
    {
      key: '5',
      icon: <WarningOutlined style={{ color: '#FF4D4F' }} />,
      label: 'Common Issue Solutions',
      description: 'How to solve common issues? Share some tips!',
    },
  ];

  const promptsClick = (info: any) => {
    console.log('info', info);
    setSenderText(info.data.label);
  };

  const list = useMemo(() => {
    return messageList.map((item, index) => ({
      key: index,
      placement: item.name === 'Ai' ? 'start' : 'end',
      role: item.name,
      content: item.content,
      avatar: { icon: <UserOutlined />, style: fooAvatar },
      header: item.name,
      footer: bubbleFooter,
      typing: { step: 2, interval: 50 },
    }));
  }, [messageList]);

  return (
    <div>
      <Flex vertical gap="small">
        <Bubble.List ref={listRef} style={{ maxHeight: 400 }} items={list} />
      </Flex>
      <Prompts
        title="✨ Inspirational Sparks and Marvelous Tips"
        items={items}
        onItemClick={promptsClick}
        wrap
        className="mb-2"
      />
      <Sender
        submitType="shiftEnter"
        placeholder="Press Shift + Enter to send message"
        onSubmit={onSubmit}
        value={senderText}
        onChange={(value) => setSenderText(value)}
      />
    </div>
  );
};

export default ChatSession;
