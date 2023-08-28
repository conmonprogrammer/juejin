import '@wangeditor/editor/dist/css/style.css'
import { createEditor, createToolbar } from '@wangeditor/editor'
import { publishArticle } from '../api/api'
import { getCookie } from '../api/cookie'

//登录状态验证
if (!getCookie('tel')) {//登录已失效
    window.location.href = './index.html'
}

//引入富文本编辑器
const editorConfig = {
    placeholder: 'Type here...'
}
const editor = createEditor({
    selector: '#editor-container',
    html: '<p><br></p>',
    config: editorConfig,
    mode: 'default', // or 'simple'
})

const toolbarConfig = {}

const toolbar = createToolbar({
    editor,
    selector: '#toolbar-container',
    config: toolbarConfig,
    mode: 'default', // or 'simple'
})

let publishArticleBtn = document.querySelector('.publishArticleBtn');
let titleInput = document.querySelector('.titleInput');
let tagName = document.querySelector('.tagName');
let abstractInput = document.querySelector('.abstractInput');
let coverUploadInput = document.querySelector('#coverupload');
let headimg = document.querySelector('.heading');
let cancellationButton = document.querySelector('.cancellationButton');
let confirmReleaseButton = document.querySelector('.confirmReleaseButton');
let rightnav = document.querySelector('.rightnav');

let formData = new FormData();

//封面预览
(coverUploadInput as HTMLInputElement).onchange = function () {
    let coverurl = (this as HTMLInputElement).files;
    if (coverurl) {
        formData.append('coverurl', coverurl[0]);
        //预览
        let fr = new FileReader();
        fr.readAsDataURL(coverurl[0]);
        fr.onload = function () {
            (headimg as HTMLImageElement).src = fr.result as string;
        }
    }
};
//点击发布打开发布界面
(publishArticleBtn as HTMLButtonElement).onclick = function() {
    (rightnav as HTMLElement).style.display = 'block';
};
//点击取消关闭发布界面
(cancellationButton as HTMLElement).onclick = function() {
    (rightnav as HTMLElement).style.display = 'none';
};

//点击确定并发布上传文章数据
(confirmReleaseButton as HTMLButtonElement).onclick = function () {
    //获取数据
    let title = (titleInput as HTMLInputElement).value;
    let tag = (tagName as HTMLSelectElement).value;
    let abstract = (abstractInput as HTMLTextAreaElement).value;
    let content = editor.getHtml();

    //数据检验
    if (title.length == 0 || title.length > 30) {
        alert('标题字数有问题')
    } else if (abstract.length == 0 || abstract.length > 100) {
        alert('摘要字数有问题')
    } else if (content.length == 0) {
        alert('正文内容不得为空')
    } else {
        formData.set('title', title);
        formData.set('abstract', abstract);
        formData.set('tag', tag);
        formData.set('content', content);
        //发起网络请求
        publishArticle(formData)
            .then(r => {
                console.log(r.data);
                alert(r.data.data);
            })
    }
}


