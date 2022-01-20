import React, {Component} from 'react';

import Home from './components/Home'
import Block from "./components/Block";
import Chaincode from "./components/Chaincode";
import Channel from "./components/Channel";
import Network from "./components/Network";

import { Layout, Menu, Breadcrumb, Dropdown,  } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import * as api from './api/main';
import {NavLink, Route, Switch, Redirect} from 'react-router-dom'

import './App.css'
import logo from './assets/logo.png'

import {request} from "./utils/request";

const { Header, Content, Footer } = Layout;


export default class App extends Component {

    state = {
        channels: [],
        channel:[],
        menu: ''
    };

    componentWillMount() {
        let channel;
        this.interval = setInterval(() => {
            api.getChannelInfo().then((res) => {
                this.setState({channels:res.channels})
                this.setState({channel:res.channels[0]})
                const menu = (
                    <Menu>
                        {
                            this.state.channels.map((channel, index) => {
                                
                                return (<Menu.Item key={index}>
                                    <a>
                                        {channel.channelname}
                                    </a>
                                </Menu.Item>)
                            })
                        }
                    </Menu>
                );
                this.setState({menu})
                
                
            }).then(()=>{
                    if (this.state.channel!=undefined) {
                        localStorage.setItem("channel", JSON.stringify(this.state.channel));
                        clearInterval(this.interval)
                    }
                }
            )
        }, 1000)

        // api.getBlockAndTxList("d7735a238250522f93f343dbff938e8e26b5ac38f0d1a58538a22f1ba7eae635").then((res) => {console.log(2, res);})
        // api.getBlocksByMinute("d7735a238250522f93f343dbff938e8e26b5ac38f0d1a58538a22f1ba7eae635").then((res) => {console.log(4, res);})
        // api.getChaincode("d7735a238250522f93f343dbff938e8e26b5ac38f0d1a58538a22f1ba7eae635").then((res) => {console.log(5, res);})
        // api.getChannels().then((res) => {console.log(6, res);})

        // api.getBlockActivity("d7735a238250522f93f343dbff938e8e26b5ac38f0d1a58538a22f1ba7eae635").then((res) => {console.log(10, res);})
        // api.getTxList("d7735a238250522f93f343dbff938e8e26b5ac38f0d1a58538a22f1ba7eae635").then((res) => {console.log(12, res);})
        // api.getTxByMinute("d7735a238250522f93f343dbff938e8e26b5ac38f0d1a58538a22f1ba7eae635").then((res) => {console.log(14, res);})

    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {

        const {menu} = this.state;
        return (
            <div>
                <Layout className="layout">
                    <Header id="components-layout-demo-top">
                        <div >
                            <img src={logo} className="logo" />
                        </div>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                            <Menu.Item key={1}><NavLink to="/home">主页</NavLink></Menu.Item>
                            <Menu.Item key={2}><NavLink to="/block">区块</NavLink></Menu.Item>
                            <Menu.Item key={4}><NavLink to="/network">网络</NavLink></Menu.Item>
                            <Menu.Item key={5}><NavLink to="/chaincode">链码</NavLink></Menu.Item>
                            <Menu.Item key={6}><NavLink to="/channel">通道</NavLink></Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{ padding: '20px 50px' }}>
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                {this.state.channel.channelname} <DownOutlined />
                            </a>
                        </Dropdown>

                        <div className="site-layout-content">
                            <Switch>
                                <Route path="/home" component={Home} />
                                <Route path="/block" component={Block} />
                                <Route path="/network" component={Network} />
                                <Route path="/chaincode" component={Chaincode} />
                                <Route path="/channel" component={Channel} />
                                <Redirect to="/home" />
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>PAI Fabric Visualization ©2022 Developed by Zongtai Li, Hanfu Zhang, and Shaoyi Han</Footer>
                </Layout>
            </div>
        );
  }
}