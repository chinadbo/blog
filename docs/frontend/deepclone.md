# JavaScript如何深度拷贝一个数组


![](https://user-gold-cdn.xitu.io/2019/3/6/169521d1f4660caa?w=698&h=330&f=png&s=63412)
有两种数组拷贝类型：**浅拷贝 & 深拷贝**。**浅拷贝**只会拷贝数组的第一层，剩下的会引用。如果你需要一个嵌套的数组的拷贝，那需要你去深度拷贝这个数组。**深拷贝**，选择JSON方法或者Lodsh库吧👍


```
const numbers = [1, [2], [3, [4]], 5];
// Using JavaScript
JSON.parse(JSON.stringify(numbers));
// Using Lodash
_.cloneDeep(objects);
```
## 数组是引用类型
为了搞清楚为什么有两种类型的拷贝，我们来深度了解一下基础知识然后解释什么是引用类型。

与原始类型（number、string）不同，数组是引用类型。这意味着当你把一个数组赋值给一个变量，你是将数组的内存地址而非数组本身赋给变量。 😱

## 拷贝值类型
这里没什么大不了的，我们创建一个`value`的拷贝。当我们改变`valueCopy`的值，它不会影响原来的`value`值。同理，当我们改变原来的值它也不会影响拷贝后的值。很好👍

```
let value = 3;
let valueCopy = value; // create copy
console.log(valueCopy); // 3
// Change valueCopy
valueCopy = 100
console.log(valueCopy); // 100
// ✅ Original NOT affected 
console.log(value); // 3
```
## 拷贝引用类型
好的，这里就会有点奇怪了！我们用同样的方法拷贝数组。

```
let array = [1,2,3];
let arrayCopy = array; // create copy
console.log(arrayCopy); // [1,2,3];
// Change 1st element of the array
arrayCopy[0] = '👻';
console.log(arrayCopy); // [ '👻', 2, 3 ]
// ❌Original got affected
console.log(array); // [ '👻', 2, 3 ]
```
为什么原来的数组也受到了影响呢？好了，是因为：**你拷贝的不是你拷贝的**。说人话，意思就是你拷贝的只是**指向数组内存空间的指针**。引用类型不包含值，它们是指向内存中值的**指针**。

### 拷贝引用类型的方法

解决方法就是拷贝值而不是指针。


```
let array = [1,2,3];
let arrayCopy = [...array]; // create TRUE copy
console.log(arrayCopy); // [1,2,3];
// Change 1st element of the array
arrayCopy[0] = '👻';
console.log(arrayCopy); // [ '👻', 2, 3 ]
// ✅ Original NOT affected 
console.log(array); // [ 1, 2, 3 ]
```

## 浅 & 深 拷贝
当我使用展开扩展符号`...`来拷贝一个数组，我只是浅拷贝了一个数组。如果数组是嵌套或者多维的，这就不奏效了。

```
let nestedArray = [1, [2], 3];
let arrayCopy = [...nestedArray];
// Make some changes
arrayCopy[0] = '👻'; // change shallow element
arrayCopy[1][0] = '💩'; // change nested element
console.log(arrayCopy); // [ '👻', [ '💩' ], 3 ]
// ❌ Nested array got affected
console.log(nestedArray); // [ 1, [ '💩' ], 3 ]
```
如上，浅拷贝首层数组表现良好，然而，更改了嵌套数组元素，原始数组也受到影响💩。为了解决这个问题，就要用到**深拷贝**了。


```
let nestedArray = [1, [2], 3];
let arrayCopy = JSON.parse(JSON.stringify(nestedArray));
// Make some changes
arrayCopy[0] = '👻'; // change shallow element
arrayCopy[1][0] = '💩'; // change nested element
console.log(arrayCopy); // [ '👻', [ '💩' ], 3 ]
// ✅ Nested array NOT affected
console.log(nestedArray); //  1, [ 2 ], 3 ]
```
所以，这就完事了吗？要不要手写一个深拷贝引用类型的方法？

```
const deepClone = obj => {
    const isObject = args => (typeof args === 'object' || typeof args === 'function') && typeof args !== null
    if (!isObject) throw new Error('Not Reference Types')
    let newObj = Array.isArray(obj) ? [...obj] : { ...obj }
    Reflect.ownKeys(newObj).map(key => {
        newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
    })
    return newObj
}
```

✅ ✅ ✅ 