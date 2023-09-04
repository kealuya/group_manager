<template>
  <el-dialog @close="close" class="dialog-title-input" v-model="dialogVisible" width="50%" center>
    <template #header>
       标题  <el-input v-model="input" type="text" style="width: 30vh;" placeholder="请输入项目标题" />
    </template>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="高校" prop="school">
            <el-input v-model="ruleForm.school" placeholder="请输入用户名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统" prop="system">
            <el-input v-model="ruleForm.system" placeholder="请输入系统名称"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="创建人" prop="createPerson">
            <el-input v-model="ruleForm.createPerson" readonly placeholder="请输入用户名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优先级" prop="priority">
            <el-radio-group v-model="ruleForm.priority" size="small" >
              <el-radio-button label="紧急" />
              <el-radio-button label="高" />
              <el-radio-button label="中" />
              <el-radio-button label="低" />
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="处理人" prop="handlePerson">
            <el-select v-model="ruleForm.handlePerson" placeholder="请选择" style="width: 100%">
              <el-option label="张丽" value="zhangli" :key="0"></el-option>
              <el-option label="李建" value="lijian" :key="1"></el-option>
              <el-option label="张扬" value="zhangyang" :key="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联人" prop="associatePerson">
            <el-select v-model="ruleForm.associatePerson" placeholder="请选择" style="width: 100%">
              <el-option label="张丽" value="zhangli" :key="0"></el-option>
              <el-option label="李建" value="lijian" :key="1"></el-option>
              <el-option label="张扬" value="zhangyang" :key="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" >
            <el-switch v-model="ruleForm.status" inline-prompt active-text="已处理" inactive-text="待处理"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="programClass">
            <el-select v-model="ruleForm.programClass" placeholder="请选择" style="width: 100%">
              <el-option label="bug" value="bug" :key="0"></el-option>
              <el-option label="管理员" value="管理员" :key="1"></el-option>
              <el-option label="普通用户" value="普通用户" :key="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="describe" >
        <el-input v-model="ruleForm.describe"
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
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
import {reactive, ref} from "vue";
import {QuillEditor} from '@vueup/vue-quill'
const radio1 = ref('紧急')
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增用户')
const input = ref('')
const rules = reactive({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
  ],
  school: [{ required: true, message: '请输入', trigger: 'blur' }],
  system:[{ required: true, message: '请输入', trigger: 'blur' }],
  createPerson:[{ required: true, message: '请输入', trigger: 'blur' }],
  handlePerson: [{required: true, message: '请选择处理人', trigger: 'change',},],
  associatePerson: [{required: true, message: '请选择关联人', trigger: 'change',},],
  programClass:[{required: true, message: '请选择项目分类', trigger: 'change',},],
})

const ruleForm = reactive({
  school: '',
  system:'',
  createPerson:'张琦',
  priority:'紧急',
  handlePerson:null,
  associatePerson:null,
  programClass:null,
  status:true,
  describe:null,

})

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

