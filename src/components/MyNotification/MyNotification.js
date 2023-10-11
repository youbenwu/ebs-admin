import React, {forwardRef,useImperativeHandle,useRef} from 'react';
import { notification } from 'antd';

export default function MyNotification({cref}) {

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = ({type='info',message='系统提示',description}) => {
        api[type]({
            message: message,
            description:description
        });
    };

    // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
    useImperativeHandle(cref, () => ({
        //showInfo  就是暴露给父组件的方法
        showInfo: ({description}) => {
            openNotificationWithIcon({type:'info',description:description});
        },
        showError: ({description}) => {
            openNotificationWithIcon({type:'error',description:description});
        },
        showSuccess:({description}) => {
            openNotificationWithIcon({type:'success',description:description});
        },
        showWarning:({description}) => {
            openNotificationWithIcon({type:'warning',description:description});
        },
    }));
    return (
        <>
            {contextHolder}
        </>
    );

}
