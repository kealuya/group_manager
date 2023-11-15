<template>
  <div class="app-container">
    <div class="card">
      <div style="width:100%;display: flex;justify-content: space-between">
        <div>
          <el-button type="primary" @click="fileUpdate(UPLOAD_MODAL_MODE.NEW)">
            新建文档
            <div style="width: 10px;"></div>
            <el-image style="width: 20px; height: 20px" :src="IconNewFile"></el-image>
          </el-button>
        </div>
        <el-input style="width:600px" v-model="searchContent" placeholder="检索" class="input-with-select"
                  @change="searchContentChange ">
          <template #prepend>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>
      <div style="height: 20px;"></div>
      <el-table
        :stripe="true"
        :data="tableData"
        @sort-change="sortChange"
        :default-sort="{prop:'updateDate',order:'descending'}"
        style="width: 100%"
      >
        <el-table-column width="60">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image style="width: 40px; height: 40px" :src="displayIcon(scope.row.docType)"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="名称" min-width="300">
          <template #default="scope">
            <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">
                 {{ scope.row.docName }}
             </span>


            </div>
          </template>
        </el-table-column>

        <el-table-column label="" min-width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <div style="display: flex; align-items: center">
                <el-image @click="downloadClickFile(scope.row.fileName,scope.row.docName )"
                          style="width: 20px; height: 20px" :src="IconDownload"></el-image>
              </div>
              <div style="width: 30px"></div>
              <!--            <div style="display: flex; align-items: center">-->
              <!--              <el-image @click="reviewClickFile(scope.row.file_name)" style="width: 20px; height: 20px"-->
              <!--                        src="/review.png"></el-image>-->
              <!--            </div>-->
            </div>
          </template>
        </el-table-column>

        <el-table-column label="版本" min-width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.versionShow }}</span>
              <el-popover placement="right" :width="200" trigger="hover">
                <template #reference>
                  <div style="display: flex; align-items: center">
                    <el-image style="width: 20px; height: 20px" :src="IconList"></el-image>
                  </div>
                </template>
                <el-table :data=" scope.row.updateContentList ">
                  <el-table-column width="80" property="versionShow" label="版本" />
                  <el-table-column width="120" property="updateContent" label="更新内容" />
                </el-table>
              </el-popover>

              <template v-if="scope.row.isRelease===true">
                <div class="release">
                  发布
                </div>
              </template>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="update_date" label="更新时间" sortable="custom" min-width="140">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ timeChange(scope.row.updateDate) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="更新人" min-width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.updateUser }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="create_date" label="追加时间" sortable="custom" min-width="140">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ timeChange(scope.row.createDate) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="所有者" min-width="50">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.owner }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="120">
          <template #default="scope">
            <template v-if="scope.row.isDiscard=='true'">
              <el-button type="primary" plain disabled> 操作
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
            </template>
            <template v-else>
              <el-dropdown>
                <el-button type="primary">
                  操作
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="fileUpdate(UPLOAD_MODAL_MODE.UPLOAD,scope.row)">更新上传
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="fileAuthority(scope.row)">权限调整</el-dropdown-item>
                    <el-dropdown-item @click="fileDiscard(scope.row)">废弃文档</el-dropdown-item>
                    <el-dropdown-item @click="fileHistory">版本历史</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 20px"></div>
      <el-pagination background layout="prev, pager, next" v-model:currentPage="currentPage" :page-count="pageCount" />
    </div>

    <!--ref用来获取上传文件列表，multipe多传，禁止自动上传-->
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      multiple
      :auto-upload="false"
      v-model:file-list="uploadFileList"
    >
      <template #trigger>
        <el-button type="primary">select file</el-button>
      </template>

      <el-button class="ml-3" type="success" @click="submitUpload">
        upload to server
      </el-button>

      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>

  </div>
  <UploadModal v-model="uploadModalDialogVisible" :mode="uploadModalMode" :item="selectFile"
               @updateSuccess="updateSuccess"></UploadModal>

  <DiscardModal v-model="discardModalDialogVisible" :item="selectFile"
                @discardSuccess="discardSuccess"></DiscardModal>

  <AuthorityModal v-model="authorityModalDialogVisible" :item="selectFile"
                  @authoritySuccess="authoritySuccess"></AuthorityModal>
