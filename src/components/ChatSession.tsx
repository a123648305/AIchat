import { UserOutlined, SyncOutlined, CopyOutlined, BulbOutlined } from '@ant-design/icons';
import { Button, Flex, Space, message } from 'antd';
import { Bubble, Prompts, Sender } from '@ant-design/x';
import { useMemo, useRef, useState } from 'react';
import { Typography } from 'antd';
import markdownit from 'markdown-it';

type ChatSessionProps = {
  messageList: { content: string; loading:boolean; role: 'assistant' | 'user'; time: string }[];
  loading: boolean;
  onSend: (content: string) => void;
};

const md = markdownit({ html: true, breaks: true });
const renderMarkdown= (content:string) => (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </Typography>
  );

const ChatSession: React.FC<ChatSessionProps> = (props) => {
  const fooAvatar: React.CSSProperties = {
    color: '#f56a00',
    backgroundColor: '#fde3cf',
  };

  const [senderText, setSenderText] = useState('');
  const listRef = useRef<any>(null);

  const { messageList, onSend, loading } = props;

  const onSubmit = (content: string) => {
    console.log('ggg', content);
    onSend(content);
    setSenderText('');
  };

  const bubbleFooter = (
    <Space>
      <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
      <Button color="default" variant="text" size="small" icon={<CopyOutlined />} />
    </Space>
  );

  const items = [
    {
      key: '1',
      icon: <BulbOutlined style={{ color: '#FFD700' }} />,
      label: 'Ignite Your Creativity',
      description: 'Got any sparks for a new project?',
    },
  ];

  const promptsClick = (info: any) => {
    console.log('info', info);
    setSenderText(info.data.label);
  };

  const list = useMemo(() => {
    return messageList.map((item, index) => ({
      key: index,
      placement: item.role === 'assistant' ? 'start' : 'end',
      role: item.role,
      loading: item.loading,
      content: item.content,
      avatar: { icon: <UserOutlined />, style: fooAvatar },
      header: item.role,
      footer: bubbleFooter,
      typing: { step: 2, interval: 50 },
      messageRender:renderMarkdown
    }));
  }, [messageList]);

  return (
    <div>
      <Flex vertical gap="small">
        <Bubble.List ref={listRef} style={{ height: 500 }} items={list} />
      </Flex>
      <Prompts title="✨Tips" items={items} onItemClick={promptsClick} wrap className="mb-2" />
      <Sender loading={loading} placeholder="Press Enter to send message" onSubmit={onSubmit} value={senderText} onChange={(value) => setSenderText(value)} />
    </div>
  );
};

export default ChatSession;
