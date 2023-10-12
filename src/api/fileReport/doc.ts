import request from "@/api/request";

export function callDocFileList(p: PagingInfo) {
    return request.post<BackendData<DocFileList>>("/file/getDocList", p);
}

export interface DocFileList {
    docFiles: Array<DocFile>,
    count: number
}


export function callNewDoc(file: DocFile) {
    return request.post<BackendData<any>>("/file/newDoc", file);
}

export function callUpdateDoc(file: DocFile) {
    return request.post("/file/updateDoc", file);
}

export function callAuthorityDoc(file: DocFile) {
    return request.post("/file/updateAuthorityDoc", file);
}


