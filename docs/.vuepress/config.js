module.exports = {
  title: 'Ioodu Land',
  description: "Ioodu's blog, About web front end development and everything →",
  head:[
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  dest: 'dist',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Front-End', link: '/frontend/' }
    ],
    sidebar: 'auto',
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: 'Last Updated',
    repo: 'chinadbo/blog',
    repoLabel: '查看源码',
    docsRepo: 'chinadbo/blog',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: '帮助改善页面！',
    copyRight: 'Ioodu@2014-present'
  }
}