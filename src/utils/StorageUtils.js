
export const saveLocalSys=(data)=>{
    return localStorage.setItem("sys",JSON.stringify(data));
}

export const getLocalSys=()=>{
    return JSON.parse(localStorage.getItem("sys"))
}


export const saveLocalUser=(data)=>{
    return localStorage.setItem("user",JSON.stringify(data));
}

export const getLocalUser=()=>{
    return JSON.parse(localStorage.getItem("user"))
}

export const saveLocalOrg=(data)=>{
    return localStorage.setItem("org",JSON.stringify(data));
}

export const getLocalOrg=()=>{
    return JSON.parse(localStorage.getItem("org"))
}


export const getLocalHotel=()=>{
    return JSON.parse(localStorage.getItem("hotel"))
}

export const saveLocalHotel=(data)=>{
    return localStorage.setItem("hotel",JSON.stringify(data));
}

export const getLocalMerchant=()=>{
    return JSON.parse(localStorage.getItem("merchant"))
}

export const saveLocalMerchant=(data)=>{
    return localStorage.setItem("merchant",JSON.stringify(data));
}