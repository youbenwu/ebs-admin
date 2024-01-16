// 遍历树形结构的方法
export const traverseTree=(node, callback)=> {
  callback(node)
  if (node.children && node.children.length) {
    node.children.forEach(child => {
      traverseTree(child, callback)
    })
  }
}

//基于深度优先搜索DFS的实现
export const  findNodeByDFS=(root, callback)=> {
  let result = null
  traverseTree(root, node => {
    if (callback(node)) {
      result = node
    }
  })
  return result
}


//基于广度优先搜索BFS的实现
export const  findNodeByBFS=(root, callback)=> {
  const queue = [root]
  while (queue.length) {
    const node = queue.shift()
    if (callback(node)) {
      return node
    }
    if (node.children && node.children.length) {
      node.children.forEach(child => {
        queue.push(child)
      })
    }
  }
  return null
}




// 遍历树形结构的方法
export const  tree_traverseTree=(tree, callback)=> {
  tree.forEach(child => {
    traverseTree(child, callback)
  })
}


export const  tree_findAllPath=(tree)=>{
  const paths = [];//记录路径的arr
  for (let i = 0; i < tree.length; i++) {//遍历同层次所有节点
    if (tree[i].children && tree[i].children.length) {
      const res = tree_findAllPath(tree[i].children);//如果有子节点便继续深入，直到到达叶子节点
      for (let j = 0; j < res.length; j++) {
        paths.push([tree[i], ...res[j]]);//子节点返回后将其返回的路径与自身拼接
      }
    } else {
      paths.push([tree[i]]);//没有子节点的话，直接将自身拼接到paths中
    }
  }
  return paths;//返回
}


export const  tree_findNodeById=(tree, id)=> {
  for (let i=0;i<tree.length;i++){
    let node=findNodeByDFS(tree[i], node => node.id === id);
    if(node){
      return node;
    }
  }
}


export const  tree_findPathById=(tree,id) =>{

  const paths=tree_findAllPath(tree);

  for(let i=0;i<paths.length;i++){
    let path=paths[i];
    let node=path[path.length-1];
    if(node.id===id)
      return path;
  }

  return null;

}




