import React, {useState,useEffect,useImperativeHandle} from "react"
import {getPermissionListBySys, getRolePermissionList, setRolePermissionList} from "../../api/OrgAdminApi";
import { notification,Button,Modal,Cascader} from "antd";
import { getSysId} from "../../utils/StorageUtils";


const { SHOW_CHILD } = Cascader;


export default function SelectPerList ({cref,onEditFinish}) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [data, setData] = useState([]);

    const [value, setValue] = useState([]);

    const [roleId, setRoleId] = useState(0);

    useEffect(()=>{
        loadData().then(()=>{});
    },[])

    useImperativeHandle(cref, () => ({
        showModel: ({data}) => {
            openModel({data});
        }
    }));


   const openModel=({data})=>{
       setValue([]);
       loadSelsData(data).then(()=>{});
       setRoleId(data.id);
       setOpen(true);
   }


   const loadData= async ()=>{
       let {status,message,data}=await getPermissionListBySys({sysId:getSysId()});
       if(status==0){
           data=coverData(data);
           //console.log(data)
           setData(data);
       }else{
           notification.error({message:"系统提示",description:message});
       }
   }

    const loadSelsData= async (d)=>{
        //console.log(d.id)
        let {status,message,data}=await getRolePermissionList({roleId:d.id});
        if(status==0){
            data=coverValueData(data);
            //console.log(data)
            setValue(data);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const saveSelsData= async ()=>{
        setLoading(true);
        let pers=getPers();

        let {status,message,data}=await setRolePermissionList({roleId:roleId,permissions:pers});
        setLoading(false);
        if(status==0){
            notification.info({message:"系统提示",description:message});
            onEditFinish(true);
            setOpen(false);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const getPers=()=>{
        let pers=[];
        value.forEach(r=>{
           r.forEach(p=>{
               pers.push(p);
           })
        })
        pers= [...new Set(pers)];
        return pers;
    }

    const coverValueData=(d)=>{
        let pers=[];
        d.forEach(t=>{
            pers.push(t.permissionId);
        })

        let v=getAllSels(pers);

        return v;
    }


    const getAllSels=(sels)=>{
        let set =new Set(sels);
        let allSels=[];
       data.forEach(t=>{
           t.children.forEach(t2=>{
               t2.children.forEach(t3=>{
                   if(set.has(t3.value)) {
                       allSels.push([t.value, t2.value, t3.value]);
                   }
               })
           })
       })
        return allSels;
    }

   const coverData=(data)=>{
       if(data==null||data.length==0)
           return data;
       //console.log(data)
       return data.map(t=>{
           return {
               value:t.id,
               label:t.title,
               leaf:t.leaf,
               children:coverData(t.children),
           };
       });

   }

    const onCancel = () => {
        setOpen(false);
    };

    const handleOk = () => {
        saveSelsData().then(()=>{});
    };

    const onChange = (value) => {
        //console.log(value);
        setValue(value);
    };

    return (
        <>
            <Modal
                open={open}
                title="选择权限"
                onCancel={onCancel}
                onOk={handleOk}
                footer={[
                    <Button key="back" onClick={onCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        保存
                    </Button>
                ]}
            >
                <Cascader
                    style={{ width: '100%' }}
                    options={data}
                    onChange={onChange}
                    multiple
                    maxTagCount="responsive"
                    showCheckedStrategy={SHOW_CHILD}
                    defaultValue={[]}
                    value={value}
                />

            </Modal>
        </>
    );

}

