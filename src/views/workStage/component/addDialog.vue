<template>
  <el-dialog @close="close" class="dialog-title-input" :close-on-click-modal="false"
             v-model="dialogVisible" width="50%" style="height: 600px;overflow-y: scroll;position: relative" center>
    <template #header>
      <div>
        <el-input :disabled="clickStatus==='detail'" v-model="ruleForm.title" type="text" placeholder="请输入问题简述" />
      </div>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      :disabled="clickStatus==='detail'"

    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="学校名称" prop="school_name">
            <el-input v-model="ruleForm.school_name" @change="searchCode(ruleForm.school_name)" placeholder="请输入学校名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学校编码" prop="school_code">
            <el-input readonly v-model="ruleForm.school_code" placeholder="请先输入学校名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统" prop="xt" required>
            <el-select v-model="ruleForm.xt" class="m-2" placeholder="请选择系统名称">
              <el-option
                v-for="item in xtOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="创建人" prop="create_people">
            <el-input v-model="ruleForm.create_people" readonly placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优先级" prop="priority" required>
            <el-radio-group v-model="ruleForm.priority" size="small">
              <el-radio-button label="紧急" />
              <el-radio-button label="高" />
              <el-radio-button label="中" />
              <el-radio-button label="低" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理人" prop="process_people">
            <el-select filterable v-model="ruleForm.process_people" @visible-change="getProcessPeopleList" class="m-2"
                       placeholder="请选择处理人">
              <el-option
                v-for="item in processPeopleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" required>
            <el-switch v-model="ruleForm.status" :active-value="1" :inactive-value="0"
                       inline-prompt active-text="已处理" inactive-text="待处理"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="program_type" required>
            <el-radio-group v-model="ruleForm.program_type" size="small">
              <el-radio-button label="bug" />
              <el-radio-button label="更新" />
              <el-radio-button label="定制" />
            </el-radio-group>

          </el-form-item>
        </el-col>
        <el-row>

        </el-row>
        <el-col :span="12">
          <el-form-item label="创建时间" prop="create_time">
            <el-date-picker
              v-model="ruleForm.create_time"
              type="datetime"
              placeholder="fff"
              readonly
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="ruleForm.remark"
                      placeholder="备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="clickStatus!=='detail'">
          <el-form-item prop="fileList">
            <el-upload
              ref="uploadRef"
              class="upload-demo"
              multiple
              drag
              :auto-upload="false"
              :on-change="beforeUpload"
              v-model:file-list="uploadFileList"
              :on-progress="importSubmit"
            >
              <el-icon class="el-icon--upload">
                <UploadFilled />
              </el-icon>
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  pdf/png/jpg/jpeg/xlsx/txt/docx/xls/doc/zip files
                </div>
              </template>
            </el-upload>

          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="downloadFileList.length!==0">
          <h4>已上传文件列表</h4>
            <div style="display: flex;align-items: center;justify-items: flex-start;margin-top: 10px;"
                 v-for="item in downloadFileList" @click="download(item)">
              <el-image style="width: 30px;padding-right: 10px" :src="displayIcon(item)"></el-image>
              <div>{{ item.slice(14) }}</div>
            </div>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item prop="content">
          <QuillEditor style="width: 100%;max-height: 200px" content-type="html" :readOnly="quillReadOnlyValue"
                       v-model:content="ruleForm.content" theme="snow" :options="editorOption" />
        </el-form-item>
      </el-row>
    </el-form>

    <div style="height: 30px;"></div>
    <template #footer>
      <div class="dialog-footer" style="padding-top: 50px" v-show="clickStatus!=='detail'">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
      </div>
    </template>

  </el-dialog>
</template>
<script lang="ts" setup>
import { UploadFilled } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
import { ElMessage, FormInstance, ElNotification } from "element-plus";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import { getSchoolCodeInfo, getSchoolInfo } from "@/api/schoolList";
import type { UploadUserFile } from "element-plus";
import { useUserStore } from "@/store/modules/user";
import { userList } from "@/api/user";
import { addProgram, editProgram, uploadFile } from "@/api/workStage";
import { useCommonStore } from "@/store/modules/common";
import { parseTime } from "@/utils";
import IconDoc from "@/assets/fileReport/icon-doc.png";
import IconXls from "@/assets/fileReport/icon-xls.png";
import IconPpt from "@/assets/fileReport/icon-ppt.png";
import IconPdf from "@/assets/fileReport/icon-pdf.png";
import IconTxt from "@/assets/fileReport/icon-txt.png";
import IconZip from "@/assets/fileReport/icon-zip.png";
import IconRar from "@/assets/fileReport/icon-rar.png";
import IconImage from "@/assets/fileReport/icon-image.png";
import IconNone from "@/assets/fileReport/icon-none.png";
import { storeToRefs } from "pinia";


