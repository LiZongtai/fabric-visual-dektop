import React, {Component} from 'react';
import * as api from '../../api/main';
import { Table  } from 'antd';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '通道名称',
        dataIndex: 'channelname',
        key: 'channelname',
    },
    {
        title: '区块数量',
        dataIndex: 'blocks',
        key: 'blocks',
    },
    {
        title: '交易数量',
        dataIndex: 'txs',
        key: 'txs',
    },
    {
        title: '创建时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
    },
];

export default class Channel extends Component {

    state = {
        dataSource: []
    };

    load = () => {
        api.getChannelInfo().then((res) => {
            let dataSource = [];
            res.channels.map((channel) => {
                dataSource.push({
                    id: channel.id,
                    channelname: channel.channelname,
                    blocks: channel.blocks,
                    txs: channel.transactions,
                    timestamp: channel.createdat.replace('T', ' ').replace('Z', ' ')
                })
            });
            this.setState({dataSource});
        })
    }

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
