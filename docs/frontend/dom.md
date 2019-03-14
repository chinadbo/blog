# 理解DOM到底是什么

文档对象模型或者说我们熟悉的“DOM”，web网页的一个界面。它本质上是允许程序读取和操作页面的内容，结构和样式的页面API。 接下来一一分解。
## 网页如何构建

浏览器如何从源HTML文档转到在视口中显示样式化和交互式页面称为“关键渲染路径”。 这些步骤大致可分为两个阶段。第一阶段涉及浏览器解析文档以确定最终将在页面上渲染的内容，第二阶段涉及浏览器执行渲染。
![](https://user-gold-cdn.xitu.io/2018/12/1/167676388b002149?w=828&h=442&f=png&s=86053)
第一阶段的结果是所谓的“渲染树”。 渲染树是将在页面上呈现的HTML元素及其相关样式的表示。 为了构建这个树，浏览器需要两件事：
1. CSSOM，元素相关样式的结构；
2. DOM，元素结构

## DOM如何创建（长啥样）
DOM是HTML源文档的基于对象的表示。它有一些差异，我们将在下面看到，但它本质上是一种尝试将HTML文档的结构和内容转换为可供各种程序使用的对象模型。

DOM的对象结构由所谓的“节点树”表示。 它之所以被称为树是因为它可以被认为是具有单个父茎的树，其分枝成几个子枝，每个子枝可以具有叶子。 在这种情况下，父“stem”是根&lt;html&gt;元素，子“branches”是嵌套元素，“leaves”是元素中的内容。

我们以此HTML文档为例：

```html
<!doctype html>
<html lang="en">
 <head>
   <title>My first web page</title>
  </head>
 <body>
    <h1>Hello, world!</h1>
    <p>How are you?</p>
  </body>
</html>
```
此文档可以表示为以下节点树：

```flow
html
    head
        title
            My first web page
    body
        h1
            Hello, world!
        p
            How are you?
```
## DOM不是什么
在上面给出的示例中，看起来DOM是源HTML文档的一对一映射或者你看到的DevTools的映射。 但是，正如我所提到的，存在差异。为了完全理解DOM是什么，我们需要看看它不是什么。
### DOM不是你的html源文档
尽管DOM是从源HTML文档创建的，但它并不总是完全相同。 有两个实例，DOM可以与源HTML不同。
#### 1. 当HTML无效时
DOM是有效HTML文档的接口。 在创建DOM的过程中，浏览器可以纠正HTML代码中的一些无效。

我们以此HTML文档为例：

```html
<!doctype html>
<html>
    Hello, world!
</html>
```
该文档缺少`<head>`和`<body>`元素，这是有效HTML的要求。 如果我们查看生成的DOM树，我们将看到这已得到纠正：

```flow
html
    head
    body
        Hello, world!
```
#### 2. 当JavaScript修改了DOM
除了作为查看HTML文档内容的界面之外，还可以修改DOM，使其成为动态资源。

例如，我们可以使用Javascript为DOM创建其他节点。

```javascript
const newParagraph = document.createElement("p");
const paragraphContent = document.createTextNode("I'm new!");
newParagraph.appendChild(paragraphContent);
document.body.appendChild(newParagraph);
```
如上会更改我们的DOM，但并不是更改了我们的HTML文档。
### DOM不是你在浏览器中看到的（即渲染树）
你在浏览器视口中看到的是渲染树，正如我所提到的，它是DOM和CSSOM的组合。 真正将DOM与渲染树分开的是，后者只包含最终将在屏幕上绘制的内容。

因为渲染树仅关注渲染的内容，所以它会排除视觉上隐藏的元素。 例如，具有显示的元素：没有与之关联的样式。

```html
<!doctype html>
<html lang="en">
  <head></head>
  <body>
    <h1>Hello, world!</h1>
    <p style="display: none;">How are you?</p>
  </body>
</html>
```
上面的DOM结构将包含 `<p>` 元素

```flow
html
    head
    body
        h1
            Hello, world!
        p
            How are you?
```
但是，渲染树，即我们在视口上所见，不包含这个p元素

```flow
html
    body
        h1
            Hello, world!
```
### DOM不是DevTools中的结构
这种差异有点小，因为DevTools元素检查器提供了我们在浏览器中最接近的DOM。 但是，DevTools检查器包含不在DOM中的其他信息。

最好的例子是CSS伪元素。 使用:: before和:: after选择器创建的伪元素构成CSSOM和渲染树的一部分，但在技术上不是DOM的一部分。 这是因为DOM仅由源HTML文档构建，不包括应用于元素的样式。

尽管伪元素不是DOM的一部分，但它们仍在我们的devtools元素检查器中。

![](https://user-gold-cdn.xitu.io/2018/12/1/167678324a3de371?w=1522&h=976&f=png&s=111773)
这就是为什么伪元素不能被Javascript直接获取到的原因，因为伪元素不是DOM的一部分。
## 总结
DOM是HTML文档的接口。 它被浏览器用作确定在视口中呈现内容的第一步，并通过Javascript程序来修改页面的内容，结构或样式。

虽然与其他形式的源HTML文档类似，但DOM在许多方面有所不同：

1. 它总是有效的HTML
2. 它是一个可以通过Javascript修改的结构
3. 它不包含伪元素（例如:: after）
4. 它确实包含隐藏元素（例如**display：none**）