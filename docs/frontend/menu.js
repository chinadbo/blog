{
data: [
    {
      id: 1,
      name: "公眾號個人中心",
      icon: "usergroup-add",
      system: "pms",
      path: "/center",
      routes: [
        {
          id: 2,
          name: "成員管理",
          system: "pms",
          path: "/center/member/member"
        },
        {
          id: 3,
          name: "角色管理",
          system: "pms",
          path: "/center/role/role"
        },
        {
          id: 4,
          name: "帳號管理",
          system: "pms",
          path: "/center/account/account"
        }
      ]
    },
    {
      id: 9,
      name: "媒体管理",
      icon: "book",
      system: "media",
      path: "/story",
      routes: [
        {
          id: 5,
          name: "新增內容",
          system: "media",
          path: "/story/add"
        },
        {
          id: 6,
          name: "我的文章列表",
          system: "media",
          path: "/stories"
        },
        {
          id: 7,
          name: "我的01主頁設定",
          system: "media",
          path: "/theme/settings"
        },
        {
          id: 8,
          name: "我的主頁分類設定",
          system: "media",
          path: "/customized-story-list"
        }
      ]
    }
  ]
  }
