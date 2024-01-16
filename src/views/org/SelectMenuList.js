import React, {useState,useEffect,useImperativeHandle} from "react"
import {
    getMenuListBySys, getRoleMenuList, setRoleMenuList
} from "../../api/OrgAdminApi";
import { notification,Button,Modal,Cascader} from "antd";
import {getLocalOrg, getLocalSys} from "../../utils/StorageUtils";


const { SHOW_CHILD } = Cascader;


export default function SelectMenuList ({cref,onEditFinish}) {

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
       let {status,message,data}=await getMenuListBySys({sysId:getLocalSys().id});

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
        let {status,message,data}=await getRoleMenuList({roleId:d.id});
        //console.log(data)
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
        let menus=getMenus();

        let {status,message,data}=await setRoleMenuList({roleId:roleId,menus:menus});
        setLoading(false);
        if(status==0){
            notification.info({message:"系统提示",description:message});
            onEditFinish(true);
            setOpen(false);
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }

    const getMenus=()=>{
        let menus=[];
        value.forEach(r=>{
           r.forEach(p=>{
               menus.push(p);
           })
        })
        menus= [...new Set(menus)];
        return menus;
    }

    const coverValueData=(d)=>{
        let menus=[];
        d.forEach(t=>{
            menus.push(t.menuId);
        })

        let v=getAllSels(menus);

        return v;
    }


    const getAllSels=(sels)=>{
        let set =new Set(sels);
        let allSels=[];
       data.forEach(t=>{
           if(t.leaf){
               if(set.has(t.value)) {
                   allSels.push([t.value]);
               }
           }else{
               t.children.forEach(t2=>{
                   if(t2.leaf){
                       if(set.has(t2.value)) {
                           allSels.push([t.value, t2.value]);
                       }
                   }else{
                       t2.children.forEach(t3=>{
                           if(t3.leaf){
                               if(set.has(t3.value)) {
                                   allSels.push([t.value, t2.value,t3.value]);
                               }
                           }
                       })
                   }
               })
           }
       })
        return allSels;
    }

   const coverData=(data)=>{
       if(data==null||data.length==0)
           return [];
       //console.log(data)
       return data.map(t=>{
           return {
               value:t.id,
               label:t.name,
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