</template>

<script lang="ts" setup>

import type { UploadUserFile } from "element-plus";
// @ts-ignore
import { ArrowDown, Search } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, watchEffect } from "vue";
import { ElLoading, ElMessageBox } from "element-plus/es";
// import { ElNotification } from "element-plus/es/components/notification";
import { Base64 } from "js-base64";
import UploadModal from "@/components/FileReport/UploadModal.vue";
import DiscardModal from "@/components/FileReport/DiscardModal.vue";
import AuthorityModal from "@/components/FileReport/AuthorityModal.vue";
/*
  [Bug Report] ElNotification样式错乱 #5968
  https://github.com/element-plus/element-plus/issues/5968
  https://github.com/element-plus/element-plus/issues/5667
  ElNotification 样式错乱问题
  需要手动引入对应组件的样式，才可以。暂时发现【ElNotification】【ElMessageBox】
 */
import "element-plus/es/components/notification/style/index";
// import {UPLOAD_MODAL_MODE} from "~/enum";
import { UPLOAD_MODAL_MODE } from "@/utils/common";
import { useRoute } from "vue-router";
import { callDocFileList, DocFileList, uploadFile } from "@/api/fileReport/doc";
import { downLoadFile, OBS_URL, timeChange } from "@/api/fileReport/common";
import IconDownload from "@/assets/fileReport/download.png";
import IconList from "@/assets/fileReport/list.png";
import IconDoc from "@/assets/fileReport/icon-doc.png";
import IconXls from "@/assets/fileReport/icon-xls.png";
import IconPpt from "@/assets/fileReport/icon-ppt.png";
import IconTxt from "@/assets/fileReport/icon-txt.png";
import IconPdf from "@/assets/fileReport/icon-pdf.png";
import IconZip from "@/assets/fileReport/icon-zip.png";
import IconImage from "@/assets/fileReport/icon-image.png";
import IconRar from "@/assets/fileReport/icon-rar.png";
import IconNone from "@/assets/fileReport/icon-none.png";
import IconNewFile from "@/assets/fileReport/icon-new-file.png";
import { makeArrayObjHumpToLine } from "@/utils";

const uploadFileList = ref<UploadUserFile[]>();

const downloadFileList = reactive([]);
const moniFilelist = "[11,22]";
let arrayFilelist = JSON.parse(moniFilelist);
downloadFileList.push(...arrayFilelist);


const submitUpload = async () => {
  // FormData模式可以同时上传数据与文件，一次性
  let fd = new FormData();
  fd.set("dd", "333");
  // 统一获取，一次性上传，且可控，配合页面其他数据提交
  uploadFileList.value.map((file) => {
    fd.append("files", file.raw);
  });
  let d = await uploadFile(fd);
  console.log(d);
};


type  ParamObject = { [key: string]: string }

const PAGE_SIZE: number = 10;
const tableData: DocFile[] = reactive([]);
const pageCount = ref<number>(1);
const currentPage = ref<number>(1);
const projectId: string = useRoute().query.projectId as string;
const sortCol = reactive<ParamObject>({ "update_date": "descending" });
const searchContent = ref("");
const searchContentObj = ref("");

const displayIcon = (type: string): any => {
  /*
   IconDoc
   IconXls
   IconPdf
   IconPpt
   IconTxt
   IconZip
   IconImag
   IconFold
   IconRar
   IconNone
   */
  switch (type) {
    case "docx":
    case "doc":
      return IconDoc;
    case "xlsx":
    case "xls":
      return IconXls;
    case "ppt":
    case "pptx":
      return IconPpt;
    case "pdf":
      return IconPdf;
    case "txt":
      return IconTxt;
    case "zip":
      return IconZip;
    case "rar":
      return IconRar;
    case "jpg":
    case "bmp":
    case "gif":
    case "png":
      return IconImage;
    default:
      return IconNone;
  }

};

onMounted(async () => {


});

// 检索定义
const getDocFileList = async (p: PagingInfo) => {

  let response = await callDocFileList(p);
  const res: BackendData<DocFileList> = response.data;
  if (res.success) {
    tableData.length = 0;

    console.log(res);

    let data = res.data as { docFiles: Array<DocFile>, count: number };

    tableData.push(...makeArrayObjHumpToLine<DocFile>(data.docFiles));
    pageCount.value = Math.ceil(data.count / PAGE_SIZE);
  } else {
    await ElMessageBox.alert(res.msg, "提示", {
      confirmButtonText: "好的",
      callback: () => {
      }
    });
  }

};

