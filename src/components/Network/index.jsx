import React, {Component} from 'react';
import * as api from '../../api/main';
import { Table  } from 'antd';

const columns = [
    {
        title: '节点名称',
        dataIndex: 'peername',
        key: 'peername',
    },
    {
        title: '访问路径',
        dataIndex: 'requesturl',
        key: 'requesturl',
    },
    {
        title: '节点类型',
        dataIndex: 'peertype',
        key: 'peertype',
    },
    {
        title: '所属组织',
        dataIndex: 'mspid',
        key: 'mspid',
    },
];

export default class Network extends Component {

    state = {
        dataSource: []
    };

    load = () => {
        api.getPeersStatus().then((res) => {
            let dataSource = [];
            res.peers.map((n) => {
                dataSource.push({
                    peername: n.server_hostname,
                    requesturl: n.requests,
                    peertype: n.peer_type,
                    mspid: n.mspid
                })
            });
            this.setState({dataSource});
        })
    };

    componentDidMount() {
        this.load();
        this.interval = setInterval(() => {
            this.load();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const {dataSource} = this.state;
        return (
            <div>
                <Table dataSource={dataSource} columns={columns} />
            </div>
        );
    }
}
