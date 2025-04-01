import React, { useState } from 'react';
import ChatItem from './components/ChatItem';
import ChatSession from './components/ChatSession';
import ChatHeader from './components/ChatHeader';
import { Layout } from 'antd';
import { useXAgent } from '@ant-design/x';
import './assets/home.less';

const BASE_URL = 'https://api.deepseek.com';
const PATH = '/chat/completions';
// const MODEL = 'deepseek-reasoner'; deepseek-chat
const MODEL = 'deepseek-chat';

const App: React.FC = () => {
  const { Header, Footer, Sider, Content } = Layout;
  const [agent] = useXAgent<{
    role: string;
    content: string;
  }>({
    baseURL: BASE_URL + PATH,
    model: MODEL,
    dangerouslyApiKey: 'Bearer sk-5e5d0169d67e46668310ed0cdc7f450b',
  });

  const [messageList, setMessageList] = useState([]);

  async function onSend(content: string) {
    setMessageList((data) => {
      return [
        ...data,
        {
          role: 'user',
          content,
          time: new Date().toLocaleString(),
        },
        {
            role: 'assistant',
            content: '加载中...',
            loading:true,
            time: new Date().toLocaleString(),
        },
      ];
    });

    agent.request(
      {
        messages: messageList.slice(0,-1),
      },
      {
        onSuccess: (messages) => {
          console.log('onSuccess', messages);
        },
        onError: (error) => {
          console.error('onError', error);
        },
        onUpdate: (msg) => {
          const message = (msg as unknown as any).choices[0].message;
          setMessageList((data) => {
            return [
              ...data.slice(0,-1),
              {
                ...message,
                time: new Date().toLocaleString(),
              },
            ];
          });
          console.log('onUpdate', msg);
        },
      }
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
            <ChatSession messageList={messageList} onSend={onSend} loading={agent.isRequesting()}/>
          </Content>
        </Layout>
        <Footer className="chat-box-footer">Footer</Footer>
      </Layout>
    </div>
  );
};

export default App;