watchEffect(
  async () => {
    let p: PagingInfo = {
      proId: parseInt(projectId),
      page: currentPage.value,
      pageSize: PAGE_SIZE,
      sortCol: sortCol,
      // search: {}
      search: searchContentObj.value
    };
    console.log("watchEffect", p);
    await getDocFileList(p);
  }
);
const searchContentChange = async (value: string) => {
  console.log(value);
  searchContentObj.value = value;
  currentPage.value = 1;

};

const downloadClickFile = (fileName: string, docName: string) => {
  downLoadFile(OBS_URL + fileName, docName);
};

const reviewClickFile = (fileName: string) => {
  window.open("http://science.qcykj.com.cn:8012/onlinePreview?url=" + encodeURIComponent(Base64.encode(OBS_URL + fileName)));
};


const sortChange = async (column: any) => {
  // console.log(column);
  Object.keys(sortCol).forEach(key => delete sortCol[key]);
  if (column.prop !== null) {
    sortCol[column.prop] = column.order;
  }
  currentPage.value = 1;

};


const headerData: DocFile[] = reactive([]);


const uploadModalDialogVisible = ref(false);
const selectFile = ref<DocFile>();
const uploadModalMode = ref<String>();
const fileUpdate = (type: UPLOAD_MODAL_MODE, item?: DocFile) => {
  if (type == UPLOAD_MODAL_MODE.NEW) {
    selectFile.value = { proId: projectId } as DocFile;
    console.log('新建文档selectFile.value',selectFile.value)
    uploadModalMode.value = UPLOAD_MODAL_MODE.NEW;
  } else if (type == UPLOAD_MODAL_MODE.UPLOAD) {
    selectFile.value = { ...item!, "proId": projectId };

    console.log(selectFile.value);

    uploadModalMode.value = UPLOAD_MODAL_MODE.UPLOAD;
  }
  uploadModalDialogVisible.value = true;
};
const updateSuccess = async () => {
  console.log("更新list");
  currentPage.value = 1;
  let p: PagingInfo = {
    proId: parseInt(projectId),
    page: currentPage.value,
    pageSize: PAGE_SIZE,
    sortCol: sortCol,
    search: searchContentObj.value
  };
  await getDocFileList(p);
};

const discardSuccess = () => {
  console.log("删除");
  updateSuccess();
};
const discardModalDialogVisible = ref(false);
const fileDiscard = (item: DocFile) => {
  selectFile.value = { ...item!, "proId": projectId };
  discardModalDialogVisible.value = true;
};

const authoritySuccess = () => {
  console.log("权限更新成功");
  updateSuccess();
};
const authorityModalDialogVisible = ref(false);
const fileAuthority = (item: DocFile) => {
  selectFile.value = { ...item!, "proId": projectId };
  authorityModalDialogVisible.value = true;
};

const fileHistory = () => {
  // ElNotification({
  //   title: "版本历史",
  //   message: "等等，下次再说",
  //   type: "warning",
  //   offset: 300
  // });
};

onMounted(async () => {
  const loadingInstance = ElLoading.service({ fullscreen: true });
  loadingInstance.close();
});


</script>
<style>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 16px;
  box-sizing: border-box;
  font-size: 14px;
}

.card {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 18px;
  position: relative;
  border-radius: 4px;
  background: white;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}

.record {
  box-shadow: 0px 0px 0px #b4b3b3;
  padding: 0px 20px 0px 20px;
  border: 1px solid #e3e2e2;
  transition: all 0.48s ease-out;
}

.record:hover {
  box-shadow: 2px 2px 3px #b4b3b3;
  padding: 0px 20px 0px 20px;
  border: 1px solid #e3e2e2;
}

.release {
  width: 32px;
  height: 24px;
//background-color: var(--ep-color-primary); color: white; border-radius: 4px; text-align: center; font-size: 12px; margin-left: 4px;
}

.imageShow {
  padding-left: 20px;
  height: 200px;
  width: 98%;
  border-radius: 8px;
  filter: blur(4px);
}


</style>
