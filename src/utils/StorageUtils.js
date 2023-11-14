

export const saveUser=(data)=>{
    return localStorage.setItem("user",JSON.stringify(data));
}

export const getUser=()=>{
    return JSON.parse(localStorage.getItem("user"))
}

export const saveOrg=(data)=>{
    return localStorage.setItem("org",JSON.stringify(data));
}

export const getOrg=()=>{
    return JSON.parse(localStorage.getItem("org"))
}

export const getHotel=()=>{
    return JSON.parse(localStorage.getItem("hotel"))
}

export const saveHotel=(data)=>{
    return localStorage.setItem("hotel",JSON.stringify(data));
}