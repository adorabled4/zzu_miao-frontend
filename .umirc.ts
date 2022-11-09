import { defineConfig } from 'umi';
export default defineConfig({
  dva: {},
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},

  routes: [
    {
      name: '注册页',
      icon: 'smile',
      path: '/user/register',
      component: './User/Register',
    },
    {
      path  : '/user',
      routes:[
        {name : '注册页', icon:'smile' ,path:'/user/register',component: './User/Register', exact: false},
        {name : '登录页', icon:'smile' ,path:'/user/login',component: './User/Login'},

      ],
    },
    {
      name: '搜索列表（应用）',
      icon: 'smile',
      path: '/list/search/applications',
      component: './List/Search/Applications',
    },
    {
      path: '/',
      component: '@/pages/index',
    },
  ],



  proxy: {
    '/api': { //设置以api 结尾的路径需要代理 => 那么我们就可以修改prefiux
      'target': 'http://localhost:8080', // 代理的路径
      'changeOrigin': true,
      // 'pathRewrite': { '^/api' : '' },  这个rewrite 会把  原本的 /api 移除 ,
      // 比如访问 8000/user/login 先经过prefix变成  8000/api/user/login, 然后经过代理变成  8080/api/user/login
      //但是如果我们加一个   'pathRewrite': { '^/api' : '' },  就会变成 8080/user/login
    },
  },
  // proxy: {
  //   '/api': {
  //     'target': 'http://jsonplaceholder.typicode.com/',
  //     'changeOrigin': true,
  //     'pathRewrite': { '^/api' : '' },
  //   },
  // },
});
