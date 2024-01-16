import React, { Component } from 'react';
import Quill from "quill";
import { Button, Upload } from 'antd';

require("quill/dist/quill.snow.css");

/**
 * 取值 let goods_desc = $(".detailContainer").find(".simditor-body").html();
 */
class QuillRichText extends Component {
    state = {
        textContent:''
    }
    componentDidMount = () => {
        this.initEditor();
    };

    //初始化编辑器
    initEditor = () => {
        let that = this;
        // Add fonts to whitelist
        /*----自定义字体 ----*/
        //1.需先引入需要展示的字体样式  然后加入到字体白名单里
        const Font = Quill.import('formats/font');
        // We do not add Aref Ruqaa since it is the default
        let fonts = [
            'SimSun',
            'SimHei',
            'Microsoft-YaHei',
            'KaiTi',
            'FangSong',
            'Arial',
            'Times-New-Roman',
            'monospace',
            'serif',
            'consolas'
        ];
        Font.whitelist = fonts; //将字体加入到白名单
        Quill.register(Font, true);
        let toolbarOptions = [
            ['bold', 'italic', 'underline'],        // toggled buttons
            [{ 'list': 'bullet' }],
            ["link","image"],              // custom button values
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': fonts},'video']
        ];
        //   "SimSun","SimHei","Microsoft-YaHei","KaiTi","FangSong","Arial","Times New Roman","sans-serif"
        let config = {
            debug: 'info',
            modules: {
                toolbar: toolbarOptions
            },
            placeholder: '请输入内容...',
            readOnly: false,
            theme: 'snow'
        };
        this.editor = new Quill('#editor', config);// 初始化编辑器
        let toolbar = this.editor.getModule('toolbar');
        // console.log(this.props)
        this.editor.container.firstChild.innerHTML = this.props.value; //赋值富文本  此处用于父组件传值给子组件quill（主要用于编辑页面，只做添加页面此处可忽略）
        //点击quill的上传图片转接到oss上传的图标上
        toolbar.addHandler('image', () => {

        });
    };



    render() {
        let placeholder = ''
        const { value,pla } = this.props;
        // pla ? placeholder = pla : placeholder = '请输入内容'
        return (
            <div className="quillRich">
                <div id="editor" ref="editor">
                </div>
                {/* 此处上传隐藏 只做上传使用 */}
                <Upload
                    listType="picture-card"
                    showUploadList="false"
                    className="editUpload"
                    action=""
                    showUploadList={false}
                    accept=".png,.jpg,.jpeg"
                >
                </Upload>
            </div>
        );
    }
}

export default QuillRichText;