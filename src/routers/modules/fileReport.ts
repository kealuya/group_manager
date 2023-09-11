import Layout from "@/layout/index.vue";

const fileReportRouter = [{
    path: "/fileReport",
    component: Layout,
    redirect: "/fileReport/index",
    name: "fileReport",
    meta: {
        title: "文档管理",
        icon: ""
    },
    children: [
        {
            path: "/fileReport/index",
            component: () => import("@/views/fileReport/index.vue"),
            name: "fileReport",
            meta: { title: "文档管理", icon: "Files" }

        }
    ]
}];
export default fileReportRouter;
