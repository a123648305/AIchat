import React, { useState } from 'react';
import ChatItem from './components/ChatItem';
import ChatSession from './components/ChatSession';
import ChatHeader from './components/ChatHeader';
import { Layout } from 'antd';
import { useXAgent } from '@ant-design/x';
import './assets/home.less';

const BASE_URL = 'https://api.example.com';
const PATH = '/chat';
const MODEL = 'gpt-3.5-turbo';

const App: React.FC = () => {
  const { Header, Footer, Sider, Content } = Layout;
  const [agent] = useXAgent<{
    role: string;
    content: string;
  }>({
    baseURL: BASE_URL + PATH,
    model: MODEL,
    // dangerouslyApiKey: API_KEY
  });

  const [messageList, setMessageList] = useState([
    {
      content: 'hello',
      name: 'Ai',
      time: '2023-03-01 04:00:00',
    },
    {
      content: 'how are you?',
      name: 'Bob',
      time: '2023-03-01 12:00:00',
    },
    {
      content: 'I am fine, thank you.',
      name: 'Ai',
      time: '2023-03-01 13:00:00',
    },
    {
      content: 'What are you doing?',
      name: 'Bob',
      time: '2023-03-01 12:00:01',
    },
  ]);

  async function onSend(content: string) {
    agent.request(
      {
        messages: [{ role: 'Bob', content }],
      },
      {
        onSuccess: (messages) => {
          console.log('onSuccess', messages);
        },
        onError: (error) => {
          console.error('onError', error);
        },
        onUpdate: (msg) => {
          setMessageList((data) => {
            return [
              ...data,
              {
                content,
                name: 'Bob',
                time: new Date().toLocaleString(),
              },
            ];
          });
          console.log('onUpdate', msg);
        },
      },
    );
  }

  return (
    <div className="App">
      <Layout className="m-1 chat-box">
        <Header className="chat-box-header">
          <ChatHeader />
        </Header>
        <Layout>
          <Sider className="chat-box-sider" width="20%">
            <ChatItem />
          </Sider>
          <Content className="chat-box-content">
            <ChatSession messageList={messageList} onSend={onSend} />
          </Content>
        </Layout>
        <Footer className="chat-box-footer">Footer</Footer>
      </Layout>
    </div>
  );
};

export default App;
