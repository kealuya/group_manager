<template>
<div class="school-form">
    <div class="form-title">
      <el-form-item prop="school">
        <el-input size="large" class="title-input" style="width: 200px;" clearable v-model="ruleForm.school" />
      </el-form-item>
    </div>
    <div class="form-body">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
      >
        <el-form-item label="主负责人" prop="name">
          <el-input clearable v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="建设阶段" prop="buildStage">
          <el-select v-model="ruleForm.buildStage" placeholder="建设阶段">
            <el-option label="部署已使用" value="over" />
            <el-option label="部署未使用" value="wait" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务商" prop="service">
          <el-select-v2 v-model="ruleForm.service"
                        :options="serviceOptions" placeholder="请选择服务商" style="width: 240px" multiple />
        </el-form-item>

        <el-form-item label="协议签订" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="ruleForm.date1"
                type="date"
                placeholder="选择时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="2" style="text-align: center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker v-model="ruleForm.date2" placeholder="选择时间" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="其他协议" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" />
        </el-form-item>
<!--        <el-form-item label="即时配送" prop="delivery">-->
<!--          <el-switch v-model="ruleForm.delivery" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="活动性质" prop="type">-->
<!--          <el-checkbox-group v-model="ruleForm.type">-->
<!--            <el-checkbox label="美食/餐厅线上活动" name="type" />-->
<!--            <el-checkbox label="地推活动" name="type" />-->
<!--            <el-checkbox label="线下主题活动" name="type" />-->
<!--            <el-checkbox label="单纯品牌曝光" name="type" />-->
<!--          </el-checkbox-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="特殊资源" prop="resource">-->
<!--          <el-radio-group v-model="ruleForm.resource">-->
<!--            <el-radio label="线上品牌商赞助" />-->
<!--            <el-radio label="线下场地免费" />-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="上传图片" prop="img">-->
<!--          <Upload v-model="ruleForm.img" />-->
<!--        </el-form-item>-->
        <el-form-item label="备注" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">立即创建</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
// import Upload from './components/Upload.vue'

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const initials  = ['行旅国际', '差旅管家', '采购平台', '费控服务']
const serviceOptions = ref(
  Array.from({ length: 4 }).map((_, idx) => ({
    value: `Option ${idx + 1}`,
    label: `${initials[idx % 4]}${idx}`,
  }))
)
const ruleForm = reactive({
  school: '中国传媒大学',
  name:'张琦',
  buildStage: '',
  service:'',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
  img: [],
})

const rules = reactive({
  name: [
    { required: true, message: '请输入主负责人名称', trigger: 'blur' },
    { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
  ],
  school:[{required: true, message: '请输入学校名称', trigger: 'blur'}],
  img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
  buildStage: [
    {
      required: true,
      message: '请选择建设阶段',
      trigger: 'change',
    },
  ],
  service:[{
    required: true,
    message: '请选择服务商',
    trigger: 'change',
  },],
  date1: [
    {
      type: 'date',
      required: true,
      message: '请选择时间',
      trigger: 'change',
    },
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: '请选择时间',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: '请至少选择一个活动性质',
      trigger: 'change',
    },
  ],
  resource: [
    {
      required: true,
      message: '请选择活动资源\n',
      trigger: 'change',
    },
  ],
  desc: [{ required: false, message: '请填写备注', trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  console.log('--FORM---', ruleForm)
  if (!formEl) return

}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
@import "../index.scss";

</style>
