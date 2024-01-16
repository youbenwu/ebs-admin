import React, {} from "react"
import {Row,Col,Image,Card, Flex,Space} from "antd";


export default function AdvertInfoView ({data}) {


    return (
        <Card style={{margin:'10px 0px'}}>
            <Space direction={"vertical"} style={{width:'100%'}}>
                <Row>
                    <Col span={6} style={{textAlign:'right'}}>
                        广告名称：
                    </Col>
                    <Col span={18}>
                        {data.title}
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{textAlign:'right'}}>
                        广告副标题：
                    </Col>
                    <Col span={18}>
                        {data.subtitle??'无'}
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{textAlign:'right'}}>
                        广告图片：
                    </Col>
                    <Col span={18}>
                        <Image.PreviewGroup
                            preview={{
                                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                            }}
                        >
                            <Flex wrap="wrap" gap="small">
                                {data.images?.split(',').map(t=>{
                                    return <Image width={100} height={100} src={t} />
                                })}
                            </Flex>

                        </Image.PreviewGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{textAlign:'right'}}>
                        广告视频：
                    </Col>
                    <Col span={18}>
                        {data.video?(<video width={200} height={200} src={data.video}/>):('无')}
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{textAlign:'right'}}>
                        广告链接：
                    </Col>
                    <Col span={18}>
                        {data.url?(<a onClick={()=>{window.open(`${data.url}`, '_blank')}}>{data.url}</a>):('无')}
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{textAlign:'right'}}>
                        广告二维码：
                    </Col>
                    <Col span={18}>
                        {data.qrCode?(<img src={data.qrCode} width={100}></img>):('无')}
                    </Col>
                </Row>
            </Space>
        </Card>
    );


}