const dialogVisible = ref<boolean>(false);

//获取当前用户信息
const UserStore = useUserStore();
const userInfo = computed(() => UserStore.userInfo);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  id: "",
  title: "",
  school_code: "",
  school_name: "",
  xt: "",
  create_people: userInfo.value.name,
  priority: "紧急",
  process_people: userInfo.value.name,
  program_type: "bug",
  status: "0",
  remark: null,
  create_time: parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}"),
  content: ref(""),
  fileList: ref("")
});
const rules = reactive({
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  school_name: [{ required: true, message: "请输入学校名称", trigger: "blur" }],
  school_code: [{ required: true, message: "请先填写学校名称", trigger: "blur" }],
  xt: [{ required: true, message: "请选择系统", trigger: "blur" }],
  create_people: [{ required: true, message: "请输入", trigger: "blur" }],
  process_people: [{ required: true, message: "请选择处理人", trigger: "change" }],
  program_type: [{ required: true, message: "请选择项目分类", trigger: "change" }],
  create_time: [{ type: "date", required: false, message: "请选择时间", trigger: "change" }]
});

//根据学校名称查找学校编码
const searchCode = async (name) => {
  let codeInfo = await getSchoolCodeInfo(name);
  let codeInfoResult = codeInfo.data;
  if (!codeInfoResult.success) {
    ElNotification({
      message: codeInfoResult.msg,
      type: "warning",
      duration: 3000
    });
    return;
  } else if (codeInfoResult.data === null) {
    ElNotification({
      message: "无法查询到该学校，请重新输入",
      type: "warning",
      duration: 3000
    });
    ruleForm.school_code = "";
    return;
  }
  ruleForm.school_code = codeInfoResult.data[0].school_code;
  ruleForm.school_name = codeInfoResult.data[0].school_name;
};


//xt 下拉optionList
const xtOptions = ref([]);
const getXtList = async (a) => {
  xtOptions.value = [];
  let schoolInfo = await getSchoolInfo(a);
  let searchInfoResult = schoolInfo.data.data;
  if (searchInfoResult[0].xt === null) {
    xtOptions.value = [];
    return;
  }
  searchInfoResult.forEach(item => {
    xtOptions.value.push({
      label: item.xt,
      value: item.xt
    });
  });
};
//获取userList----处理人optionList
const processPeopleOptions = ref([]);
const getProcessPeopleList = async () => {
  processPeopleOptions.value = [];
  let a = await userList();
  let userListResult = a.data.data;
  userListResult.forEach(item => {
    processPeopleOptions.value.push({
      label: item.name,
      value: item.code
    });
  });
};

//文件上传及下载部分
const uploadFileList = ref<UploadUserFile[]>();
const uploadRef = ref<FormInstance>();

const downloadFileList = reactive([]);
const download = (item) => {
  // window.location.href = "http://127.0.0.1:7001/" + "public/upload/" + item;
  window.open("http://127.0.0.1:7001/" + "public/upload/" + item);
};
const beforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
  console.log("4444444444444444444444", rawFile);

  // if (rawFile.type !== 'pdf/png/jpg/jpeg/xlsx/txt/docx/xls/doc/zip') {
  //   ElMessage.error('请根据提示选择相应格式的文件!')
  //   return false
  // } else
  let rfr: any = uploadRef.value;
  if (rawFile.size / 1024 / 1024 > 2) {
    rfr.handleRemove(rawFile);
    ElMessage.error("文件大小不得超过2MB!");
    return false;
  }
  return true;
};

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
  let r = type.substring(type.lastIndexOf("."));
  switch (r) {
    case ".docx":
    case ".doc":
      return IconDoc;
    case ".xlsx":
    case ".xls":
      return IconXls;
    case ".ppt":
    case ".pptx":
      return IconPpt;
    case ".pdf":
      return IconPdf;
    case ".txt":
      return IconTxt;
    case ".zip":
      return IconZip;
    case ".rar":
      return IconRar;
    case ".jpg":
    case ".bmp":
    case ".gif":
    case ".png":
      return IconImage;
    default:
      return IconNone;
  }
};

// 富文本编辑器配置
// https://vueup.github.io/vue-quill/api/events.html
const quillReadOnlyValue = ref<boolean>(false);
let editorOption = {
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
      [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
      [{ align: [] }], // 对齐方式
      [{ size: ["small", false, "large", "huge"] }], // 字体大小
      [{ font: [] }], // 字体种类
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
      [{ direction: "ltl" }], // 文本方向
      [{ direction: "rtl" }], // 文本方向
      [{ indent: "-1" }, { indent: "+1" }], // 缩进
      [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
      [{ script: "sub" }, { script: "super" }], // 上标/下标
      ["blockquote", "code-block"], // 引用  代码块
      ["clean"], // 清除文本格式
      ["link", "image", "video"] // 链接、图片、视频
    ]
  }
};


