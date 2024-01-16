import React, {useEffect, useState,useRef} from "react"
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'



/**
 * 这里用函数式组件
 */



export default function EditorView(props) {

    const [value, setValue] = useState();

    const quillRef=useRef();

    useEffect(()=>{
        setValue(props.value);
    },[props]);

    useEffect(()=>{
        props.onChange(value);
    },[value]);

    const imageHandler = () => {
        console.log('=======')
        //let editor=quillRef.current.editor;

        // const input = document.createElement('input')
        // input.setAttribute('type', 'file')
        // input.setAttribute('accept', 'image/*')
        // input.click()
        // input.onchange = async () => {
        //     const file = input.files[0]
        //     const formData = new FormData()
        //     formData.append('quill-image', file)
        //     console.log(file)
        // }

        //console.log(editor)
    };


    // const modules = {
    //     toolbar: {
    //         container: [
    //             ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    //             ['blockquote', 'code-block'],
    //             ['link', 'image'],
    //             [{ header: 1 }, { header: 2 }], // custom button values
    //             [{ list: 'ordered' }, { list: 'bullet' }],
    //             [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    //             [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    //             [{ direction: 'rtl' }], // text direction
    //             // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    //             [{ header: [1, 2, 3, 4, 5, 6, false] }],
    //             [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    //             [{ font: [] }],
    //             [{ align: [] }],
    //             ['clean'], // remove formatting button
    //         ],
    //         handlers: {
    //             image() {
    //                 imageHandler();
    //             },
    //         },
    //     },
    // };

    const quillOption = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ align: [] }],
                [{ color: [] }, { background: [] }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                'image':imageHandler()
            },

        }
    }


    return (
        <ReactQuill
            ref={quillRef}
            style={{
                height: '300px',
                padding:'0px',
                overflow: 'hidden',
                borderBottom: '1px solid #ccc',
            }}
            theme='snow'
            value={value}
            onChange={(v)=>{
                setValue(v);
            }}
            modules={quillOption}
            className='ql-editor'
        />
    );
}
