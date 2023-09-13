<template>
  <div class="app-container">

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
            <el-image style="width: 40px; height: 40px" src="/folder/icon-doc.png"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="400">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">
                 {{ scope.row.doc_name }}
             </span>
            <template v-if="scope.row.is_discard == 'true'">
              <el-image style="width: 20px; height: 20px;margin-left: 10px" src="/discard.png"></el-image>
            </template>
            <template v-else>
              <template v-if="scope.row.is_release == 'true'">
                <el-image style="width: 20px; height: 20px;margin-left: 10px" src="/isRelease.png"></el-image>
              </template>
              <template v-else>
                <el-image style="width: 20px; height: 20px;margin-left: 10px" src="/noRelease.png"></el-image>
              </template>

              <template v-if="scope.row.is_owner_edit == 'true'">
                <el-image style="width: 20px; height: 20px;margin-left: 10px" src="/isOwner.png"></el-image>
              </template>
              <template v-else>
                <el-image style="width: 20px; height: 20px;margin-left: 10px" src="/noOwner.png"></el-image>
              </template>
            </template>


          </div>
        </template>
      </el-table-column>

      <el-table-column label="" min-width="100">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <div style="display: flex; align-items: center">
              <el-image @click="downloadClickFile(scope.row.file_name,scope.row.doc_name )"
                        style="width: 20px; height: 20px" src="/download.png"></el-image>
            </div>
            <div style="width: 30px"></div>
            <div style="display: flex; align-items: center">
              <el-image @click="reviewClickFile(scope.row.file_name)" style="width: 20px; height: 20px"
                        src="/review.png"></el-image>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="版本" min-width="100">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.version_show }}</span>
            <el-popover placement="right" :width="200" trigger="hover">
              <template #reference>
                <div style="display: flex; align-items: center">
                  <el-image style="width: 20px; height: 20px" src="/list.png"></el-image>
                </div>
              </template>
              <el-table :data=" scope.row.update_content_list ">
                <el-table-column width="80" property="versionShow" label="版本" />
                <el-table-column width="120" property="updateContent" label="更新内容" />
              </el-table>
            </el-popover>

            <template v-if="scope.row.is_release===true">
              <div class="release">
                发布
              </div>
            </template>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="updateDate" label="更新时间" sortable="custom" min-width="140">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ timeChange(scope.row.update_date) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="更新人" min-width="100">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.update_user }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="createDate" label="追加时间" sortable="custom" min-width="140">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ timeChange(scope.row.create_date) }}</span>
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
          <template v-if="scope.row.is_discard=='true'">
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
                  <el-dropdown-item @click="fileUpdate(UPLOAD_MODAL_MODE.UPLOAD,scope.row)">更新上传</el-dropdown-item>
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
  <UploadModal v-model="uploadModalDialogVisible" :mode="uploadModalMode" :item="selectFile"
               @updateSuccess="updateSuccess"></UploadModal>

  <DiscardModal v-model="discardModalDialogVisible" :item="selectFile"
                @discardSuccess="discardSuccess"></DiscardModal>

  <AuthorityModal v-model="authorityModalDialogVisible" :item="selectFile"
                  @authoritySuccess="authoritySuccess"></AuthorityModal>
</template>

<script lang="ts" setup>


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
import { callDocFileList, DocFileList } from "@/api/fileReport/doc";
import { downLoadFile, OBS_URL, timeChange } from "@/api/fileReport/common";

type  ParamObject = { [key: string]: string }

const PAGE_SIZE: number = 5;
const tableData: DocFile[] = reactive([]);
const pageCount = ref<number>(1);
const currentPage = ref<number>(1);
const projectId: string = useRoute().query.projectId as string;
const sortCol = reactive<ParamObject>({ "update_date": "descending" });
const searchContent = ref("");
const searchContentObj = ref("");


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
    tableData.push(...data.docFiles);
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
    uploadModalMode.value = UPLOAD_MODAL_MODE.NEW;
  } else if (type == UPLOAD_MODAL_MODE.UPLOAD) {
    selectFile.value = { ...item!, "proId": projectId };
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
  console.log("权限");
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
