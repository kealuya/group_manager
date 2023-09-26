<template>
  <div class="school-form">
    <el-header class="form-title">
      <el-row>
        <el-col :span="12">
          <el-form-item label="学校" prop="school_name">
            <el-input size="large" class="title-input" style="width: 300px;" v-model="selectedSchoolName"
                      readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学校编码" prop="school_code">
            <el-input size="large" class="title-input" style="width: 300px;" v-model="selectedSchoolCode"
                      readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="primary" @click="dialogVisible = true">立即创建</el-button>
    </el-header>


    <el-dialog
      v-model="dialogVisible"
      title="添加学校"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleFormRefAdd"
        :model="ruleFormAdd"
        label-width="100"
        :rules="rules"
        class="demo-ruleForm"
        :size="formSize"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="学校" prop="school_name">
              <el-input size="large" class="title-input" style="width: 400px;" v-model="ruleFormAdd.school_name"
                        clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校编码" prop="school_code">
              <el-input size="large" class="title-input" style="width: 400px;" v-model="ruleFormAdd.school_code"
                        clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="主负责人" prop="fzr1">
          <el-select v-model="ruleFormAdd.fzr1" filterable placeholder="请选择主负责人">
            <el-option
              v-for="item in userOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="其他负责人" prop="fzr2">
          <el-select v-model="ruleFormAdd.fzr2" filterable placeholder="请选择其他负责人">
            <el-option
              v-for="item in userOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="系统" prop="xt">
          <el-input clearable v-model="ruleFormAdd.xt" />
        </el-form-item>
        <el-form-item label="建设阶段" prop="buildStage">
          <el-select v-model="ruleFormAdd.buildStage" placeholder="建设阶段">
            <el-option label="已部署已推广" value="已部署已推广" />
            <el-option label="部署未实施" value="部署未实施" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务商" prop="service">
          <el-input clearable v-model="ruleFormAdd.service" />
        </el-form-item>
        <el-form-item label="协议签订">
          <el-col :span="11">
            <el-form-item prop="fwsxy_start_date">
              <el-date-picker
                v-model="ruleFormAdd.fwsxy_start_date"
                type="datetime"
                placeholder="选择协议开始签订时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :shortcuts="shortcuts"
              />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="2" style="text-align: center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="fwsxy_end_date">
              <el-date-picker
                v-model="ruleFormAdd.fwsxy_end_date"
                type="datetime"
                placeholder="协议结束签订时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :shortcuts="shortcuts"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="其他协议" prop="qtxy">
          <el-input v-model="ruleFormAdd.qtxy" type="textarea" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleFormAdd.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button @click="resetForm(ruleFormRefAdd)">重置</el-button>
        <el-button type="primary" @click="addSchool(ruleFormAdd)">
          确认提交
        </el-button>
      </span>
      </template>
    </el-dialog>

    <el-main class="form-body">
      <el-scrollbar>
        <el-row :gutter="20">
          <el-col class="body-card" v-for="item in ruleForm" :span="12">
            <el-card>
              <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                :rules="rules"
                label-width="100px"
                class="demo-ruleForm"
                :size="formSize"
              >
                <el-form-item label="主负责人" prop="fzr1">
                  <el-select v-model="item.fzr1" filterable placeholder="请选择主负责人">
                    <el-option
                      v-for="item in userOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="其他负责人" prop="fzr2">
                  <el-select v-model="item.fzr2" filterable placeholder="请选择其他负责人">
                    <el-option
                      v-for="item in userOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="系统" prop="xt">
                  <el-input clearable v-model="item.xt" />
                </el-form-item>
                <el-form-item label="建设阶段" prop="buildStage">
                  <el-select v-model="item.buildStage" placeholder="建设阶段">
                    <el-option label="已部署已推广" value="已部署已推广" />
                    <el-option label="部署未实施" value="部署未实施" />
                  </el-select>
                </el-form-item>
                <el-form-item label="服务商" prop="service">
                  <el-input clearable v-model="item.service" />
                </el-form-item>
                <el-form-item label="协议签订">
                  <el-col :span="11">
                    <el-form-item prop="fwsxy_start_date">
                      <el-date-picker

                        v-model="item.fwsxy_start_date"
                        type="datetime"
                        placeholder="选择协议开始签订时间"
                        format="YYYY/MM/DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col class="text-center" :span="2" style="text-align: center">
                    <span class="text-gray-500">-</span>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item prop="fwsxy_end_date">
                      <el-date-picker
                        v-model="item.fwsxy_end_date"
                        type="datetime"
                        placeholder="选择协议结束签订时间"
                        :shortcuts="shortcuts"
                        format="YYYY/MM/DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="创建时间" prop="create_date">
                  <el-date-picker
                    v-model="item.create_date"
                    type="datetime"
                    placeholder="Pick a Date"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item label="其他协议" prop="qtxy">
                  <el-input v-model="item.qtxy" type="textarea" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="item.remark" type="textarea" />
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <div class="addCardStyle" @click="addOne">-->
          <!--              <el-icon size="140" color="#bababa">-->
          <!--                <Plus />-->
          <!--              </el-icon>-->
          <!--            </div>-->
          <!--          </el-col>-->
        </el-row>
      </el-scrollbar>
    </el-main>
    <el-footer>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">编辑保存</el-button>
        <el-button @click="deleteForm(ruleFormRef)">删除学校</el-button>
        <el-button @click="addOne">添加模块</el-button>
      </el-form-item>
    </el-footer>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, defineProps, computed, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import { useCommonStore } from "@/store/modules/common";
