import React, {useState,useImperativeHandle} from "react"
import { Space,Button,Modal,Radio,Select} from "antd";
import {saveSys} from "../../utils/StorageUtils";

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
            console.log(v);
            saveSys(v);
            onOk(true);
            setOpen(false);
        }
    };


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

