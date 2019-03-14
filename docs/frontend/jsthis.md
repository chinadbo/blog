# 揭秘JavaScript中“神秘”的this关键字


![](https://user-gold-cdn.xitu.io/2019/3/5/1694ba9cc370a928?w=800&h=533&f=png&s=584832)

当我开始学习`JavaScript`时，花了一些时间来理解`JavaScript`中的`this`关键字并且能够快速识别`this`关键字所指向的对象。我发现理解`this`关键字最困难的事情是，您通常会忘记在您已阅读或观看过一些`JavaScript`课程或资源中解释的不同案例情况。在`ES6`中引入箭头函数后，事情变得更加混乱，因为箭头函数`this`以不同的方式处理关键字。我想写这篇文章来陈述我学到的东西，并尝试以一种可以帮助任何正在学习`JavaScript`并且难以理解`this`关键字的人的方式来解释它。

您可能知道，执行任何`JavaScript`行的环境（或`scope`）称为“**执行上下文**”。**`Javascript`运行时**维护这些执行上下文的堆栈，并且当前正在执行存在于该堆栈顶部的执行上下文。`this`变量引用的对象每次更改执行上下文时都会更改。

默认情况下，执行上下文是全局的，这意味着如果代码作为简单函数调用的一部分执行，则该`this`变量将引用**全局对象**。在浏览器的情况下，全局对象是`window`对象。例如，在`Node.js`环境中，this值是一个特殊对象`global`。

例如，尝试以下简单的函数调用：

```
function foo () {
  console.log("Simple function call");
  console.log(this === window);
}
foo();
```
调用`foo()`，得到输出：

```
“Simple function call”
true
```
证明这里的`this`指向全局对象，此例中为`window`。

注意，如果实在**严格模式**下，`this`的值将是`undefined`，因为在严格模式下全局对象指向`undefined`而不是`window`。

试一下如下示例：

```
function foo () {
  'use strict';
  console.log("Simple function call");
  console.log(this === window);
}
foo();
```
输出：

```
“Simple function call”
false
```
我们再来试下有**构造函数**的：

```
function Person(first_name, last_name) {
    this.first_name = first_name;
    this.last_name = last_name;
  
    this.displayName = function() {
        console.log(`Name: ${this.first_name} ${this.last_name}`);
    };
}
```
创建`Person`实例：

```
let john = new Person('John', 'Reid');
john.displayName();
```
得到结果：

```
"Name: John Reid"
```
这里发生了什么？当我们调用 `new Person`，`JavaScript`会在`Person`函数内创建一个新对象并把它保存为`this`。接着，`first_name`, `last_name` 和 `displayName` 属性会被添加到新创建的`this`对象上。如下：

![](https://user-gold-cdn.xitu.io/2019/3/5/1694bc389b7febfb?w=800&h=642&f=png&s=116051)

你会注意到在`Person`的**执行上下文**中创建了`this`对象，这个对象有`first_name`, `last_name` 和 `displayName` 属性。希望您能根据上图理解`this`对象是如何创建并添加属性的。

我们已经探讨了两种相关`this`绑定的普通案例我不得不提出下面这个更加困惑的例子，如下函数：

```
function simpleFunction () {
    console.log("Simple function call")
    console.log(this === window); 
}
```

我们已经知道如果像下面这样作为简单函数调用，`this`关键字将指向全局对象，此例中为`window`对象。

```
simpleFunction()
```
因此，得到输出：

```
“Simple function call”
true
```
创建一个简单的`user`对象：

```
let user = {
    count: 10,
    simpleFunction: simpleFunction,
    anotherFunction: function() {
        console.log(this === window);
    }
}
```
现在，我们有一个`simpleFunction`属性指向`simpleFunction`函数，同样添加另一个属性调用`anotherFunction`函数方法。

如果调用`user.simpleFunction()`，得到输出：

```
“Simple function call”
false
```

为什么会这样呢？因为`simpleFunction()`现在是`user`对象的一个属性，所以`this`指向这个`user`对象而不是全局对象。

当我们调用`user.anotherFunction`，也是一样的结果。`this`关键字指向`user`对象。所以，`console.log(this === window);`应该返回`false`:

```
false
```
再来，以下操作会返回什么呢？

```
let myFunction = user.anotherFunction;
myFunction();
```
现在，得到结果：

```
true
```
所以这又发生了什么？在这个例子中，我们发起普通函数调用。正如之前所知，如果一个方法以普通函数方式执行，那么`this`关键字将指向全局对象（在这个例子中是`window`对象）。所以`console.log(this === window); `输出`true`。

再看一个例子：

```
var john = {
    name: 'john',
    yearOfBirth: 1990,
    calculateAge: function() {
        console.log(this);
        console.log(2016 - this.yearOfBirth);
        function innerFunction() {
            console.log(this);
        }
        innerFunction();
    }
}
```

调用`john.calculateAge()`会发生什么呢？

```
{name: "john", yearOfBirth: 1990, calculateAge: ƒ}
26
Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
```
`calculateAge`函数内部， `this` 指向 `john`对象，但是，在`innerFunction`函数内部，`this`指向全局对象（本例中为`window`），有些人认为这是`JS`的bug，但是规则告诉我们无论何时一个普通函数被调用时，那么`this`将指向全局对象。

...

我所学的`JavaScript`函数也是一种特殊的对象，每个函数都有`call`, `apply`, `bind`方法。这些方法被用来设置函数的执行上下文的`this`值。


```
function Person(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = function() {
        console.log(`Name: ${this.firstName} ${this.lastName}`);
    }
}
```

创建两个实例：

```
let person = new Person("John", "Reed");
let person2 = new Person("Paul", "Adams");
```
调用：

```
person.displayName();
person2.displayName();
```
结果：

```
Name: John Reed
Name: Paul Adams
```
call：

```
person.displayName.call(person2);
```
上面所做的事情就是设置`this`的值为`person2`对象。因此，

```
Name: Paul Adams
```
apply：

```
person.displayName.apply([person2]);
```
得到：

```
Name: Paul Adams
```
`call`，`apply`唯一的区别就是参数的传递形式，`apply`应该传递一个数组，`call`则应该单独传递参数。

我们用`bind`来做同样的事情，`bind`返回一个新的方法，这个方法中的`this`指向传递的第一个参数。

```
let person2Display = person.displayName.bind(person2);
```
调用`person2Display`，得到`Name: Paul Adams `结果。

...

## 箭头函数

ES6中，有一个新方法定义函数。如下：

```
let displayName = (firstName, lastName) => {
    console.log(Name: ${firstName} ${lastName});
};
```
不像通常的函数，箭头函数没有他们自身的`this`关键字。他们只是简单的使用写在函数里的`this`关键字。他们有一个`this`词法变量。

ES5：

```
var box = {
    color: 'green', // 1
    position: 1, // 2
    clickMe: function() { // 3
        document.querySelector('body').addEventListener('click', function() {
            var str = 'This is box number ' + this.position + ' and it is ' + this.color; // 4
            alert(str);
        });
    }
}
```
如果调用：

```
box.clickMe()
```
弹出框内容将是`This is box number undefined and it is undefined'`.

我们一步一步来分析是怎么回事。在`//1`和`//2`行，`this`关键字能访问到`color`和`position`属性因为它指向`box`对象。在`clickMe`方法内部，`this`关键字能访问到`color`和`position`属性因为它也指向`box`对象。但是，`clickMe`方法为`querySelector`方法定义了一个回调函数，然后这个回调函数以普通函数的形式调用，所以`this`指向全局对象而非`box`对象。当然，全局对象没有定义`color`和`position`属性，所以这就是为什么我们得到了`undefined`值。

我们可以用ES5的方法来修复这个问题：

```
var box = {
    color: 'green',
    position: 1,
    clickMe: function() {
        var self = this;
        document.querySelector('body').addEventListener('click', function() {
            var str = 'This is box number ' + self.position + ' and it is ' + self.color;
            alert(str);
        });
    }
}
```
添加 `var self = this`，创建了一个可以使用指向`box`对象的`this`关键字的闭包函数的工作区。我们仅仅只需要在回调函数内使用`self`变量。

调用：

```
box.clickMe();
```
弹出框内容`This is box number 1 and it is green`。

怎么使用箭头函数能够达到上述效果呢？我们将用箭头函数替换点击函数的回调函数。

```
var box = {
    color: 'green',
    position: 1,
    clickMe: function() {
        document.querySelector('body').addEventListener('click', () => {
            var str = 'This is box number ' + this.position + ' and it is ' + this.color;
            alert(str);
        });
    }
}
```

箭头函数的神奇之处就是共享包裹它的`this`词法关键字。所以，本例中外层函数的`this`共享给箭头函数，这个外层函数的`this`关键字指向`box`对象，因此，`color`和`position`属性将是有正确的`green`和`1`值。

再来一个：

```
var box = {
    color: 'green',
    position: 1,
    clickMe: () => {
        document.querySelector('body').addEventListener('click', () => {
            var str = 'This is box number ' + this.position + ' and it is ' + this.color;
            alert(str);
        });
    }
}
```
oh！现在又弹出了`‘This is box number undefined and it is undefined’.`。为什么？

`click`事件监听函数闭包的`this`关键字共享了包裹它的`this`关键字。在本例中它被包裹的箭头函数`clickMe`，`clickMe`箭头函数的`this`关键字指向全局对象，本例中是`window`对象。所以`this.color`和`this.position`将会是`undefined`因为`window`对象没有`position`和`color`属性。

我想再给你看个在很多情况下都会有帮助的`map`函数，我们定义一个`Person`构造函数方法如下：

```
function Person(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = function() {
        console.log(`Name: ${this.firstName} ${this.lastName}`);
    }
}
```
`Person`的原型上添加`myFriends`方法：

```
Person.prototype.myFriends = function(friends) {
    var arr = friends.map(function(friend) {
        return this.firstName + ' is friends with ' + friend;
    });
    console.log(arr);
}
```
创建一个实例：

```
let john = new Person("John", "Watson");
```
调用`john.myFriends(["Emma", "Tom"])`，结果：

```
["undefined is friends with Emma", "undefined is friends with Tom"]
```
本例与之前的例子非常相似。`myFriends`函数体内有`this`关键字指向回调对象。但是，`map`闭包函数内是一个普通函数调用。所以`map`闭包函数内`this`指向全局对象，本例中为`window`对象，因此`this.firstName`undefined。现在，我们试着修复这个情况。

1. 在`myFriends`函数体内指定`this`为其它变量如`self`，以便`map`函数内闭包使用它。
    

```
Person.prototype.myFriends = function(friends) {
    // 'this' keyword maps to the calling object
    var self = this;
    var arr = friends.map(function(friend) {
        // 'this' keyword maps to the global object
        // here, 'this.firstName' is undefined.
        return self.firstName + ' is friends with ' + friend;
    });
    console.log(arr);
}
```

2. `map`闭包函数使用`bind`。
    

```
Person.prototype.myFriends = function(friends) {
    // 'this' keyword maps to the calling object
    var arr = friends.map(function(friend) {
        // 'this' keyword maps to the global object
        // here, 'this.firstName' is undefined.
        return this.firstName + ' is friends with ' + friend;
    }.bind(this));
    console.log(arr);
}
```
调用`bind`会返回一个`map`回调函数的副本，`this`关键字映射到外层的`this`关键字，也就是是调用`myFriends`方法，`this`指向这个对象。

3. 创建`map`回调函数为箭头函数。

```
Person.prototype.myFriends = function(friends) {
    var arr = friends.map(friend => `${this.firstName} is friends with ${friend}`);
    console.log(arr);
}
```
现在，箭头函数内的`this`关键字将共享未曾包裹它的词法作用域，也就是说实例`myFriends`。

所有以上解决方案都将输出结果：

```
["John is friends with Emma", "John is friends with Tom"]
```

...


在这一点上，我希望我已经设法使`this`关键字概念对您来说有点平易近人。在本文中，我分享了我遇到的一些常见情况以及如何处理它们，但当然，在构建更多项目时，您将面临更多情况。我希望我的解释可以帮助您在接近`this`关键字绑定主题时保持坚实的基础。如果您有任何问题，建议或改进，我总是乐于学习更多知识并与所有知名开发人员交流知识。请随时写评论，或给我留言！
