import React, {Component} from 'react';
import * as api from '../../api/main';
import { Table, Modal, Button, Space } from 'antd';
import ReactJson from "react-json-view";

export default class Block extends Component {

    state = {
        dataSource: [],
        isModalVisible: false,
        blockInfo: {},
        txInfoList: []
    };

    detail = (blockInfo) => {
        return () => {
            let {txInfoList} = this.state;

            blockInfo.txhash.map((txId) => {
                api.getTxDetail(txId).then((res) => {
                    txInfoList.push(res.row);
                    console.log(txInfoList);
                    this.setState({txInfoList});
                })
            });
            this.setState({isModalVisible: true, blockInfo});
        }
    };

    columns = [
        {
            title: '区块号',
            dataIndex: 'blocknumber',
            key: 'blocknumber',
        },
        {
            title: '交易数量',
            dataIndex: 'txcount',
            key: 'txcount',
        },
        {
            title: '区块Hash',
            dataIndex: 'blockhash',
            key: 'blockhash',
        },
        {
            title: '大小(KB)',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={this.detail(record)}>查看详情</a>
                </Space>
            ),
        },
    ];


    showModal = () => {
        this.setState({isModalVisible: true})
    };

    handleOk = () => {
        this.setState({isModalVisible: false})
    };

    handleCancel = () => {
        this.setState({isModalVisible: false})
    };

    load = () => {
        api.getBlockAndTxList().then((res) => {
            let dataSource = [];
            res.rows.map((b) => {
                dataSource.push({
                    blocknumber: b.blocknum,
                    txcount: b.txcount,
                    blockhash: b.blockhash,
                    size: b.blksize,
                    datahash: b.datahash,
                    prehash: b.prehash,
                    txhash: b.txhash

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
        const {dataSource, isModalVisible, blockInfo, txInfoList} = this.state;
        return (
            <div>
                <Table dataSource={dataSource} columns={this.columns} />

                <Modal width="1000px" bodyStyle={{height: "500px", overflow: "auto"}} title="区块详情" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <p><b>区块号：</b>{blockInfo.blocknumber}</p>
                    <p><b>交易数量：</b>{blockInfo.txcount}</p>
                    <p><b>区块大小：</b>{blockInfo.size}KB</p>
                    <p><b>区块Hash：</b>{blockInfo.blockhash}</p>
                    <p><b>数据Hash：</b>{blockInfo.datahash}</p>
                    <p><b>上一区块Hash：</b>{blockInfo.prehash}</p>
                    <p><b>交易列表</b></p>
                    <ReactJson src={txInfoList} />
                </Modal>
            </div>
        );
    }
}
