import React, {useState, useEffect, useRef} from "react"
import {Tag,Input,theme} from "antd";
import { PlusOutlined } from '@ant-design/icons';

export default function MsgTypeTagsEditView (props) {

    const { token } = theme.useToken();

    const [value,setValue]=useState([]);

    const [inputValue, setInputValue] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [inputVisible, setInputVisible] = useState(false);

    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const [editInputValue2, setEditInputValue2] = useState('');


    const inputRef = useRef(null);
    const inputRef2 = useRef(null);
    const editInputRef = useRef(null);
    const editInputRef2 = useRef(null);

    useEffect(()=>{

        setValue(props.value??[])

        console.log(props);

    },[props])

    useEffect(()=>{

        props.onChange(value)

    },[value])

    const handleClose = (removedTag) => {
        const newValue = value.filter((tag) => tag !== removedTag);
        console.log(newValue);
        setValue(newValue);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputChange2 = (e) => {
        setInputValue2(e.target.value);
    };

    const handleInputConfirm = () => {

    };

    const handleInputConfirm2 = () => {
        if (inputValue && inputValue2) {
            if (value.filter(t => t.name === inputValue).length == 0) {
                setValue([...value, {
                    name: inputValue,
                    value: inputValue2,
                }]);

            }
        }
        setInputVisible(false);
        setInputValue('');
        setInputValue2('');
    };

    const handleEditInputChange = (e) => {
        setEditInputValue(e.target.value);
    };
    const handleEditInputChange2 = (e) => {
        setEditInputValue2(e.target.value);
    };
    const handleEditInputConfirm = () => {
        const newValue = [...value];
        newValue[editInputIndex] = {
            name:editInputValue,
            value:editInputValue2,
        };
        setValue(newValue);
        setEditInputIndex(-1);
        setEditInputValue('');
        setEditInputValue2('');
    };

    const tagInputStyle = {
        width: 64,
        height: 22,
        marginInlineEnd: 8,
        verticalAlign: 'top',
    };
    const tagPlusStyle = {
        height: 22,
        background: token.colorBgContainer,
        borderStyle: 'dashed',
    };

    const editInput=(tag)=>(
        <>
            <Input
                ref={editInputRef}
                key={tag}
                size="small"
                style={tagInputStyle}
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
            />
            <Input
                ref={editInputRef2}
                key={tag}
                size="small"
                style={tagInputStyle}
                value={editInputValue2}
                onChange={handleEditInputChange2}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
            />
        </>
    )


    const tagElem =(tag,index)=> (
        <Tag
            key={tag}
            closable={true}
            style={{
                userSelect: 'none',
            }}
            onClose={() => handleClose(tag)}
        >
            <span
                onDoubleClick={(e) => {
                    setEditInputIndex(index);
                    setEditInputValue(tag.name);
                    setEditInputValue2(tag.value);
                    e.preventDefault();
                }}
            >
              {tag.name+'${'+tag.value+'}'}
            </span>
        </Tag>
    );

    const input=(
        <>
            <Input
                ref={inputRef}
                type="text"
                size="small"
                placeholder={"名称"}
                style={tagInputStyle}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
            />

            <Input
                ref={inputRef2}
                type="text"
                size="small"
                placeholder={"值"}
                style={tagInputStyle}
                value={inputValue2}
                onChange={handleInputChange2}
                onBlur={handleInputConfirm2}
                onPressEnter={handleInputConfirm2}
            />

        </>
    )


    const add=(
        <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
            新标签
        </Tag>
    )


    return (
        <>
            {value.map((tag, index) => {
                return editInputIndex===index?editInput(tag):tagElem(tag,index)
            })}
            {inputVisible?input:add}
        </>
    );


}