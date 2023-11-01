export const deepCopy = (obj) => {
  const objCopy = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      // 判断 obj 子元素是否为对象，如果是递归复制，否简单复制
      if (obj[key] && typeof obj[key] === "object") {
        objCopy[key] = deepCopy(obj[key]);
      } else {
        objCopy[key] = obj[key];
      }
    }
  }
  return objCopy;
};
