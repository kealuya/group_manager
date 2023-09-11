import request from "@/api/request";

export function callDocFileList(p: PagingInfo) {
    return request.post<BackendData<DocFileList>>("/file/getDocFileList", p);
}

export interface DocFileList {
    docFiles: Array<DocFile>,
    count: number
}


export function callNewDoc(file: DocFile) {
    return request({
        url: "/file/newDoc",
        method: "post",
        data: file
    });
}

export function callUpdateDoc(file: DocFile) {
    return request({
        url: "/file/updateDoc",
        method: "post",
        data: file
    });
}

export function callAuthorityDoc(file: DocFile) {
    return request({
        url: "/file/updateAuthorityDoc",
        method: "post",
        data: file
    });
}


