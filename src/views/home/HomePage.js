import React,{useEffect,useState} from 'react';
import "./HomePage.scss"
import moment from 'moment'

import * as echarts from 'echarts';

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import {Card, Col, notification, Row, Statistic,Space} from 'antd';
import {
    getHotelCount,
    getHotelDeviceCount,
    getHotelDevicePage,
    getHotelStatsDays,
    getHotelStatsMonths
} from "../../api/HotelAdminApi";
import {getUserCount} from "../../api/UserAdminApi";
import {getOrderAmount, getOrderCount} from "../../api/OrderAdminApi";



export default function HomePage(){


    const [stas, setStas] = useState({
        hotelCount:0,
        deviceCount:0,
        activeCount:0,
        orderCount:0,
        orderAmount:0,
    });

    useEffect(()=>{
        loadData();

    },[])

    const loadData=()=>{
        initStatsHotelAddDay().then(()=>{});
        initStatsHotelAddMonth().then(()=>{});
        loadHotelCount().then(()=>{});
        loadDeviceCount().then(()=>{})
        loadUserCount().then(()=>{})
        loadOrderCount().then(()=>{})
        loadOrderAmount().then(()=>{})
    }

    const loadHotelCount=async ()=>{
        let {status,message,data}=await getHotelCount({});
        console.log(data)
        if(status==0){
            stas.hotelCount=data;
            setStas({...stas});
        }
    }

    const loadDeviceCount=async ()=>{
        let {status,message,data}=await getHotelDeviceCount({});
        console.log(data)
        if(status==0){
            stas.deviceCount=data;
            setStas({...stas});
        }
    }

    const loadUserCount=async ()=>{
        let {status,message,data}=await getUserCount({});
        console.log(data)
        if(status==0){
            stas.activeCount=data;
            setStas({...stas});
        }
    }

    const loadOrderCount=async ()=>{
        let {status,message,data}=await getOrderCount({});
        console.log(data)
        if(status==0){
            stas.orderCount=data;
            setStas({...stas});
        }
    }

    const loadOrderAmount=async ()=>{
        let {status,message,data}=await getOrderAmount({});
        console.log(data)
        if(status==0){
            stas.orderAmount=data;
            setStas({...stas});
        }
    }

    const initStatsHotelAddDay=async ()=>{
        var dom = document.getElementById('stats_hotel_add_day');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        let {status,message,data}=await getHotelStatsDays({});
        //console.log(data)
        if(status==0){
           let map=new Map();
           data.forEach(t=>{
               map.set(t.index,t);
           });
           let now=moment();
           let titles=[];
           let values=[];

           now.add('days', -6);
           let key=now.format('MM-DD');
           titles.push(key);
           values.push(map.get(key)?map.get(key).count:0)

           now.add('days', 1);
           key=now.format('MM-DD');
           titles.push(key);
           values.push(map.get(key)?map.get(key).count:0)

            now.add('days', 1);
            key=now.format('MM-DD');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)

            now.add('days', 1);
            key=now.format('MM-DD');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)

            now.add('days', 1);
            key=now.format('MM-DD');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)

            now.add('days', 1);
            key=now.format('MM-DD');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)

            now.add('days', 1);
            key=now.format('MM-DD');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)


            var option;

            option = {
                title:{
                    text:'最近7天酒店入驻'
                },
                xAxis: {
                    type: 'category',
                    data: titles
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: values,
                        type: 'line',
                        smooth: true
                    }
                ]
            };

            if (option && typeof option === 'object') {
                myChart.setOption(option);
            }


            window.addEventListener('resize', myChart.resize);

        }

    }

    const initStatsHotelAddMonth=async ()=>{
        var dom = document.getElementById('stats_hotel_add_month');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });


        let {status,message,data}=await getHotelStatsMonths({});
        console.log(data)
        if(status==0){
            let map=new Map();
            data.forEach(t=>{
                map.set(t.index,t);
            });
            let now=moment();
            let titles=[];
            let values=[];

            now.add('months', -6);
            let key=now.format('yyyy-MM');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)

            now.add('months', 1);
            key=now.format('yyyy-MM');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)

            now.add('months', 1);
            key=now.format('yyyy-MM');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)

            now.add('months', 1);
            key=now.format('yyyy-MM');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)

            now.add('months', 1);
            key=now.format('yyyy-MM');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)

            now.add('months', 1);
            key=now.format('yyyy-MM');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)

            now.add('months', 1);
            key=now.format('yyyy-MM');
            titles.push(key);
            values.push(map.get(key)?map.get(key).count:0)


            var option;

            option = {
                title:{
                    text:'酒店入驻月统计'
                },
                xAxis: {
                    type: 'category',
                    data: titles
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: values,
                        type: 'line',
                        smooth: true
                    }
                ]
            };

            if (option && typeof option === 'object') {
                myChart.setOption(option);
            }

            window.addEventListener('resize', myChart.resize);

        }

    }

    return (
        <>
            <h3>数据概览</h3>
            <Space  direction="vertical" style={{width:'100%'}}>
            <Row gutter={16}>
                <Col span={4}>
                    <Card bordered={false}>
                        <Statistic
                            title="入驻酒店"
                            value={stas.hotelCount}
                            precision={0}
                            valueStyle={{
                                color: '#3f8600',
                            }}


                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card bordered={false}>
                        <Statistic
                            title="设备总数"
                            value={stas.deviceCount}
                            precision={0}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card bordered={false}>
                        <Statistic
                            title="活跃用户"
                            value={stas.activeCount}
                            precision={0}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card bordered={false}>
                        <Statistic
                            title="订单总数"
                            value={stas.orderCount}
                            precision={0}
                            valueStyle={{
                                color: '#cf1322',
                            }}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card bordered={false}>
                        <Statistic
                            title="订单金额"
                            value={stas.orderAmount}
                            precision={2}
                            valueStyle={{
                                color: '#cf1322',
                            }}
                            suffix="¥"
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={10}>
                    <Card bordered={false}>
                        <div id="stats_hotel_add_day" style={{ width: '100%', height: 400 }}></div>
                    </Card>
                </Col>
                <Col span={10}>
                    <Card bordered={false}>
                        <div id="stats_hotel_add_month" style={{ width: '100%', height: 400 }}></div>
                    </Card>
                </Col>
            </Row>
            </Space>
        </>
    );


}