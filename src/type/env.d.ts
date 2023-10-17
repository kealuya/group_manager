/// <reference types="vite/client" />

declare module "*.vue" {
    import { DefineComponent } from "vue";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare type PagingInfo = {
    proId: number
    page: number
    pageSize: number
    sortCol: object
    search: string
}

declare interface DocFile {
    docId: string;
    updateDate: string;
    createDate: string;
    docName: string;
    fileName: string; // 是指存储到obs里file的名称
    updateUser: string; // 加工
    updateContent: string;
    versionShow: string;
    docType: string;
    isRelease: string;
    isOwnerEdit: string;
    isDiscard: string;
    owner: string; // 加工
    ownerId: string;
    proId: string;
    updateContentList: Array<{ [string: string], string }>;
}

declare interface WorkInfo {
    create_people:string,
    create_time:string,
    priority:string,
    process_people:string,
    program_type:string,
    remark:string
    school_code:string,
    school_name:string,
    status:string,
    title:string,
    xt:string,
}

declare interface User {
    phoneNumber: string;
    userName: string;
    token: string;
    expire: string;
    unique: string;
    isDisable: string;
}

declare interface Project {
    proId: string;
    proName: string;
    proLogo: string;

}

declare interface HttpResponse {
    data: object;
    msg: string;
    success: boolean;
}

declare module "vue-countup-v2";

declare interface BackendData<T> {
    success: boolean;
    msg: string;
    data: T;
}
