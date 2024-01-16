import axios from "../utils/request";



// /api/admin/portal/article/category/list
// 获取文章类别列表
export const getArticleCategoryList=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/article/category/list',params);
    return data;
}


// /api/admin/portal/article/category/save
// 保存文章类别
export const saveArticleCategory=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/article/category/save',params);
    return data;
}


// /api/admin/portal/article/category/delete
// 删除文章类别
export const deleteArticleCategory=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/article/category/delete',params);
    return data;
}


// /api/admin/portal/article/category/setStatus
// 设置文章类别状态
export const setArticleCategoryStatus=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/article/category/setStatus',params);
    return data;
}


// /api/admin/portal/article/save
// 保存文章
export const saveArticle=async (params)=>{
    let {data}=await axios.post('/api/admin/portal/article/save',params);
    return data;
}

// /api/admin/portal/article/page
// 获取文章列表
export const getArticlePage=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/article/page',params);
    return data;
}

// /api/admin/portal/article/get
// 获取文章信息
export const getArticle=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/article/get',params);
    return data;
}

// /api/admin/portal/article/setStatus
// 设置文章状态
export const setArticleStatus=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/article/setStatus',params);
    return data;
}



export const deleteArticle=async (params)=>{
    let {data}=await axios.postForm('/api/admin/portal/article/delete',params);
    return data;
}