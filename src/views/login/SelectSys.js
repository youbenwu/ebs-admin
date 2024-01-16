import React, {useState,useImperativeHandle} from "react"
import { Space,Button,Modal,Select} from "antd";

export default function SelectSys ({cref,onSelected}) {


    const [open, setOpen] = useState(false);

    const [orgs, setOrgs] = useState([]);

    const [value, setValue] = useState();

    useImperativeHandle(cref, () => ({
        showModel: (orgs) => {
            orgs=orgs.map(o=>{
                return {
                    ...o,
                    label:o.name,
                    value:o.id,
                };
            });
            setOrgs(orgs);
            setOpen(true);
        }
    }));

    const handleOk = () => {
        if(value!=null){
            let org=orgs.find(t=>t.value===value);
            onSelected(org);
            setOpen(false);
        }
    };


    return (
        <>
            <Modal
                open={open}
                title="请选择登录主体"
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
                        setValue(e);
                    }}
                    style={{ width: '100%' }}
                    options={orgs}
                 />

            </Modal>
        </>
    );

}

