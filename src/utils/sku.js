/**
 *
 * id_${item.id}：表示某个输入项的选中值；
 spDataList：表示整个组合的所有输入项及其选中值；
 spData：表示 spDataList 序列化后的字符串；
 enable：表示该组合是否可用；
 pic：表示组合对应的图片路径。

 作者：我把今生当成了来世
 链接：https://www.jianshu.com/p/d1a46993fc7c
 来源：简书
 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 *
 * **/
export const  generateCombinations=(source) =>{
  const combinations = [];

  const generateHelper=(index, current, spDataList)=> {
    if (index === source.length) {
      combinations.push({...current,name:spDataList.map(t=>t.value.value).join(' '), items:spDataList});
      return;
    }

    const item = source[index];

    for (let i = 0; i < item.items.length; i++) {

      const newCurrent = {...current};

      newCurrent.enable = (newCurrent.enable??true)&&item.items[i].selected;

      const newSpData = [...spDataList, {name: item.name, value: item.items[i]}];
      generateHelper(index + 1, newCurrent, newSpData);

    }
  }

  generateHelper(0, {}, []);
  return combinations;
}