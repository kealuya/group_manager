<template>
  <el-dialog @close="close" class="dialog-title-input" :close-on-click-modal="false"
             v-model="dialogVisible" width="50%" center>
    <template #header>
      <el-form-item label="问题简述">
        <el-input v-model="ruleForm.title" type="text"  placeholder="请输入项目标题" />
      </el-form-item>
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
            <el-select v-model="ruleForm.xt"  class="m-2" placeholder="请选择系统名称" >
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
            <el-select filterable v-model="ruleForm.process_people" @visible-change="getProcessPeopleList" class="m-2" placeholder="请选择处理人">
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
            <el-switch v-model="ruleForm.status"  :active-value="1" :inactive-value="0"
                       inline-prompt active-text="已处理" inactive-text="待处理"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="program_type" required>
            <el-radio-group v-model="ruleForm.program_type" size="small" >
              <el-radio-button label="bug"  />
              <el-radio-button label="更新" />
              <el-radio-button label="定制" />
            </el-radio-group>

          </el-form-item>
        </el-col>
        <el-col>
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
      </el-row>
      <el-form-item label="备注" prop="remark" >
        <el-input v-model="ruleForm.remark"
                  type="textarea"
                  placeholder="请输入用户描述"/>
      </el-form-item>
    </el-form>
    <QuillEditor content-type='html' v-model="ruleForm.content" theme="snow" :options="editorOption" />
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
import { userList } from "@/api/user";
import { addProgram, editProgram } from "@/api/workStage";
import { storeToRefs } from "pinia";
import { useCommonStore } from "@/store/modules/common";
import { parseTime } from "@/utils";
const radio1 = ref('紧急')
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const title = ref('新增用户')
const input = ref('')
const rules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  school_name: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
  school_code: [{ required: true, message: '请先填写学校名称', trigger: 'blur' }],
  xt:[{ required: false, message: '请选择系统', trigger: 'blur' }],
  create_people:[{ required: true, message: '请输入', trigger: 'blur' }],
  process_people: [{required: true, message: '请选择处理人', trigger: 'change',},],
  program_type:[{required: true, message: '请选择项目分类', trigger: 'change',},],
  create_time: [{ type: "date", required: false, message: "请选择时间", trigger: "change" }],
})
//获取当前用户信息
const UserStore = useUserStore()
const userInfo = computed(() => UserStore.userInfo)


// 富文本编辑器配置
let editorOption = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
      [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
      [{ align: [] }], // 对齐方式
      [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
      [{ font: [] }], // 字体种类
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
      [{ direction: 'ltl' }], // 文本方向
      [{ direction: 'rtl' }], // 文本方向
      [{ indent: '-1' }, { indent: '+1' }], // 缩进
      [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
      [{ script: 'sub' }, { script: 'super' }], // 上标/下标
      ['blockquote', 'code-block'], // 引用  代码块
      ['clean'], // 清除文本格式
      ['link', 'image', 'video'], // 链接、图片、视频
    ],
  },
}



const ruleForm = reactive({
  id:'',
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
  create_time:parseTime(new Date(),"{y}-{m}-{d} {h}:{i}:{s}"),

})

function close() {
  ruleFormRef.value.resetFields()
  Object.keys(ruleForm).forEach(key=>{
    if(key==='priority') ruleForm[key] = '紧急'
    else if(key==='status') ruleForm[key] = true
    else ruleForm[key] = null

  })
}
const submitType = ref('add')
const show = (item={})=>{
  if(item['title']){
    Object.keys(item).forEach(key=>{
      ruleForm[key] = item[key]
    })
    console.log('edit塞完的ruleForm',ruleForm)
    submitType.value = 'edit'
  }
  dialogVisible.value = true
}
const commonStore = useCommonStore();
const handleClose = async (done: () => void) => {
  if (!ruleForm.title){
    ElMessage({
      type: "error",
      message: "请填写项目标题"
    });
    return
  }
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      dialogVisible.value = false
      console.log('submitType.value!', submitType.value)
      if (submitType.value === 'edit'){
        let a = await editProgram(ruleForm)
        let currentResult = a.data
        if (!currentResult.success) {
          ElMessage({
            type: "error",
            message: currentResult.msg
          });
          return
        } else {
          ElMessage({
            type: "success",
            message: "提交成功"
          });
        }
      }else {
        let a = await addProgram(ruleForm)
        let currentResult = a.data
        if (!currentResult.success) {
          ElMessage({
            type: "error",
            message: currentResult.msg
          });
          return
        } else {
          ElMessage({
            type: "success",
            message: "提交成功"
          });
        }
      }


      commonStore.updateTable();
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
  userListResult.forEach(item=>{
    processPeopleOptions.value.push({
      label:item.name,
      value:item.code
    })
  })
}


//根据学校名称查找学校编码
const searchCode = async(name)=>{
  let codeInfo = await getSchoolCodeInfo(name)
  let codeInfoResult = codeInfo.data
  if (!codeInfoResult.success) {
    ElNotification({
      message: codeInfoResult.msg,
      type: "warning",
      duration: 3000
    });
    return;
  }
  else if (codeInfoResult.data === null){
    ElNotification({
      message: '无法查询到该学校，请重新输入',
      type: "warning",
      duration: 3000
    });
    ruleForm.school_code = ''
    return
  }
  ruleForm.school_code = codeInfoResult.data[0].school_code
  ruleForm.school_name = codeInfoResult.data[0].school_name
}
const getXtList = async (a)=>{
  xtOptions.value = []
  let schoolInfo = await getSchoolInfo(a)
  let searchInfoResult = schoolInfo.data.data
  console.log('searchInfoResult',searchInfoResult[0])
  if (searchInfoResult[0].xt===null){
    xtOptions.value = []
    return
  }
  searchInfoResult.forEach(item=>{
    xtOptions.value.push({
      label:item.xt,
      value:item.xt
    })
  })
}
//xt 下拉optionList
const xtOptions = ref([])
watch( ()=>ruleForm.school_code,async (a)=>{
  await getXtList(a)
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

