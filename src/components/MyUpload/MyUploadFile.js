import React, { useState,useEffect } from 'react';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload,Button } from 'antd';
import {baseUrl} from "../../config/config";


const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 200;
    if (!isLt2M) {
        message.error('Image must smaller than 200MB!');
    }
    return  isLt2M;
};


export default function MyUploadFile ({onChange}) {


    const [loading, setLoading] = useState(false);

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            if(info.file.response.status==0){
                onChange(info.file.response.data.file[0]);
            }else{
                message.error(info.file.response.message);
            }
        }else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败.`);
        }
        setLoading(false);
    };


    return (
        <>
            <Upload
                name="file"
                action={baseUrl+"/api/data/media/upload/file"}
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                <Button icon={<UploadOutlined />} loading={loading}>上传</Button>
            </Upload>
        </>
    );

}
