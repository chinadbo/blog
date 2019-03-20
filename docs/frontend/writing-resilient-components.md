> 作者：Dan Abramov.  <br/> March 16, 2019 • ☕️☕️☕️☕️☕️ 24 min read  <br/>原文链接：[Writing Resilient Components](https://overreacted.io/writing-resilient-components/)

当人们开始学习React时，他们经常会要求提供风格指南。虽然在项目中应用一些一致的规则是个好主意，但很多都是随意的 --- 因此React对他们没有强烈的要求意见。

您可以使用不同的类型系统，函数声明或者箭头函数，按字母顺序或者按您喜欢的方式排序props。

这种灵活性允许将[React集成](https://reactjs.org/docs/add-react-to-a-website.html)到现有约定的项目中，但它也引发了无休止的争论。

每个组件应努力遵循一些重要的设计原则。但我不认为风格指南会很好的抓住这些原则，我们先讨论风格指南，然后再看看 [真正有用的原则](https://overreacted.io/writing-resilient-components/#writing-resilient-components)

## 不要被想象中的问题分散注意力

在我们讨论组件设计原则之前，我想先谈谈风格指南。这不是一个流行的观点，但有人需要说出来！

在JavaScript社区中，有一些由linter强制执行的严格自用的风格指南。我个人的观察是，他们往往会产生比他们的价值更多的摩擦。我无法计算有多少人向我展示了一些绝对有效的代码，并说“React抱怨这个”，但这是他们的lint配置抱怨！这导致了三个问题：

- 人们习惯于把linter看成一个**过分热心的吵闹的守门人**，而不是一个有用的工具。有用的警告⚠被大量的风格样式淹没。因此，人们在调试的时候不会去瞄一眼linter信息，并且会错过有用的提示。此外，不太习惯编写JavaScript的人（例如，设计人员）更难以使用代码。
- 人们不会学着区分某种模式的**有效和无效使用**。例如，有一条流行的规则是禁止在componentDidMount内部调用setState。但是如果它总是"bad"，React根本不会允许这样做。它有一个合法的用例，那就是度量DOM节点的布局。例如，去定位一个提示。我已经看到人们通过添加一个setTimeout完全忽略这一点“解决”这个规则。
- 最终，人们采用“强制执行者心态”，并对那些**没有带来有意义的差异**但在代码中易于扫描的事情持批评态度。“你使用了一个函数声明，但是我们的项目使用了箭头函数。”每当我对强制执行这样的规则有强烈的感觉时，深入研究就会发现我在这个规则中投入了情感上的努力 - 并努力让它发挥作用。它让我陷入虚假的成就感而不改进我的代码。

我是说我们应该停止使用linter？当然不是。

**通过良好的配置，linter是一个很好的工具，可以在错误发生之前捕获它们。**它过于专注于风格，使其变得分散注意力。

## Marie Kondo你的Lint配置

这是我建议你周一做的。花半小时仔细检查收集你的团队在项目配置中启用的每个lint规则，并问自己：“这个规则是否帮助我们捕获了一个错误？”如果没有，请将其关闭。（您也可以从eslint-config-react-app没有样式规则的干净平板开始。）

至少，你的团队应该有一个删除导致摩擦的规则的过程。不要以为一年前你或别人添加到你的lint配置中的任何东西都是“最佳实践”。提出问题并寻找答案。不要让任何人告诉你，你不够聪明，不能选择你的lint规则。

但是**格式呢？**使用prettier然后忘记样式淹没。你不需要一个工具对你大喊大叫说需要额外的空间让另外的工具为你修复它。使用linter找到bug，而不是来强化美学。

当然，编码风格的某些方面与格式没有直接关系，但在整个项目中不一致时仍然会很烦人。

然而，他们种大多数很微妙以至于难以被lint规则捕获。这就是为什么在团队成员之间建立信任以及以wiki页面或者简短设计指南形式分享有用信息是非常重要的原因。

并非一切都值得自动化！从实际阅读这样一个指南中的基本原理中获得的见解可能比遵循“规则”更有价值。

但如果遵循严格的风格指南是分散注意力，那么实际上重要的是什么？

这是这篇文章的主题。

## 编写弹性组件
按字母顺序排列的缩进或排序数量不能修复损坏的设计。因此，我不会关注某些代码的外观，而是关注它的工作原理。我发现有一些组件设计原则非常有用：

1. [不要停止数据流](#原则1：不要停止数据流)
2. 始终准备渲染
3. 没有单独的组件
4. 保持本地状态孤立

即使您不使用React，您也可能会通过试验和错误发现具有单向数据流的任何UI组件模型的相同原则。

## 原则1：不要停止数据流
### 渲染时不要停止数据流
当有人使用你的组件时，他们期望随时能传递不同的props，组件都能响应这些改变：

```
// isOk might be driven by state and can change at any time
<Button color={isOk ? 'blue' : 'red'} />
```

通常，这是React默认的工作方式。如果你在Button组件使用color prop属性，您将看到上面为渲染提供的值：

```
unction Button({ color, children }) {
  return (
    // ✅ `color` is always fresh!
    <button className={'Button-' + color}>
      {children}
    </button>
  );
}
```
然而，学习React时通常的错误是复制props值到state：

```
class Button extends React.Component {
  state = {
    color: this.props.color
  };
  render() {
    const { color } = this.state; // 🔴 `color` is stale!
    return (
      <button className={'Button-' + color}>
        {this.props.children}
      </button>
    );
  }
}
```

如果你在React之外使用classes会更加直观。然而，赋值props到state，你将会忽略所有对它的更新。


```
// 🔴 No longer works for updates with the above implementation
<Button color={isOk ? 'blue' : 'red'} />
```

在极少情况下，这样的行为是故意的，确保调用initialColor或者defaultColor props值没有更改是被澄清忽略的。

但通常你会想**直接在组件内读取props**，并避免将props（或任何由props计算来的）赋值给state：

```
function Button({ color, children }) {
  return (
    // ✅ `color` is always fresh!
    <button className={'Button-' + color}>
      {children}
    </button>
  );
}
```

计算值是另外一个人们有时试图赋值props给state的原因。例如，假设我们根据以背景为参数的复杂计算以去确定按钮文本颜色color：

```
class Button extends React.Component {
  state = {
    textColor: slowlyCalculateTextColor(this.props.color)
  };
  render() {
    return (
      <button className={
        'Button-' + this.props.color +
        ' Button-text-' + this.state.textColor // 🔴 Stale on `color` prop updates
      }>
        {this.props.children}
      </button>
    );
  }
}
```
这个组件时有错误的，因为当props属性的color改变的时候，它不会再去计算this.state.textColor的值。最简单的解决方法是将textColor的计算方法移到render方法内，并使用PureComponent组件：

```
class Button extends React.PureComponent {
  render() {
    const textColor = slowlyCalculateTextColor(this.props.color);
    return (
      <button className={
        'Button-' + this.props.color +
        ' Button-text-' + textColor // ✅ Always fresh
      }>
        {this.props.children}
      </button>
    );
  }
}
```
问题解决了！现在当props改变，我们将重新计算textColor，但我们避免了在相同的props情况下高昂计算。

然而，我们希望可以进一步优化它。如果时children的prop改变呢？在这种情况下重新计算textColor似乎很不幸。我们的第二次尝试可能是在componentDidupdate时调用计算。

```
class Button extends React.Component {
  state = {
    textColor: slowlyCalculateTextColor(this.props.color)
  };
  componentDidUpdate(prevProps) {
    if (prevProps.color !== this.props.color) {
      // 😔 Extra re-render for every update
      this.setState({
        textColor: slowlyCalculateTextColor(this.props.color),
      });
    }
  }
  render() {
    return (
      <button className={
        'Button-' + this.props.color +
        ' Button-text-' + this.state.textColor // ✅ Fresh on final render
      }>
        {this.props.children}
      </button>
    );
  }
}
```
但是，这意味着我们的组件在每次更改后都会进行第二次重新渲染。如果我们试图优化它，那也不理想。

你可以使用遗留的componentWillReceiveProps生命周期钩子。然而，人们经常搞出些副作用。反过来，这通常会导致即将出现的像[Time Slicing and Suspense](https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html)Concurrent Rendering功能。而“更安全”的getDeRivedStateFromProps方法很笨重。

让我们退后一步。实际上，我们想要[memoization](https://en.wikipedia.org/wiki/Memoization)。我们有一些输入，除非输入发生变化，否则我们不想重新计算输出。

使用Class，参考[memoization helper](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)。然而，Hooks更进一步，为您提供了一种记忆昂贵计算的内置方法：

```
function Button({ color, children }) {
  const textColor = useMemo(
    () => slowlyCalculateTextColor(color),
    [color] // ✅ Don’t recalculate until `color` changes
  );
  return (
    <button className={'Button-' + color + ' Button-text-' + textColor}>
      {children}
    </button>
  );
}
```
这就是你需要的所有代码！

在类组件种，你可以使用[memoize-one](https://github.com/alexreardon/memoize-one)，在函数式组件，useMemo hooks为您提供相同的功能。

现在我们看到即使优化高昂的算也不是赋值props到state的原因。我们的渲染结果应该遵循props的改变。

### 不要停止副作用中的数据流

到目前为止，我们已经讨论如何使渲染结果与props改变保持一致。避免赋值props到state是其中的一部分。然而，重要的是，**副作用（例如数据获取）也是数据流的一部分**。

考虑一下这个React组件：

```
class SearchResults extends React.Component {
  state = {
    data: null
  };
  componentDidMount() {
    this.fetchResults();
  }
  fetchResults() {
    const url = this.getFetchUrl();
    // Do the fetching...
  }
  getFetchUrl() {
    return 'http://myapi/results?query' + this.props.query;
  }
  render() {
    // ...
  }
}
```

很多组件都是这样的 --- 但如果我们看仔细，我们会注意到一个bug。fetchResults方法使用props属性值query获取数据：

```
getFetchUrl() {
    return 'http://myapi/results?query' + this.props.query;
  }
```

但是如果props属性query改变了呢？在我们的组件，什么也不会发生。**这意味着我们组件的副作用没有遵循props的改变**。这是React应用程序中非常常见的错误来源。

为了修复此组件，我们需要：

- 查看componentDidMount和每一个调用的方法
    - 此例中，是fetchResults和getFetchUrl
- 写下这些方法所使用的所有props和state
    - 此例中，是this.props.query
- 确保props无论何时更改，重新调用副作用
    - 我们可以通过添加componentDidUpdate方法来完成此操作。

```
class SearchResults extends React.Component {
  state = {
    data: null
  };
  componentDidMount() {
    this.fetchResults();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) { // ✅ Refetch on change
      this.fetchResults();
    }
  }
  fetchResults() {
    const url = this.getFetchUrl();
    // Do the fetching...
  }
  getFetchUrl() {
    return 'http://myapi/results?query' + this.props.query; // ✅ Updates are handled
  }
  render() {
    // ...
  }
}
```

现在我们的代码遵循props的所有更改，甚至是副作用。

然而，记住不要再破坏它是很有挑战性的。例如，我们可能会添加currentPage到本地状态，并在getFetchUrl使用它：

```
class SearchResults extends React.Component {
  state = {
    data: null,
    currentPage: 0,
  };
  componentDidMount() {
    this.fetchResults();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchResults();
    }
  }
  fetchResults() {
    const url = this.getFetchUrl();
    // Do the fetching...
  }
  getFetchUrl() {
    return (
      'http://myapi/results?query' + this.props.query +
      '&page=' + this.state.currentPage // 🔴 Updates are ignored
    );
  }
  render() {
    // ...
  }
}
```
唉，我们的代码又是错误的，因为我们的副作用不遵循currentPage变化。

props和state是React数据流的一部分。渲染和副作用都应该反映数据流的变化，而不是忽略他们。

要修复代码，我们可以重复上述代码：

- 查看componentDidMount和每一个调用的方法
    - 此例中，是fetchResults和getFetchUrl
- 写下这些方法所使用的所有props和state
    - 此例中，是this.props.query和this.state.currentPage
- 确保props无论何时更改，重新调用副作用
    - 我们可以通过添加componentDidUpdate方法来完成此操作。

让我们修复我们的组件来处理currentPage状态更新：

```
class SearchResults extends React.Component {
  state = {
    data: null,
    currentPage: 0,
  };
  componentDidMount() {
    this.fetchResults();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentPage !== this.state.currentPage || // ✅ Refetch on change
      prevProps.query !== this.props.query
    ) {
      this.fetchResults();
    }
  }
  fetchResults() {
    const url = this.getFetchUrl();
    // Do the fetching...
  }
  getFetchUrl() {
    return (
      'http://myapi/results?query' + this.props.query +
      '&page=' + this.state.currentPage // ✅ Updates are handled
    );
  }
  render() {
    // ...
  }
}
```

**如果我们能以某种方式自动捕捉这些错误，那不是很好吗**？这不是一个可以帮助我们的规则吗？

不幸的是，自动检查类组件的一致性太困难了。任何方法都可以调用任何其他方法。静态地分析componentDidMount和componentDidUpdate会充满误报。

但是，可以设计一个可以静态分析一致性的API 。React useEffect Hook是这样的API的示例：


```
function SearchResults({ query }) {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    function fetchResults() {
      const url = getFetchUrl();
      // Do the fetching...
    }

    function getFetchUrl() {
      return (
        'http://myapi/results?query' + query +
        '&page=' + currentPage
      );
    }

    fetchResults();
  }, [currentPage, query]); // ✅ Refetch on change

  // ...
}
```

我们将逻辑放在effect里，这样可以更容易地看到它依赖的React数据流中的哪些值。这些值称为“依赖项”，在我们的示例中它们是[currentPage, query]。

注意这个“effect 依赖项”数组并不是一个新的内容。在class中，我们不得不通过所有的方法回调来搜索“依赖项”。该useEffect API只是让同一个概念明确。

反之，我们自动验证它：

![](https://user-gold-cdn.xitu.io/2019/3/20/1699a18ca90a35bc?w=753&h=611&f=png&s=64355)
（这是新推荐的exhaustive-depslint规则的演示，它是eslint-plugin-react-hooks其中的一部分。它很快将包含在Create React App中。）

**请注意，无论您是将组件编写为类还是函数，都必须尊重effects的所有prop和state更新。**

使用类API，您必须自己考虑一致性，并验证对每个相关prop或state的更改是由何componentDidUpdate处理的。否则，您的组件对prop和状态更改不具有弹性。这甚至不是特定于React的问题。它适用于任何允许您单独处理“创建”和“更新”的UI库。

该useEffect API通过鼓励一致性翻转默认值。一开始可能会感到陌生，但结果是您的组件对逻辑更改更具弹性。由于“依赖关系”现在是明确的，我们可以使用lint规则验证效果是否一致。我们用一个lint来捕获bug！

### 永远不要停止优化数据流

还有一种情况是您可能会意外忽略对props的更改。当您手动优化组件时，可能会发生此错误。

请注意，使用浅等式PureComponent和React.memo默认比较的优化方法是安全的。

**但是，如果您尝试通过编写自己的比较来“优化”组件，则可能会错误地忘记比较函数props：**

```
class Button extends React.Component {
  shouldComponentUpdate(prevProps) {
    // 🔴 Doesn't compare this.props.onClick 
    return this.props.color !== prevProps.color;
  }
  render() {
    const onClick = this.props.onClick; // 🔴 Doesn't reflect updates
    const textColor = slowlyCalculateTextColor(this.props.color);
    return (
      <button
        onClick={onClick}
        className={'Button-' + this.props.color + ' Button-text-' + textColor}>
        {this.props.children}
      </button>
    );
  }
}
```

一开始很容易错过这个错误，因为对于类，你通常会传递一个方法，所以它会有相同的特性：


```
class MyForm extends React.Component {
  handleClick = () => { // ✅ Always the same function
    // Do something
  }
  render() {
    return (
      <>
        <h1>Hello!</h1>
        <Button color='green' onClick={this.handleClick}>
          Press me
        </Button>
      </>
    )
  }
}
```

所以我们的优化不会立即中断。但是，onClick如果它随时间变化，它将保持“看到”旧值但其他props不会：

```
class MyForm extends React.Component {
  state = {
    isEnabled: true
  };
  handleClick = () => {
    this.setState({ isEnabled: false });
    // Do something
  }
  render() {
    return (
      <>
        <h1>Hello!</h1>
        <Button color='green' onClick={
          // 🔴 Button ignores updates to the onClick prop
          this.state.isEnabled ? this.handleClick : null
        }>

          Press me
        </Button>
      </>
    )
  }
}
```
在此示例中，单击按钮应禁用它 - 但这不会发生，因为Button组件忽略对onClick prop的任何更新。

如果函数标识本身依赖于可能随时间变化的东西，这可能会变得更加混乱，如下draft.content例所示：


```
 drafts.map(draft =>
    <Button
      color='blue'
      key={draft.id}
      onClick={
        // 🔴 Button ignores updates to the onClick prop
        this.handlePublish.bind(this, draft.content)
      }>
      Publish
    </Button>
  )
```
虽然draft.content可能会随着时间的推移而改变，但我们的Button组件忽略了onClick 对prop的更改，因此它继续看到onClick绑定方法的“第一个版本” 与原始版本draft.content。

那么我们如何避免这个问题呢？

我建议避免手动实现shouldComponentUpdate并避免指定自定义比较React.memo()。默认的浅比较React.memo将会改变功能标识：


```
function Button({ onClick, color, children }) {
  const textColor = slowlyCalculateTextColor(this.props.color);
  return (
    <button
      onClick={onClick}
      className={'Button-' + color + ' Button-text-' + textColor}>
      {children}
    </button>
  );
}
export default React.memo(Button); // ✅ Uses shallow comparison
```
在类中，PureComponent具有相同的行为。

这确保了将不同的函数作为props传递将始终有效。

如果您坚持自定义比较，请确保不要跳过函数：

```
shouldComponentUpdate(prevProps) {
    // ✅ Compares this.props.onClick 
    return (
      this.props.color !== prevProps.color ||
      this.props.onClick !== prevProps.onClick
    );
  }
```
正如我之前提到的，在类组件中很容易忽略这个问题，因为方法标识通常是稳定的（但并非总是如此 - 而这就是错误调试难的地方）。有了Hooks，情况有点不同：

1. 每次渲染函数不一样，所以你发现这个[问题](https://github.com/facebook/react/issues/14972#issuecomment-468280039)的时候了。
2. 使用useCallback和useContext，您可以避免完全向下传递函数。这使您可以优化渲染而无需担心函数。

总结本节，不要**停止数据流**！

无论何时使用props和状态，请考虑如果它们发生变化会发生什么。在大多数情况下，组件不应以不同方式处理初始渲染和更新。这使它能够适应逻辑上的变化。

对于类，在生命周期方法中使用props和state时很容易忘记更新。Hooks推动你做正确的事情 - 但是如果你不习惯已经做过，它会需要一些心理调整。

## 原则2：始终准备好渲染
React组件使您可以编写渲染代码而无需担心太多时间。您描述了UI 在任何给定时刻应该如何看待，而React使它成为现实。利用好那个模型！

不要试图在组件行为中引入不必要的时序假设。您的组件应该随时可以重新渲染。

如何违反这一原则？React并不容易 - 但您可以使用遗留componentWillReceiveProps生命周期方法来实现：

```
class TextInput extends React.Component {
  state = {
    value: ''
  };
  // 🔴 Resets local state on every parent render
  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }
  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };
  render() {
    return (
      <input
        value={this.state.value}
        onChange={this.handleChange}
      />
    );
  }
}
```
在这个例子中，我们保持value在本地状态，但我们也从props接收value。每当我们“收到新props”时，我们都会重置value进入state。

**这种模式的问题在于它完全依赖于意外的时间安排。**

也许今天这个组件的父级很少更新，所以当TextInput重要的事情发生时我们只会“接收props”，比如保存表单。

但明天你可能会给TextInput父组件添加一些动画。如果它的父组件经常重新渲染，它将继续“[blowing away](https://codesandbox.io/s/m3w9zn1z8x)”子组件状态！您可以在“**[您可能不需要派生状态](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)**”中阅读有关此问题的更多信息。

**那我们怎么解决这个问题呢？**

首先，我们需要修复我们的心理模型。我们需要停止将“接收props”视为与“渲染”不同的东西。由父项引起的重新呈现不应与由我们自己的本地状态更改引起的重新呈现不同。组件应该具有弹性，以便更少或更频繁地呈现，否则因为它们太过于与其特定的父母耦合。