import { storeToRefs } from "pinia";
import { deleteSchoolAll, editSchoolInfo, getSchoolInfo } from "@/api/schoolList";
import { ElNotification } from "element-plus";
import { addSchoolInfo } from "@/api/schoolList";
import { toRefs } from "@vueuse/core";
import { getTimeStateStr } from "@/utils";
import { userList } from "@/api/user";
// 页面设置部分
const formSize = ref("default");
const shortcuts = [
  {
    text: "Today",
    value: new Date()
  },
  {
    text: "Yesterday",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "A week ago",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];// 选择时间部分

//整体初始化部分
const ruleFormRef = ref<FormInstance>();
const rules = reactive({
  fzr1: [
    { required: true, message: "请输入主负责人名称", trigger: "blur" },
    { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" }
  ],
  school_name: [{ required: true, message: "请输入学校名称", trigger: "blur" }],
  school_code: [{ required: true, message: "请输入学校编码", trigger: "blur" }],
  buildStage: [
    {
      required: true,
      message: "请选择建设阶段",
      trigger: "change"
    }
  ],
  service: [{
    required: true,
    message: "请选择服务商",
    trigger: "change"
  }],
  fwsxy_start_date: [
    {
      type: "date",
      required: true,
      message: "请选择时间",
      trigger: "change"
    }
  ],
  fwsxy_end_date: [
    {
      type: "date",
      required: true,
      message: "请选择时间",
      trigger: "change"
    }
  ],
  create_date: [
    {
      type: "date",
      required: true,
      message: "请选择时间",
      trigger: "change"
    }
  ],
  remark: [{ required: false, message: "请填写备注", trigger: "blur" }]
});
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
const value2 = ref("");

// 点击左侧side,获取学校信息
const commonStore = useCommonStore();
// 使用storeToRefs函数可以辅助保持数据的响应式解构，如果直接结构，会失去响应式
const { selectedSchoolName } = storeToRefs(commonStore);
const { selectedSchoolCode } = storeToRefs(commonStore);
const { updateListValue } = storeToRefs(commonStore);
const { schoolListFirstCode } = storeToRefs(commonStore);
const ruleForm = ref([]);
const getInfo = async () => {
  let result = await getSchoolInfo(selectedSchoolCode.value);
  if (!result.data.success) {
    ElNotification({
      message: result.msg,
      type: "warning",
      duration: 3000
    });
    return;
  }
  ruleForm.value = result.data.data;
  console.log("ruleForm.value", ruleForm.value);
};

//获取人员列表，选择负责人
const userOptions = ref([]);
const userQuerySearch = async () => {
  let userList1 = await userList();
  userOptions.value = userList1.data.data;
};


//添加《新》学校部分
const ruleFormAdd = ref({});
// 弹窗部分
const dialogVisible = ref(false);
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("您确定关闭弹窗吗")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
// 添加学校
const addSchool = async (formEl: FormInstance | undefined) => {
  if (!formEl)
    return;
  else {
    let a = await addSchoolInfo(ruleFormAdd.value);

    console.log("ruleFormAdd.value", ruleFormAdd.value);

    let result = a.data;
    console.log("result", a.data);
    if (!result.success) {
      ElNotification({
        message: result.msg,
        type: "warning",
        duration: 3000
      });
      return;
    }
    ElNotification({
      message: "提交成功",
      type: "success",
      duration: 3000
    });
    commonStore.updateList();
    dialogVisible.value = false;
    formEl.resetFields();
  }
};

//添加一个模块
const addOne = async () => {
  ruleForm.value.push({
    school_code: selectedSchoolCode.value,
    buildStage: "",
    create_date: timestampToTime(new Date()),
    fwsxy_end_date: timestampToTime(new Date()),
    fwsxy_start_date: timestampToTime(new Date()),
    fzr1: "",
    fzr2: "",
    qtxy: "",
    remark: "",
    service: "",
    xt: ""
  });
  console.log("ruleForm.value", ruleForm.value);
};
//编辑已有数据提交
const submitForm = async (formEl: FormInstance | undefined) => {
  console.log("--FORM---", ruleForm);
  console.log("value2", value2);
  if (!formEl) return;
  else {
    let b = await editSchoolInfo(ruleForm.value, selectedSchoolCode.value);
    console.log("bbbbbbbbbb", b);
  }
};
//重置
const resetForm = (formEl: FormInstance | undefined) => {
  console.log('formEl',formEl)
  if (!formEl) return;
  formEl.resetFields();
};
//删除delete整个学校
const deleteForm = (done: () => void) => {
  ElMessageBox.confirm("您确定删除整个学校吗")
    .then(async () => {
      let c = await deleteSchoolAll(selectedSchoolCode.value)
      console.log('cccccccccccccccccc',c)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      commonStore.updateList();
      await getInfo()
    })
    .catch(() => {
      ElMessage({
        type: 'success',
        message: '删除失败',
      })
      commonStore.updateList();
    });
};

watch(selectedSchoolCode, (newVal, oldVal) => {
  getInfo();
});
function timestampToTime(date) {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h =date.getHours()
  h = h < 10 ? ('0' + h) : h
  let M =date.getMinutes()
  M = M < 10 ? ('0' + M) : M
  let s =date.getSeconds()
  s = s < 10 ? ('0' + s) : s
  let dateTime= y + '-' + m + '-' + d + ' ' + h + ':' + M + ':' + s;
  console.log(dateTime)
  return dateTime
}
onMounted(() => {
  getInfo();
  userQuerySearch();
  console.log('schoolListFirstCode11111111111111',schoolListFirstCode.value)

});
</script>

<style scoped>
@import "../index.scss";

</style>
