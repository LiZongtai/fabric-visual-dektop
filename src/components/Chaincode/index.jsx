import React, {Component} from 'react';
import * as api from '../../api/main';
import { Table  } from 'antd';

const columns = [
    {
        title: '链码名称',
        dataIndex: 'chaincodename',
        key: 'chaincodename',
    },
    {
        title: '通道名称',
        dataIndex: 'channelname',
        key: 'channelname',
    },
    {
        title: '交易数量',
        dataIndex: 'txs',
        key: 'txs',
    },
    {
        title: '版本',
        dataIndex: 'version',
        key: 'version',
    },
];

export default class Chaincode extends Component {

    state = {
        dataSource: []
    };

    load = () => {
        api.getChaincode().then((res) => {
            let dataSource = [];
            res.chaincode.map((cc) => {
                dataSource.push({
                    chaincodename: cc.chaincodename,
                    channelname: cc.channelName,
                    txs: cc.txCount,
                    version: cc.version
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
