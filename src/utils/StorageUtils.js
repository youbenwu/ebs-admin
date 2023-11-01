

export const saveUser=(data)=>{
    localStorage.setItem("user",JSON.stringify(data));
    localStorage.setItem("userId",data.id);
    // if(data.orgs!=null&&data.orgs.length>0){
    //     localStorage.setItem("targetId",data.orgs[0].targetId);
    //     localStorage.setItem("orgId",data.orgs[0].orgId);
    //     localStorage.setItem("orgType",data.orgs[0].orgType);
    //     localStorage.setItem("sysId",data.orgs[0].sysId);
    // }
}

export const saveSys=(sys)=>{
    localStorage.setItem("targetId",sys.targetId?sys.targetId:'');
    localStorage.setItem("orgId",sys.orgId);
    localStorage.setItem("orgType",sys.orgType);
    localStorage.setItem("sysId",sys.sysId?sys.sysId:'');
}

export const getUserId=()=>{
    return localStorage.getItem("userId");
}

export const getOrgId=()=>{
    return localStorage.getItem("orgId");
}

export const getOrgType=()=>{
    return localStorage.getItem("orgType");
}

export const getTargetId=()=>{
    return localStorage.getItem("targetId");
}

export const getSysId=()=>{
    return localStorage.getItem("sysId");
}

export const getHotel=()=>{
    return JSON.parse(localStorage.getItem("hotel"))
}

export const saveHotel=(data)=>{
    return localStorage.setItem("hotel",JSON.stringify(data));
}