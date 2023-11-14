import React, {useState,useImperativeHandle} from "react"
import { Space,Button,Modal,Radio,Select ,notification} from "antd";
import {saveOrg , saveHotel} from "../../utils/StorageUtils";
import {getHotelInfo} from "../../api/HotelAdminApi";

export default function SelectSys ({cref,onOk}) {


    const [open, setOpen] = useState(false);

    const [orgs, setOrgs] = useState([]);

    const [value, setValue] = useState();

    useImperativeHandle(cref, () => ({
        showModel: (orgs) => {
            orgs=orgs.map(o=>{
                return {
                    ...o,
                    label:o.orgName,
                    value:o.orgId+'-'+o.sysId,
                };
            });
            setOrgs(orgs);
            setOpen(true);
        }
    }));

    const handleOk = () => {
        if(value!=null){
            let v={};
            orgs.forEach(t=>{
                if(t.value==value){
                    v=t;
                }
            })
            saveOrg(v);
            onOk(true);
            console.log("=======");
            console.log(v);
            if(v.orgType==6) {
                loadData(v.targetId)
            }
            setOpen(false);
        }
    };

    const loadData=async (id)=>{
        let {status,message,data}=await getHotelInfo({id});
        if(status==0){
            saveHotel(data)
        }else{
            notification.error({message:"系统提示",description:message});
        }
    }


    return (
        <>
            <Modal
                open={open}
                title="请选择登陆主体"
                onCancel={()=>{}}
                onOk={handleOk}
                footer={[
                    <Button key="submit" type="primary"  onClick={handleOk}>
                        确定
                    </Button>
                ]}
            >


                <Select
                    placeholder="请选择"
                    onChange={(e)=>{
                        //console.log(e);
                        setValue(e);
                    }}
                    style={{ width: '100%' }}
                    options={orgs}
                 />

            </Modal>
        </>
    );

}

