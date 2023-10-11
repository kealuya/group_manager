<template>
  <el-dialog @close="close" class="dialog-title-input" v-model="dialogVisible" width="50%" center>
    <template #header>
       标题
      <el-input v-model="ruleForm.title" type="text" style="width: 25vh;" placeholder="请输入项目标题" />
    </template>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="学校名称" prop="school_name">
            <el-input v-model="ruleForm.school_name" @change="searchCode(ruleForm.school_name)" placeholder="请输入学校名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学校编码" prop="school_code">
            <el-input readonly v-model="ruleForm.school_code" placeholder="请先输入学校名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统" prop="xt">
            <el-select v-model="ruleForm.xt"  class="m-2" placeholder="请选择系统名称">
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
            <el-input v-model="ruleForm.create_people" readonly placeholder="请输入用户名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优先级" prop="priority" required>
            <el-radio-group v-model="ruleForm.priority" size="small" >
              <el-radio-button label="紧急"  />
              <el-radio-button label="高" />
              <el-radio-button label="中" />
              <el-radio-button label="低" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理人" prop="process_people">
            <el-select v-model="ruleForm.process_people" @visible-change="getProcessPeopleList" class="m-2" placeholder="请选择处理人">
              <el-option
                v-for="item in processPeopleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" required>
            <el-switch v-model="ruleForm.status"  active-value="1" inactive-value="0"
                       inline-prompt active-text="已处理" inactive-text="待处理"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="programClass" required>
            <el-select v-model="ruleForm.program_type" placeholder="请选择" style="width: 100%">
              <el-option label="bug" value="bug" :key="0"></el-option>
              <el-option label="更新" value="更新" :key="1"></el-option>
              <el-option label="定制" value="定制" :key="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="创建时间" prop="create_date">
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
      </el-row>

      <el-form-item label="备注" prop="remark" >
        <el-input v-model="ruleForm.remark"
                  type="textarea"
                  placeholder="请输入用户描述"/>
      </el-form-item>
    </el-form>
    <QuillEditor theme="snow" />
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
        </span>
    </template>

  </el-dialog>
</template>
<script lang="ts" setup>
import { ElMessageBox, ElMessage, FormInstance, ElNotification } from "element-plus";
import { computed, reactive, ref, watch } from "vue";
import {QuillEditor} from '@vueup/vue-quill'
import { getSchoolCodeInfo, getSchoolInfo } from "@/api/schoolList";
import { useUserStore } from "@/store/modules/user";
import { a } from "pinia-plugin-persistedstate/dist/types-374a3a36";
import { userList } from "@/api/user";
const radio1 = ref('紧急')
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增用户')
const input = ref('')
const rules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  school_name: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
  school_code: [{ required: true, message: '请先填写学校名称', trigger: 'blur' }],
  xt:[{ required: true, message: '请输入', trigger: 'blur' }],
  create_people:[{ required: true, message: '请输入', trigger: 'blur' }],
  process_people: [{required: true, message: '请选择处理人', trigger: 'change',},],
  program_type:[{required: true, message: '请选择项目分类', trigger: 'change',},],
  create_time: [{ type: "date", required: false, message: "请选择时间", trigger: "change" }],
})
//获取当前用户信息
const UserStore = useUserStore()
const userInfo = computed(() => UserStore.userInfo)
console.log(userInfo.value)

const ruleForm = reactive({
  title:'',
  school_code: '',
  school_name:'',
  xt:'',
  create_people:userInfo.value.name,
  priority:'紧急',
  process_people:null,
  program_type:null,
  status:true,
  remark:null,
  create_time:timestampToTime(new Date()),

})

function timestampToTime(date) {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? ("0" + m) : m;
  let d = date.getDate();
  d = d < 10 ? ("0" + d) : d;
  let h = date.getHours();
  h = h < 10 ? ("0" + h) : h;
  let M = date.getMinutes();
  M = M < 10 ? ("0" + M) : M;
  let s = date.getSeconds();
  s = s < 10 ? ("0" + s) : s;
  let dateTime = y + "-" + m + "-" + d + " " + h + ":" + M + ":" + s;
  console.log(dateTime);
  return dateTime;
}
function close() {
  ruleFormRef.value.resetFields()
  Object.keys(ruleForm).forEach(key=>{
    if(key==='sex') ruleForm[key] = '男'
    else if(key==='status') ruleForm[key] = true
    else ruleForm[key] = null

  })
}

const show = (item={})=>{
  title.value = '新增用户'
  if(item.username){
    title.value = '编辑用户'
    Object.keys(item).forEach(key=>{
      ruleForm[key] = item[key]
    })
  }
  dialogVisible.value = true
}

const handleClose = async (done: () => void) => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      dialogVisible.value = false
      console.log('submit!', ruleForm)
    } else {
      console.log('error submit!', fields)
    }
  })
}
//获取userList----处理人optionList
const processPeopleOptions = ref([])
const getProcessPeopleList = async ()=>{
  processPeopleOptions.value = []
  let a = await userList()
  let userListResult = a.data.data
  console.log('a.data.data',a.data.data)
  userListResult.forEach(item=>{
    processPeopleOptions.value.push({
      label:item.name,
      value:item.code
    })
  })
}

//xt 下拉optionList
const xtOptions = ref([])
const searchCode = async(name)=>{
  console.log(name)
  let codeInfo = await getSchoolCodeInfo(name)
  let codeInfoResult = codeInfo.data
  console.log('aaaaaaaaaaaaaaaaaaaaa',codeInfoResult)
  if (!codeInfoResult.success) {
    ElNotification({
      message: codeInfoResult.msg,
      type: "warning",
      duration: 3000
    });
    return;
  }
  ruleForm.school_code = codeInfoResult.data[0].school_code
}
watch( ()=>ruleForm.school_code,async (a)=>{
  let schoolInfo = await getSchoolInfo(a)
  let searchInfoResult = schoolInfo.data.data
  searchInfoResult.forEach(item=>{
    xtOptions.value.push({
      label:item.xt,
      value:item.xt
    })
  })
})
defineExpose({
  show,
})

</script>
<style lang="scss" scoped>
@import "../index.scss";
::v-deep(.el-input__wrapper){
  box-shadow: 0 0 0 0px;
}
</style>

