import Layout from "@/layout/index.vue";

const systemSettingRouter = [{
  path: '/systemSetting',
  component:Layout,
  redirect: '/systemSetting/index',
  name: 'systemSetting',
  meta: {
    title:"系统设置",
    icon:'',
  },
  children:[
    {
      path:'/systemSetting/index',
      component:() => import('@/views/systemSetting/index.vue'),
      name: 'systemSettingBox',
      meta: { title: '系统设置', icon: 'Setting'  }

    }
  ]
}]
export default systemSettingRouter
