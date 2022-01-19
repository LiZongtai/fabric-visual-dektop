import React, {Component} from 'react';
import CirclePacking from "../CirclePacking";
import ReactEcharts from 'echarts-for-react';
import {Card, Col, Row, Statistic} from 'antd';
import * as api from "../../api/main";
import moment from 'moment-timezone';

export default class Home extends Component {

    state = {
        channelStatus: {},
        network: {
            "name": "Fabric网络",
            "color": "hsl(259, 70%, 50%)",
            "children": []
        },
        orgTxOption: {},
        blockByHourOption: {},
        txByHourOption: {},
    };

    load = () => {
        api.getChannelStatus().then((res) => {
            this.setState({channelStatus: res});
        });

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
            this.setState({network});
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
            this.setState({orgTxOption: option});
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
            this.setState({blockByHourOption: option});
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
            this.setState({txByHourOption: option});
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
        const {channelStatus, network, orgTxOption, blockByHourOption, txByHourOption} = this.state;
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
                        <div style={{marginTop: "30px"}}>
                            <Card title="网络架构">
                                <div style={{ height: "500px" }}>
                                    <CirclePacking network={network} />
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{marginTop: "30px"}}>
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
                        <div style={{marginTop: "30px"}}>
                            <Card title="区块速率">
                                <div style={{ height: "500px" }}>
                                    <ReactEcharts option={blockByHourOption} style={{ height: "500px" }} />
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{marginTop: "30px"}}>
                            <Card title="交易速率">
                                <div style={{ height: "500px" }}>
                                    <ReactEcharts option={txByHourOption} style={{ height: "500px" }} />
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