//打开或关闭模态窗的初始化以及清空部分
const submitType = ref("add");
const commonStore = useCommonStore();
const { clickStatus } = storeToRefs(commonStore);
const show = (item = {}) => {
  if (item["title"]) {
    submitType.value = "edit";
    Object.keys(item).forEach(key => {
      ruleForm[key] = item[key];
      if (ruleForm[key] !== null && key === "fileList") {
        let e = JSON.parse(ruleForm[key]);
        downloadFileList.push(...e);
      }
    });
    dialogVisible.value = true;
  } else {
    submitType.value = "add";
    dialogVisible.value = true;
  }


};

function abortUpload() {
  console.log("取消");
  this.$refs.uploadRef.abort(); // 调用 abort 方法中止上传
}

function importSubmit(e, file, fileList) {
  // 解析上传的文件
  // let file = this.uploadFiles[0]
  let reader = new FileReader();
  // abort none 中断读取
  // readAsBinaryString file 将文件读取为二进制码，通常我们将它传送到后端，后端可以通过这段字符串存储文件
  // readAsDataURL file 将文件读取为 DataURL，一段以 data: 开头的字符串，这段字符串的实质就是 Data URL，Data URL是一种将小文件直接嵌入文档的方案。这里的小文件通常是指图像与 html 等格式的文件
  // readAsText file, [encoding] 将文件读取为文本，读取的结果即是这个文本文件中的内容
  reader.readAsText(file.raw);
  // onabort 中断时触发
  // onerror 出错时触发
  // onload 文件读取成功完成时触发
  // onloadend 读取完成触发，无论成功或失败
  // onloadstart 读取开始时触发
  // onprogress 读取中
  reader.onabort = (e) => {
    // 读取文件内容
    console.log("看看进来没");
    const fileString = e.target.result;
    // 接下来可对文件内容进行处理
  };
}


function close() {
  ruleFormRef.value.resetFields();
  uploadFileList.value = [];
  downloadFileList.length = 0;
  Object.keys(ruleForm).forEach(key => {
    switch (key) {
      case "priority":
        return ruleForm[key] = "紧急";
      case "status":
        return ruleForm[key] = "0";
      case "create_people":
        return ruleForm[key] = userInfo.value.name;
      case "program_type":
        return ruleForm[key] = "bug";
      case "create_time":
        return ruleForm[key] = parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
      case "content":
        return ruleForm[key] = " ";
      default:
        return ruleForm[key] = null;
    }
  });
}


//提交

const handleClose = async (done: () => void) => {
  if (!ruleForm.title) {
    ElMessage({
      type: "error",
      message: "请填写项目标题"
    });
    return;
  }
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (uploadFileList.value) {
        // FormData模式可以同时上传数据与文件，一次性
        let fd = new FormData();
        fd.set("dd", "333");
        // 统一获取，一次性上传，且可控，配合页面其他数据提交
        uploadFileList.value.map((file) => {
          fd.append("files", file.raw);
        });
        let d = await uploadFile(fd);
        let result = d.data;
        if (!result.success) {
          ElMessage({
            type: "error",
            message: result.msg
          });
          return;
        }
        ruleForm.fileList = result.data.fileNameArray;
      }
      if (submitType.value === "edit") {
        let a = await editProgram(ruleForm);
        let currentResult = a.data;
        if (!currentResult.success) {
          ElMessage({
            type: "error",
            message: currentResult.msg
          });
          return;
        } else {
          ElMessage({
            type: "success",
            message: "提交成功"
          });
        }
      } else {
        let a = await addProgram(ruleForm);
        let currentResult = a.data;
        if (!currentResult.success) {
          ElMessage({
            type: "error",
            message: currentResult.msg
          });
          return;
        } else {
          ElMessage({
            type: "success",
            message: "提交成功"
          });
        }
      }
      dialogVisible.value = false;
      commonStore.selectedSchoolName = "";
      // commonStore.updateTable();
    } else {
      console.log("error submit!", fields);
    }
  });
};


watch(() => ruleForm.school_code, async (a) => {
  await getXtList(a);
});
defineExpose({
  show
});


</script>
<style lang="scss" scoped>
@import "../index.scss";

::v-deep(.el-input__wrapper) {
  box-shadow: 0 0 0 0px;
}

::v-deep(.el-dialog__footer) {
  padding-top: 65px;
}

</style>

