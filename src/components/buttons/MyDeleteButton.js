import React from 'react';
import {Button, Popconfirm} from 'antd';


export default function MyDeleteButton ({onConfirm,loading}) {


    return (
        <Popconfirm
            title="提示"
            description="确定删除该条记录吗?"
            onConfirm={onConfirm}
            onCancel={()=>{}}
            okText="确定"
            cancelText="取消"
        >
            <Button size="small" loading={loading}>删除</Button>
        </Popconfirm>
    );

}
