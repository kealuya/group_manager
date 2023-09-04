import Layout from "@/layout/index.vue";

const workStageRouter = [{
  path: '/workStage',
  component:Layout,
  redirect: '/workStage/index',
  name: 'workStage',
  meta: {
    title:"工作台",
    icon:'',
  },
  children:[
    {
      path:'/workStage/index',
      component:() => import('@/views/workStage/index.vue'),
      name: 'workStageBox',
      meta: { title: '工作台', icon: 'chat-square'  }
    }
  ]
}]
export default workStageRouter
