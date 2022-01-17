import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import {DataPanel} from '../pages/DataPanel/index';
const { Sider, Content } = Layout;

// 内容路由：在此配置内容key对应的内容类，切换主页面内容
function ContentRoute(props) {
  if (props.contentKey === 1) {
    return <DataPanel />;
  } else if (props.contentKey === 2) {
    return <div>2</div>;
  } else if (props.contentKey === 3) {
    return <div>3</div>;
  } else if (props.contentKey === 4) {
    return <div>4</div>;
  } else if (props.contentKey === 5) {
    return <div>5</div>;
  } else if (props.contentKey === 6) {
    return <div>6</div>;
  }
  return <h1>The sidebar button is not bound to corresponding content</h1>;
}

export default class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      contentKey: 1,
      language: 'cn',
    };
    this.onCollapse = this.onCollapse.bind(this);
    this.switchContent = this.switchContent.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onCollapse() {
    this.onClick();
  }

  onClick() {
    this.props.onGetChildMessage(1);
  }

  switchContent(contentKey) {
    this.setState({ contentKey });
  }

  render() {
    const contentStyle = {
      background: '#fff',
      height: '100%',
      margin: '24px 16px',
      padding: '12px',
    };
    return (
      <Layout style={{ height: '1000px' }}>
        <Sider
          trigger={<Icon type="logout" />}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          style={{ paddingTop: '21px' }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" onClick={() => this.switchContent(1)}>
              <Icon type="snippets" theme="outlined" />
              <span>{this.state.language === 'cn' ? '区块链看板' : 'Block Dashboard'}</span>
            </Menu.Item>
            <Menu.Item key="2" onClick={() => this.switchContent(2)}>
              <Icon type="file-search" theme="outlined" />
              <span>{this.state.language === 'cn' ? '链码调用' : 'Chaincode Invocation'}</span>
            </Menu.Item>
            <Menu.Item key="3" onClick={() => this.switchContent(3)}>
              <Icon type="upload" />
              <span>{this.state.language === 'cn' ? '链码安装' : 'Chaincode Installation'}</span>
            </Menu.Item>
            <Menu.Item key="4" onClick={() => this.switchContent(4)}>
              <Icon type="block" />
              <span>{this.state.language === 'cn' ? '通道管理' : 'Channel Management'}</span>
            </Menu.Item>
            <Menu.Item key="5" onClick={() => this.switchContent(5)}>
              <Icon type="user-add" />
              <span>{this.state.language === 'cn' ? 'CA注册' : 'CA Registration'}</span>
            </Menu.Item>
            <Menu.Item key="6" onClick={() => this.switchContent(6)}>
              <Icon type="team" />
              <span>{this.state.language === 'cn' ? 'CA更新与吊销' : 'CA Update & Revoke'}</span>
            </Menu.Item>
          </Menu>
        </Sider>

        <Content style={contentStyle}>
          <ContentRoute contentKey={this.state.contentKey} />
        </Content>
      </Layout>

    );
  }
}
