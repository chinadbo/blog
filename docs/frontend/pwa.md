# 【译】PWA泛指南

**原文地址：** [An Extensive Guide To Progressive Web Applications](https://www.smashingmagazine.com/2018/11/guide-pwa-progressive-web-applications/)

## 快速摘要
在本文中，我们将了解浏览旧的非PWA网站的用户的痛点以及PWA使网络变得更好的希望。您将学习制作非常酷的PWA的大多数重要技术，例如service worker，Web push notification和IndexedDB。

这是我父亲的生日，我想给他订一块巧克力蛋糕和一件衬衫。我前往谷歌搜索巧克力蛋糕并点击搜索结果中的第一个链接。有一个屏幕空白几秒钟;我不明白发生了什么。耐心地盯着几秒钟后，我的手机屏幕上装满了美味的蛋糕。当我点击其中一个查看其详细信息时，我得到了一个丑陋的弹出窗口，要求我安装一个Android应用程序，这样我就可以在订购蛋糕时获得丝般顺畅的体验。

那令人失望。我的良心不允许我点击“安装”按钮。我想做的就是点一块小蛋糕然后走开。

我点击了弹出窗口右侧的十字图标，尽快摆脱它。但随后安装弹出窗口位于屏幕底部，占据了四分之一的空间。随着片状UI的向下滚动是一个挑战。我不知何故设法订购了荷兰蛋糕。

在经历了这种可怕的经历后，我的下一个挑战是为我爸爸订购一件衬衫。和以前一样，我在谷歌搜索衬衫。我点击了第一个链接，眨眼间，整个内容就在我面前。滚动很顺利。没有安装弹窗。我觉得好像在浏览本机应用程序。有一段时间我互联网断开了连接，但我仍然能够看到内容而不是恐龙游戏。即使有我的网络，我还是为父亲订购了一件衬衫和牛仔裤。最令人惊讶的是，我收到了有关订单的通知。

我会称之为丝般顺畅的体验。这些人做得对。每个网站都应该为他们的用户做。它被称为渐进式网络应用程序PWA。

正如Alex Russell所说[one of his blog posts:](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/)
> “It happens on the web from time to time that powerful technologies come to exist without the benefit of marketing departments or slick packaging. They linger and grow at the peripheries, becoming old-hat to a tiny group while remaining nearly invisible to everyone else. Until someone names them.”

## WEB上丝滑顺畅体验，PWA
渐进式Web应用程序（PWA）更像是一种涉及技术组合的方法，可用于制作功能强大的Web应用程序。随着用户体验的改善，人们将花费更多时间在网站上并看到更多广告。 他们倾向于购买更多，并且通知更新，他们更有可能经常访问。英国“金融时报”在2011年放弃了其原生应用程序，并使用当时可用的最佳技术构建了一个Web应用程序。 现在，该产品已发展成为一个成熟的PWA。

但是，毕竟这一次，为什么当原生应用程序很好完成这项工作时，你会构建一个Web应用程序吗？

我们来看看Google IO 17中分享的一些指标。

五十亿台设备连接到网络，使网络成为计算历史上最大的平台。在移动网络上，每月有1140万独立访问者访问前1000个网站，400万访问前千名应用。移动网络的用户数量是原生应用程序的四倍。但是，这个数字在交互方面急剧下降。

用户在原生应用程序中平均花费188.6分钟，在移动网络上花费仅9.3分钟。原生应用程序利用操作系统的强大功能发送推送通知，为用户提供重要更新。它们提供了比浏览器中的网站更好的用户体验和更快的启动。用户只需点击主屏幕上的应用程序图标，而不是在Web浏览器中键入URL。

网络上的大多数访问者都不太可能回来，因此开发人员提出了向他们展示弹窗以安装本机应用程序的解决方法，以便让他们深入参与。但是，用户必须完成安装本机应用程序二进制文件的繁琐程序。强制用户安装应用程序很烦人，并且进一步降低了他们首先安装应用程序的可能性。网络的机会很明显。

**推荐阅读：**[Native And PWA: Choices, Not Challengers!](https://www.smashingmagazine.com/2018/02/native-and-pwa-choices-not-challengers/)

如果Web应用程序具有丰富的用户体验，推送通知，离线支持和即时加载，它们可以征服世界。 这是渐进式Web应用程序的功能。

PWA提供丰富的用户体验，因为它具有以下几个优势：

* **快速**

    用户界面不古里古怪；滚动平滑，应用快速响应用户交互
* **可靠**

    当用户连接服务器繁忙的时候，一个普通的网站迫使用户等待，什么都不做。但是，PWA从缓存中即时加载数据。即使在2G连接上，PWA也可以无缝工作。每个获取资源或数据的网络请求都通过service worker（稍后会详细介绍），该service worker首先验证特定请求的响应是否已经在缓存中。当用户几乎立即获得真实内容时，即使连接不良，他们也会更加信任应用并将其视为更可靠。
    
* **参与度**

    PWA可以在用户的主屏幕上获得一个位置。 它通过提供全屏工作区提供原生应用程序般的体验。 它利用推送通知来保持用户参与。
    
现在我们知道PWA带来了什么，让我们深入了解什么使PWA优于原生应用程序。PWA使用service worker，Web app manifests，web push notification和用于缓存的IndexedDB /本地数据结构等技术构建。 让我们详细研究一下。

## Service Workers
service worker是一个在后台运行的JavaScript文件，不会干扰用户的交互。 对服务器的所有GET请求都通过service worker进行。它就像一个客户端代理。 通过拦截网络请求，它可以完全控制发送回客户端的响应。PWA立即加载，因为service worker通过响应来自缓存的数据来消除对网络的依赖性。

service worker只能拦截其范围内的网络请求。 例如，根范围的service worker可以拦截来自网页的所有提取请求。 service worker作为事件驱动系统运行。 它在不需要时进入休眠状态，从而节省了内存。 要在Web应用程序中使用service worker，我们首先必须使用JavaScript在页面上注册它。
```javascript
(function main () {

   /* navigator is a WEB API that allows scripts to register themselves and carry out their activities. */
    if ('serviceWorker' in navigator) {
        console.log('Service Worker is supported in your browser')
        /* register method takes in the path of service worker file and returns a promises, which returns the registration object */
        navigator.serviceWorker.register('./service-worker.js').then (registration => {
            console.log('Service Worker is registered!')
        })
    } else {
        console.log('Service Worker is not supported in your browser')
    }

})()
```

我们首先检查浏览器是否支持service worker。要在Web应用程序中注册service worker，我们将其URL作为注册函数的参数提供，可在*navigator.serviceWorker*中找到（navigator是一个允许脚本自行注册并执行其活动的Web API）。 service worker只注册一次。 每次加载页面时都不会进行注册。仅当现有激活的service worker与较新的service worker之间存在字节差异或者其URL已更改时，浏览器才会下载service worker文件（./service-worker.js）。

上述service worker将拦截来自根（/）的所有请求。 为了限制service worker的范围，我们将传递一个可选参数，其中一个键作为范围。
```javascript
if ('serviceWorker' in navigator) {
    /* register method takes in an optional second parameter as an object. To restrict the scope of a service worker, the scope should be provided.
        scope: '/books' will intercept requests with '/books' in the url. */
    navigator.serviceWorker.register('./service-worker.js', { scope: '/books' }).then(registration => {
        console.log('Service Worker for scope /books is registered', registration)
    })
}
```

上面的service worker将拦截在URL中具有/ books的请求。 例如，它不会拦截/ products的请求，但它可以很好地拦截/ books / products的请求。

如上所述，service worker作为事件驱动系统运行。 它侦听事件（安装，激活，获取，推送），并相应地调用相应的事件处理程序。 其中一些事件是service worker生命周期的一部分，它按顺序通过这些事件来激活。
### INSTALLATION
成功注册服务工作程序后，将触发安装事件。 这是进行初始化工作的好地方，比如在IndexedDB中设置缓存或创建对象存储。（一旦我们了解了它的细节，IndexedDB会对你更有意义。现在，我们可以说它是一个键值对结构。）
```javascript
self.addEventListener('install', (event) => {
    let CACHE_NAME = 'xyz-cache'
    let urlsToCache = [
        '/',
        '/styles/main.css',
        '/scripts/bundle.js'
    ]
    event.waitUntil(
        /* open method available on caches, takes in the name of cache as the first parameter. It returns a promise that resolves to the instance of cache
        All the URLS above can be added to cache using the addAll method. */
        caches.open(CACHE_NAME)
        .then (cache => cache.addAll(urlsToCache))
    )
})
```
在这里，我们正在缓存一些文件，以便下一次加载是即时的。 self指的是service worker实例。event.waitUntil使service worker等待，直到其中的所有代码都完成执行。

### ACTIVATION
一旦安装了service worker，它就无法监听获取请求。 相反，会触发一个activate事件。如果没有激活的service worker在同一范围内的网站上运行，则会立即激活已安装的service worker。但是，如果网站已有激活的service worker，则会延迟激活新service worker，直到关闭在旧service worker程序上运行的所有选项卡。 这是有道理的，因为旧的service worker可能正在使用现在在较新的服务器中修改的缓存实例。 因此，激活步骤是摆脱旧缓存的好地方。
```javascript
self.addEventListener('activate', (event) => {
    let cacheWhitelist = ['products-v2'] // products-v2 is the name of the new cache

    event.waitUntil(
        caches.keys().then (cacheNames => {
            return Promise.all(
                cacheNames.map( cacheName => {
                    /* Deleting all the caches except the ones that are in cacheWhitelist array */
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})
```
在上面的代码中，我们删除旧的缓存。 如果缓存的名称与cacheWhitelist不匹配，则将其删除。要跳过等待阶段并立即激活service worker，我们使用skip.waiting（）。
```javascript
self.addEventListener('activate', (event) => {
    self.skipWaiting()
    // The usual stuff
})
```
一旦激活了service worker，它就可以监听获取请求和推送事件。

### FETCH EVENT HANDLER
只要网页通过网络触发对资源的获取请求，就会调用来自service worker的fetch事件。 fetch事件处理程序首先在缓存中查找请求的资源。如果它存在于缓存中，则它返回具有缓存资源的响应。 否则，它会向服务器发起一个获取请求，当服务器发回带有请求资源的响应时，它会将其放入缓存中以供后续请求使用。
```javascript
/* Fetch event handler for responding to GET requests with the cached assets */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open('products-v2')
            .then (cache => {
                /* Checking if the request is already present in the cache. If it is present, sending it directly to the client */
                return cache.match(event.request).then (response => {
                    if (response) {
                        console.log('Cache hit! Fetching response from cache', event.request.url)
                        return response
                    }
                    /* If the request is not present in the cache, we fetch it from the server and then put it in cache for subsequent requests. */
                    fetch(event.request).then (response => {
                        cache.put(event.request, response.clone())
                        return response
                    })
                })
            })
    )
})
```
event.respondWith让service worker向客户端发送一个自定义响应。

离线优先现在是一件事。 对于任何非关键请求，我们必须提供来自缓存的响应，而不是去请求服务器。如果缓存中没有任何资源，我们从服务器获取它，然后将其缓存以用于后续请求。

service worker只能在HTTPS网站上工作，因为他们有权操纵任何获取请求的响应。 有恶意的人可能会篡改HTTP网站上的请求响应。因此，在HTTPS上托管PWA是强制性的。 service worker不会中断DOM的正常运行。 他们无法直接与网页通信。 要将任何消息发送到网页，它会使用发布消息。

## Web Push Notifications


假设您正在忙着在手机上玩游戏，并会弹出一条通知，告诉您自己喜欢的品牌可享受30％的折扣。没有任何进一步的麻烦，你点击通知，然后屏住呼吸。 在用户使用产品时，获取板球或足球比赛的实时更新或将重要的电子邮件和提醒作为通知是一件大事。此功能仅在原生应用程序中可用，直到PWA出现。 PWA利用Web推送通知来竞争原生应用程序提供的强大功能。即使在任何浏览器选项卡中未打开PWA，即使浏览器未打开，用户仍会收到Web推送通知。

Web应用程序必须要求用户允许向其发送推送通知。

![](https://user-gold-cdn.xitu.io/2018/11/29/1675ee9786526bbd?w=2000&h=1129&f=png&s=1366787)
一旦用户通过单击“允许”按钮确认，浏览器将生成唯一的订阅token。 此令牌对于此设备是唯一的。 Chrome生成的订阅token格式如下：
```json
{
     "endpoint": "https://fcm.googleapis.com/fcm/send/c7Veb8VpyM0:APA91bGnMFx8GIxf__UVy6vJ-n9i728CUJSR1UHBPAKOCE_SrwgyP2N8jL4MBXf8NxIqW6NCCBg01u8c5fcY0kIZvxpDjSBA75sVz64OocQ-DisAWoW7PpTge3SwvQAx5zl_45aAXuvS",
     "expirationTime": null,
     "keys": {
          "p256dh": "BJsj63kz8RPZe8Lv1uu-6VSzT12RjxtWyWCzfa18RZ0-8sc5j80pmSF1YXAj0HnnrkyIimRgLo8ohhkzNA7lX4w",
          "auth": "TJXqKozSJxcWvtQasEUZpQ"
     }
}
```


上述token中包含的endpoint对于每个订阅都是唯一的。在一般的网站上，成千上万的用户会同意接收推送通知，对于每个用户，这个endpoint都是唯一的。因此，在此endpoint的帮助下，应用程序可以通过向其发送推送通知来定位这些用户。expirationTime是订阅对特定设备有效的时间量。如果expirationTime是20天，则意味着用户的推送订阅将在20天后过期，并且用户将无法接收旧订阅的推送通知。在这种情况下，浏览器将为该设备生成新的订阅token。 auth和p256dh密钥用于加密。

现在，要在将来向这些成千上万的用户发送推送通知，我们首先必须保存他们各自的订阅token。应用程序服务器（后端服务器，可能是Node.js脚本）的工作是向这些用户发送推送通知。这可能听起来像使用请求有效负载中的通知数据向端点URL发出POST请求一样简单。但是，应该注意的是，如果用户在服务器触发了针对他们的推送通知时不在线，则他们应该在他们重新联机后仍然会收到该通知。服务器必须处理这些场景，同时向用户发送数千个请求。跟踪用户连接的服务器听起来很复杂。因此，中间的某些东西将负责将Web推送通知从服务器路由到客户端。这称为推送服务，每个浏览器都有自己的推送服务实现。浏览器必须告知推送服务以下信息才能发送任何通知：

1. 生命周期
    
    这是消息应排队的时间长度，以防它未传递给用户。 一旦这段时间过去，消息将从队列中删除。
2. 消息紧迫性
    
    这样推送服务通过仅发送高优先级消息来保留用户的电量。

推送服务将消息路由到客户端。 因为即使其各自的Web应用程序未在浏览器中打开，客户端也必须接收推送，因此必须通过在后台持续监视的内容来监听推送事件。 你猜对了：这是service worker的工作。 service worker侦听推送事件并执行向用户显示通知的工作。

因此，现在我们知道浏览器，推送服务，service worker和应用服务器协同工作以向用户发送推送通知。 我们来看看实现细节。

### WEB PUSH CLIENT

询问用户的许可是一次性的事情。 如果用户已经授予接收推送通知的权限，我们不应再讯问。 权限值保存在Notification.permission中。

```javascript
/* Notification.permission can have one of these three values: default, granted or denied. */
if (Notification.permission === 'default') {
    /* The Notification.requestPermission() method shows a notification permission prompt to the user. It returns a promise that resolves to the value of permission*/
    Notification.requestPermission().then (result => {
        if (result === 'denied') {
            console.log('Permission denied')
            return
        }

        if (result === 'granted') {
            console.log('Permission granted')
            /* This means the user has clicked the Allow button. We’re to get the subscription token generated by the browser and store it in our database.

            The subscription token can be fetched using the getSubscription method available on pushManager of the serviceWorkerRegistration object. If subscription is not available, we subscribe using the subscribe method available on pushManager. The subscribe method takes in an object.
            */

            serviceWorkerRegistration.pushManager.getSubscription()
                .then (subscription => {
                    if (!subscription) {
                        const applicationServerKey = ''
                        serviceWorkerRegistration.pushManager.subscribe({
                            userVisibleOnly: true, // All push notifications from server should be displayed to the user
                            applicationServerKey // VAPID Public key
                        })
                    } else {
                        saveSubscriptionInDB(subscription, userId) // A method to save subscription token in the database
                    }
                })
        }
    })
}
```
在上面的订阅方法中，我们传递userVisibleOnly和applicationServerKey来生成订阅token。userVisibleOnly属性应始终为true，因为它告诉浏览器服务器发送的任何推送通知都将显示给客户端。 要了解applicationServerKey的用途，让我们考虑一个场景。

如果有人获得了数千个订阅token，他们可以很好地向这些订阅中包含的端点发送通知。 端点无法链接到您的唯一标识。为了向Web应用程序上生成的订阅token提供唯一标识，我们使用VAPID协议。使用VAPID，应用程序服务器在发送推送通知时自动向推送服务标识自己。 我们生成两个键，如下所示：
```javascript
const webpush = require('web-push')
const vapidKeys = webpush.generateVAPIDKeys()
```
web-push是一个npm模块，vapidKeys将拥有一个公钥和一个私钥。 上面使用的应用程序服务器密钥是公钥。

### Web Push Server
Web推送服务器（应用程序服务器）的工作非常简单。 它向订阅令牌发送通知有效负载。

```javascript
const options = {
    TTL: 24*60*60, //TTL is the time to live, the time that the notification will be queued in the push service
    vapidDetails: {
        subject: 'email@example.com',
        publicKey: '',
        privateKey: ''
    }
}
const data = {
    title: 'Update',
    body: 'Notification sent by the server'
}
webpush.sendNotification(subscription, data, options)
```
它使用Web推送库中的sendNotification方法。
### Service Workers
service worker向用户显示通知：
```javascript
self.addEventListener('push', (event) => {
    let options = {
        body: event.data.body,
        icon: 'images/example.png',
    }
    event.waitUntil(
        /* The showNotification method is available on the registration object of the service worker.
        The first parameter to showNotification method is the title of notification, and the second parameter is an object */
        self.registration.showNotification(event.data.title, options)
    )
})
```
到目前为止，我们已经看到service worker如何利用缓存来存储请求并使PWA快速可靠，我们已经看到了Web推送通知如何让用户参与其中。

要在客户端存储大量数据以供离线支持，我们需要一个巨大的数据结构。 让我们来看看金融时报的PWA。你必须亲眼目睹这种数据结构的强大功能。 在浏览器中加载URL，然后关闭Internet连接。重新加载页面。尔加！ 它还在运作吗？ 它是。 （就像我说的，离线是新的黑色。）数据不是来自网络。 它正在从缓存里供应。 转到Chrome开发者工具的“Application”标签。 在“Storage”下，你将找到“IndexedDB”。


![](https://user-gold-cdn.xitu.io/2018/11/29/1675f224d6ea617c?w=1600&h=911&f=png&s=778343)

查看“文章”对象库，并展开任何项目以查看自己的魔力。 英国“金融时报”已存储此数据以供离线支持。这种允许我们存储大量数据的数据结构称为IndexedDB。 IndexedDB是一个基于JavaScript的面向对象的数据库，用于存储结构化数据。 我们可以在此数据库中创建不同的对象存储用于各种目的。 例如，正如我们在上图中看到的那样，“Resources”，“ArticleImages”和“Articles”被称为对象存储。对象存储中的每个记录都使用密钥进行唯一标识。 IndexedDB甚至可以用于存储文件和blob。

让我们尝试通过创建用于存储书籍的数据库来理解IndexedDB。

`let openIdbRequest = window.indexedDB.open('booksdb', 1)`

如果数据库booksdb尚不存在，则上面的代码将创建booksdb数据库。 open方法的第二个参数是数据库的版本。指定版本会处理将来可能发生的与架构相关的更改。例如，booksdb现在只有一个表，但是当应用程序增长时，我们打算再添加两个表。 为了确保我们的数据库与更新的模式同步，我们将指定比前一个更高的版本。

调用open方法不会立即打开数据库。 这是一个返回IDBOpenDBRequest对象的异步请求。 该对象具有成功和错误属性;我们必须为这些属性编写适当的处理程序来管理连接的状态。
```javascript
let dbInstance
openIdbRequest.onsuccess = (event) => {
    dbInstance = event.target.result
    console.log('booksdb is opened successfully')
}

openIdbRequest.onerror = (event) => {
    console.log(’There was an error in opening booksdb database')
}

openIdbRequest.onupgradeneeded = (event) => {
    let db = event.target.result
    let objectstore = db.createObjectStore('books', { keyPath: 'id' })
}
```
要管理对象存储的创建或修改（对象存储类似于基于SQL的表 -它们具有键值结构），则在openIdbRequest对象上调用onupgradeneeded方法。 只要版本更改，就会调用onupgradeneeded方法。 在上面的代码片段中，我们创建了一个使用唯一键作为ID的书籍对象库。

让我们说，在部署这段代码之后，我们必须再创建一个对象存储，`users`。 所以，现在我们的数据库版本将是2。
```javascript
let openIdbRequest = window.indexedDB.open('booksdb', 2) // New Version - 2

/* Success and error event handlers remain the same.
The onupgradeneeded method gets called when the version of the database changes. */
openIdbRequest.onupgradeneeded = (event) => {
    let db = event.target.result
    if (!db.objectStoreNames.contains('books')) {
        let objectstore = db.createObjectStore('books', { keyPath: 'id' })
    }

    let oldVersion = event.oldVersion
    let newVersion = event.newVersion

    /* The users tables should be added for version 2. If the existing version is 1, it will be upgraded to 2, and the users object store will be created. */
    if (oldVersion === 1) {
        db.createObjectStore('users', { keyPath: 'id' })
    }
}
```
我们在打开请求的成功事件处理程序中缓存了dbInstance。 要在IndexedDB中检索或添加数据，我们将使用dbInstance。让我们在图书对象商店中添加一些图书记录。
```javascript
let transaction = dbInstance.transaction('books')
let objectstore = dbInstance.objectstore('books')

let bookRecord = {
    id: '1',
    name: ’The Alchemist',
    author: 'Paulo Coelho'
}
let addBookRequest = objectstore.add(bookRecord)

addBookRequest.onsuccess = (event) => {
    console.log('Book record added successfully')
}

addBookRequest.onerror = (event) => {
    console.log(’There was an error in adding book record')
}

```
我们使用`transactions`，特别是在对象存储上写入记录时。 事务只是确保数据完整性的操作的包装器。如果事务中的任何操作失败，则不对数据库执行任何操作。

让我们用put方法修改一本书记录：
```javascript
let modifyBookRequest = objectstore.put(bookRecord) // put method takes in an object as the parameter
modifyBookRequest.onsuccess = (event) => {
    console.log('Book record updated successfully')
}
```
让我们用get方法检索一本书记录：
```javscript
let transaction = dbInstance.transaction('books')
let objectstore = dbInstance.objectstore('books')

/* get method takes in the id of the record */
let getBookRequest = objectstore.get(1)

getBookRequest.onsuccess = (event) => {
    /* event.target.result contains the matched record */
    console.log('Book record', event.target.result)
}

getBookRequest.onerror = (event) => {
    console.log('Error while retrieving the book record.')
}
```
### 添加ICON到主屏幕

既然PWA和原生应用程序之间几乎没有任何区别，那么为PWA提供一个主要位置是有意义的。如果您的网站符合PWA的基本标准（托管在HTTPS上，与service worker集成并具有manifest.json），并且在用户花了一些时间在网页上之后，浏览器将在底部调用提示，询问 用户将应用程序添加到其主屏幕，如下所示：

![](https://user-gold-cdn.xitu.io/2018/11/29/1675f2d8e4f3bab8?w=1600&h=2844&f=png&s=2035972)
当用户点击“将FT添加到主屏幕”时，PWA可以将其设置在主屏幕以及应用程序抽屉中。当用户在其手机上搜索任何应用程序时，将列出与搜索查询匹配的任何PWA。 系统设置中也会显示它们，这使用户可以轻松管理它们。 从这个意义上讲，PWA的行为类似于原生应用程序。

PWA使用manifest.json来提供此功能。 让我们看一个简单的manifest.json文件。
```json
{
    "name": "Demo PWA",
     "short_name": "Demo",
     "start_url": "/?standalone",
     "background_color": "#9F0C3F",
     "theme_color": "#fff1e0",
     "display": "standalone",
     "icons": [{
          "src": "/lib/img/icons/xxhdpi.png?v2",
          "sizes": "192x192"
     }]
}

```
short_name显示在用户的主屏幕和系统设置中。该名称将显示在Chrome提示符和启动屏幕上。启动画面是用户在应用程序准备启动时看到的内容。 start_url是您应用的主屏幕。这是用户点击主屏幕上的图标时获得的内容。 background_color用于初始屏幕。 theme_color设置工具栏的颜色。显示模式的独立值表示应用程序将以全屏模式运行（隐藏浏览器的工具栏）。当用户安装PWA时，其大小仅为千字节，而不是兆字节的原生应用程序。

service worker，Web推送通知，IndexedDB和主屏幕位置弥补了离线支持，可靠性和参与度。应该注意的是，service worker没有激活并且在第一次加载时开始工作。在缓存所有静态资产和其他资源之前，第一个加载仍然很慢。我们可以实施一些策略来优化第一次加载。

### 打包资源
所有资源，包括HTML，样式表，图像和JavaScript，都将从服务器中获取。 文件越多，获取它们所需的HTTPS请求就越多。 我们可以使用像WebPack这样的打包工具打包我们的静态资源，从而减少对服务器的HTTP请求数量。WebPack通过使用诸如代码分割之类的技术（即仅打包当前页面加载所需的那些文件，而不是将所有这些文件打包在一起）和treeShaking（即删除重复的依赖项或 导入但未在代码中使用的依赖项）。
### 减少循环调用
网络延迟的主要原因之一是网络延迟。一个字节从A行进到B所需的时间因网络连接而异。例如，通过Wi-Fi进行的特定往返行程在3G连接上需要50毫秒和500毫秒，而在2G连接上需要2500毫秒。这些请求是使用HTTP协议发送的，这意味着当某个特定连接用于请求时，在提供前一个请求的响应之前，它不能用于任何其他请求。一个网站一次可以发出六个异步HTTP请求，因为网站可以使用六个连接来发出HTTP请求。一般的网站提出大约100个请求;因此，如果最多有六个连接可用，用户最终可能会在一次往返中花费大约833毫秒。 （计算是833毫秒 -  100/6 = 1666.我们必须将1666除以2，因为我们正在计算往返时间。）在HTTP2到位的情况下，周转时间大大缩短。HTTP2不会阻止连接头，因此可以同时发送多个请求。

大多数HTTP响应包含`last-modified`和`Etag`标头。`last-modified`的标头是上次修改文件的日期，`Etag`是基于文件内容的唯一值。只有在更改文件内容时才会更改它。如果缓存版本已在本地可用，则可以使用这两个标头来避免再次下载文件。如果浏览器在本地提供此文件的版本，则可以在请求中添加以下两个标头中的任何一个：

![](https://user-gold-cdn.xitu.io/2018/11/29/1675f349c25ec616?w=1600&h=492&f=png&s=253732)
服务器可以检查文件的内容是否已更改。 如果文件的内容没有改变，则它以状态代码304（未修改）响应。

![](https://user-gold-cdn.xitu.io/2018/11/29/1675f3596ee3ab1a?w=1600&h=510&f=png&s=263473)
这表示浏览器使用本地可用缓存的文件版本，为了做到这一切，我们阻止文件被下载。

现在的情况是快速响应，但我们的工作还没完，我们任然需要去解析HTML，加载css样式，使页面可交互。显示一些空元素盒子是有必要的，而不是一个blank屏幕。当HTML文档开始解析，当遇到`<script src='asset.js'></script>`,他将发起一个异步请求到服务器获取`asset.js`，这时，整个渲染进程将会被阻塞直到返回数据。想象一下如果有很多异步获取静态资源请求，在`script`标签中使用`async`将会是个好的选择，例如：`<script src='asset.js' async></script>.`
通过在此处引入async关键字，浏览器将发出异步请求以获取asset.js，而不会妨碍HTML的解析。如果稍后需要脚本文件，我们可以推迟下载该文件，直到整个HTML被解析为止。 可以使用defer关键字来延迟脚本文件，例如`<script src ='asset.js'defer> </ script>` 。


## 结论
我们已经学到了很多新东西，这些东西都是很酷的Web应用程序。 以下是我们在本文中探讨的所有内容的摘要：

1. `service worker`充分利用缓存来加速资源的加载。
2. `Web`推送通知在引擎盖下工作。
3. 我们使用`IndexedDB`来存储大量数据。
4. 一些即时首次加载的优化，如使用`HTTP2`和添加headers标签，如`Etag`，`last-modified`和`If-None-Match`，可防止下载有效的缓存资源。