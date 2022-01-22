import React, { Component } from 'react';
import CirclePacking from "../CirclePacking";
import MonthCalendar from '../MonthCalendar';
import ReactEcharts from 'echarts-for-react';
import { Card, Col, Row, Statistic, Timeline, Button, Space, Modal, Tabs } from 'antd';
import * as api from "../../api/main";
import moment from 'moment-timezone';
import { nanoid } from "nanoid";
import ReactJson from "react-json-view";
const { TabPane } = Tabs;
export default class Home extends Component {

    state = {
        channelStatus: {},
        network: {
            "name": "Fabric网络",
            "color": "hsl(259, 70%, 50%)",
            "children": []
        },
        blockMonthData:[],
        orgTxOption: {},
        blockByMinuteOption: {},
        blockByHourOption: {},
        txByMinuteOption: {},
        txByHourOption: {},
        blockActivity: [],
        isModalVisible: false,
        blockInfo: {},
        txInfoList: [],
    };

    load = () => {
        api.getChannelStatus().then((res) => {
            this.setState({ channelStatus: res });
        });

        api.getBlockActivity().then((res) => {
            this.setState({ blockActivity: res.row });
        })

        api.getPeersStatus().then((res) => {
            let network = {
                "name": "Fabric网络",
                "children": [
                    {
                        "name": "排序节点",
                        "children": []
                    },
                    {
                        "name": "组织",
                        "children": []
                    }
                ]
            };

            let orderChildren = [];
            let orgs = [];
            let orgChildren = [];

            res.peers.map((peer) => {
                if (peer.peer_type === "ORDERER") {
                    orderChildren.push({
                        "name": peer.requests,
                        "loc": 1
                    })
                } else if (peer.peer_type === "PEER") {
                    if (orgs.indexOf(peer.mspid) !== -1) {
                        orgChildren = orgChildren.map((orgChild) => {
                            if (orgChild.name === peer.mspid) {
                                orgChild.children.push({
                                    "name": peer.requests,
                                    "loc": 1
                                })
                            }
                            return orgChild
                        });
                    } else {
                        orgs.push(peer.mspid);
                        orgChildren.push({
                            "name": peer.mspid,
                            "children": [
                                {
                                    "name": peer.requests,
                                    "children": [],
                                    "loc": 1
                                }
                            ]
                        })
                    }

                }
            });
            network.children[0].children = orderChildren;
            network.children[1].children = orgChildren;
            this.setState({ network });
        })

        api.getTxByOrg().then((res) => {
            let data = [];
            res.rows.map((d) => {
                if (d.creator_msp_id !== '') {
                    data.push({
                        value: parseInt(d.count),
                        name: d.creator_msp_id
                    })
                }
            });
            let option = {
                title: {
                    text: '各组织交易量',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '50%',
                        data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            this.setState({ orgTxOption: option });
        })

        api.getBlocksByHour().then((res) => {
            let xdata = [];
            let sdata = [];
            res.rows.map((dc) => {
                xdata.push(
                    moment(dc.datetime)
                        .tz(moment.tz.guess())
                        .format('h:mm A')
                );
                sdata.push(dc.count);
            });
            let option = {
                xAxis: {
                    type: 'category',
                    data: xdata
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: sdata,
                        type: 'line'
                    }
                ]
            };
            this.setState({ blockByHourOption: option });
        });

        api.getBlocksByMonth().then((res) => {
            let data={value:0,
                day:''
            };
            res.rows.map((dc) => {
                data['value']=dc.count;
                data['day']=moment(dc.datetime)
                        .tz(moment.tz.guess())
                        .format('YYYY-MM-DD');
               this.state.blockMonthData.push(data);
            });
        });

        api.getBlocksByMinute().then((res) => {
            let xdata = [];
            let sdata = [];
            res.rows.map((dc) => {
                xdata.push(
                    moment(dc.datetime)
                        .tz(moment.tz.guess())
                        .format('mm:ss')
                );
                sdata.push(dc.count);
            });
            let option = {
                xAxis: {
                    type: 'category',
                    data: xdata
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: sdata,
                        type: 'line'
                    }
                ]
            };
            this.setState({ blockByMinuteOption: option });
        });

        api.getTxByHour().then((res) => {
            let xdata = [];
            let sdata = [];
            res.rows.map((dc) => {
                xdata.push(
                    moment(dc.datetime)
                        .tz(moment.tz.guess())
                        .format('h:mm A')
                );
                sdata.push(dc.count);
            });
            let option = {
                xAxis: {
                    type: 'category',
                    data: xdata
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: sdata,
                        type: 'line'
                    }
                ]
            };
            this.setState({ txByHourOption: option });
        });

