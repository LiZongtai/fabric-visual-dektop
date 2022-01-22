import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Table, notification, Tabs } from 'antd';
import * as api from '../../api/main';
const { TabPane } = Tabs;
const columns = [
    {
        title: 'Key',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: '拥有者',
        dataIndex: 'owner',
        key: 'owner',
    },
    {
        title: '品牌',
        dataIndex: 'make',
        key: 'make',
    },
    {
        title: '型号',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: '颜色',
        dataIndex: 'color',
        key: 'color',
    },
];

export default class Transaction extends Component {

    state = {
        dataSource: []
    };

    onChangeFinish = (values) => {
        api.changeCarOwner(values.Key, values.NewOwner).then((res) => {
            this.load();
            notification['success']({
                message: '已发起变更拥有者交易!',
                description:
                    '请稍等，正在执行交易……',
            });
        })
    };

    onChangeFinishFailed = (errorInfo) => {
        notification['error']({
            message: '交易失败!',
            description:
                errorInfo
        });
    };

    onCreateFinish = (values) => {
        api.createCar(values.Key, values.Owner, values.Make, values.Model, values.Color).then((res) => {
            this.load();
            notification['success']({
                message: '已提交新的记录!',
                description:
                    '请稍等，正在执行交易……',
            });
        })
    };

    onCreateFinishFailed = (errorInfo) => {
        notification['error']({
            message: '交易失败!',
            description:
                errorInfo
        });
    };

    load = () => {
        api.queryAllCars().then((data) => {
            let dataSource = [];
            data.map((d) => {
                dataSource.push({
                    key: d.Key,
                    owner: d.Record.owner,
                    make: d.Record.make,
                    model: d.Record.model,
                    color: d.Record.color
                })
            });
            this.setState({ dataSource });
        });
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
        return (
            <div>
                <Row justify='space-between'>
                    <Col span={6}>
                        <Tabs defaultActiveKey="1" >
                            <TabPane tab="创建新记录" key="1">
                                <Form
                                    name="basic"
                                    labelCol={{
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 16,
                                    }}
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={this.onCreateFinish}
                                    onFinishFailed={this.onCreateFinishFailed}
                                    autoComplete="off">
                                    <Form.Item
                                        label="Key"
                                        name="Key"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入Key!',
                                            },
                                        ]}>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="拥有者"
                                        name="Owner"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入拥有者!',
                                            },
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="品牌"
                                        name="Make"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入品牌!',
                                            },
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="型号"
                                        name="Model"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入型号!',
                                            },
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="颜色"
                                        name="Color"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入颜色!',
                                            },
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{
                                            offset: 8,
                                            span: 16,
                                        }}>
                                        <Button type="primary" htmlType="submit">
                                            发起交易
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                            <TabPane tab="变更拥有者" key="2">
                                <Form
                                    name="basic"
                                    labelCol={{
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 16,
                                    }}
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={this.onChangeFinish}
                                    onFinishFailed={this.onChangeFinishFailed}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="Key"
                                        name="Key"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入你要转移的Key!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="新拥有者"
                                        name="NewOwner"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入新的拥有者!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        wrapperCol={{
                                            offset: 8,
                                            span: 16,
                                        }}
                                    >
                                        <Button type="primary" htmlType="submit">
                                            发起交易
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>

                        </Tabs>

                    </Col>
                    <Col span={16}>
                        <Table dataSource={this.state.dataSource} columns={columns} />
                    </Col>
                </Row>
            </div>
        );
    }
}