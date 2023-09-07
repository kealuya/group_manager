import Layout from "@/layout/index.vue";

const schoolManageRouter = [{
  path: '/schoolManage',
  component:Layout,
  redirect: '/schoolManage/index',
  name: 'schoolManage',
  meta: {
    title:"学校管理",
    icon:'',
  },
  children:[
    {
      path:'/schoolManage/index',
      component:() => import('@/views/schoolManage/index.vue'),
      name: 'schoolManageBox',
      meta: { title: '学校管理', icon: 'School'  }

    }
  ]
}]
export default schoolManageRouter