        api.getTxByMinute().then((res) => {
            let xdata = [];
            let sdata = [];
            res.rows.map((dc) => {
                xdata.push(
                    moment(dc.datetime)
                        .tz(moment.tz.guess())
                        .format('mm:ss')
                );
                sdata.push(dc.count);
            });
            let option = {
                xAxis: {
                    type: 'category',
                    data: xdata
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: sdata,
                        type: 'line'
                    }
                ]
            };
            this.setState({ txByMinuteOption: option });
        });
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.load();
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    detail = (blockInfo) => {
        return () => {
            let { txInfoList } = this.state;
            blockInfo.txhash.map((txId) => {
                api.getTxDetail(txId).then((res) => {
                    txInfoList.push(res.row);
                    this.setState({ txInfoList });
                })
            });
            this.setState({ isModalVisible: true, blockInfo });
        }
    };

    handleOk = () => {
        this.setState({ isModalVisible: false })
    };

    handleCancel = () => {
        this.setState({ isModalVisible: false })
    };

    render() {
        const { channelStatus, network, orgTxOption, blockByHourOption, blockByMinuteOption, txByHourOption, txByMinuteOption, blockActivity, isModalVisible, blockInfo, txInfoList } = this.state;
        return (
            <div>
                <Card>
                    <Row>
                        <Col span={6}>
                            <Statistic title="区块数量" value={channelStatus.latestBlock} />
                        </Col>
                        <Col span={6}>
                            <Statistic title="交易数量" value={channelStatus.txCount} />
                        </Col>
                        <Col span={6}>
                            <Statistic title="节点数量" value={channelStatus.peerCount} />
                        </Col>
                        <Col span={6}>
                            <Statistic title="链码数量" value={channelStatus.chaincodeCount} />
                        </Col>
                    </Row>
                </Card>

                <Row>
                    <Col span={12}>
                        <div style={{ marginTop: "30px" }}>
                            <Card title="网络架构">
                                <div style={{ height: "500px" }}>
                                    <CirclePacking network={network} />
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{ marginTop: "30px" }}>
                            <Card title="各组织交易">
                                <div>
                                    <ReactEcharts option={orgTxOption} style={{ height: "500px" }} />
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <div style={{ marginTop: "30px" }}>
                            <Card title="最新区块">
                                <div style={{ height: "500px", overflow: "auto" }}>
                                    <Timeline>
                                        {
                                            blockActivity.map((block) => {
                                                return (
                                                    <Timeline.Item key={nanoid()}>
                                                        <Card title={"区块" + block.blocknum}>
                                                            <Button type="primary" onClick={this.detail(block)} style={{ marginBottom: "10px" }} size="small">查看详情</Button>
                                                            <p><b>通道名称：</b>{block.channelname}</p>
                                                            <p><b>数据Hash：</b>{block.datahash}</p>
                                                            <p><b>交易数量：</b>{block.txcount}</p>
                                                            <p><b>创建时间：</b>{
                                                                moment(block.createdt)
                                                                    .tz(moment.tz.guess())
                                                                    .format('yyyy-MM-DD hh:mm:ss A')
                                                            }</p>
                                                        </Card>
                                                    </Timeline.Item>
                                                )
                                            })
                                        }
                                    </Timeline>
                                </div>
                            </Card>
                        </div>
                    </Col>

                    <Col span={12}>
                        <div style={{ marginTop: "30px" }}>
                            <Card title="区块速率">
                                <div style={{ height: "500px" }}>
                                    <Tabs defaultActiveKey="1" >
                                        <TabPane tab="小时速率" key="1">
                                            <ReactEcharts option={blockByHourOption} style={{ height: "500px" }} />
                                        </TabPane>
                                        <TabPane tab="分钟速率" key="2">
                                            <ReactEcharts option={blockByMinuteOption} style={{ height: "500px" }} />
                                        </TabPane>
                                    </Tabs>

                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <div style={{ marginTop: "30px" }}>
                            <Card title="交易速率">
                                <div style={{ height: "500px" }}>
                                    <Tabs defaultActiveKey="1" >
                                        <TabPane tab="小时速率" key="1">
                                            <ReactEcharts option={txByHourOption} style={{ height: "500px" }} />
                                        </TabPane>
                                        <TabPane tab="分钟速率" key="2">
                                            <ReactEcharts option={txByMinuteOption} style={{ height: "500px" }} />
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{ marginTop: "30px" }}>
                            <Card title="交易日历">
                                <div style={{ height: "500px" }}>

                                    <MonthCalendar data={this.state.blockMonthData}/>

                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Modal width="1000px" bodyStyle={{ height: "500px", overflow: "auto" }} title="区块详情" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <p><b>区块号：</b>{blockInfo.blocknum}</p>
                    <p><b>交易数量：</b>{blockInfo.txcount}</p>
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
