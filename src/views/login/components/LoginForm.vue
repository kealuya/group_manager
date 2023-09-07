<template>
  <div class="login-title">
    <h2 class="title">项目管理系统<span>.</span></h2>
    <div class="title-explain">还没有账号？去<span>注册</span>....</div>
  </div>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    :size="size"
  >

    <!--https://pictogrammers.com/library/mdi/   icon 图标选择-->
    <!--    <el-row :gutter="20">-->
    <!--      <el-col  >-->
    <!--        <v-text-field-->
    <!--            prepend-inner-icon="mdi-account-outline"-->
    <!--            :rules="[v_rules.required]"-->
    <!--            bg-color="#323644"-->
    <!--            label="用户名"-->
    <!--            variant="solo-filled"-->
    <!--            clearable-->

    <!--        ></v-text-field>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <!--    <div style="height: 5px"></div>-->
    <!--    <el-row :gutter="20">-->
    <!--      <el-col  >-->
    <!--        <v-text-field-->
    <!--            style=""-->
    <!--            prepend-inner-icon="mdi-lock-outline"-->
    <!--            :rules="[v_rules.required]"-->
    <!--            bg-color="#323644"-->
    <!--            label="密码"-->
    <!--            variant="solo-filled"-->
    <!--        ></v-text-field>-->
    <!--      </el-col>-->
    <!--    </el-row>-->


    <el-form-item label="" prop="code">
      <el-input
        placeholder="请输入用户名"
        autoComplete="on"
        style="position: relative"
        v-model="ruleForm.code"
        @keyup.enter.native="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <UserFilled/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input
        placeholder="请输入密码"
        autoComplete="on"
        @keyup.enter.native="submitForm(ruleFormRef)"
        v-model="ruleForm.password"
        :type="passwordType"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <GoodsFilled/>
          </el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </div>
        </template>
      </el-input>
    </el-form-item>


    <el-form-item style="width: 100%">
      <el-button
        :loading="loading"
        class="login-btn"
        type="primary"
        @click="submitForm(ruleFormRef)"
      >登录
      </el-button
      >
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import {ref, reactive} from "vue";
import type {FormInstance} from "element-plus";
import {ElNotification} from "element-plus";
import {useRouter} from "vue-router";
import {useUserStore} from "@/store/modules/user";
import {getTimeStateStr} from "@/utils/index";

const size = ref("large");


const router = useRouter();
const UserStore = useUserStore();
const ruleFormRef = ref<FormInstance>();
const passwordType = ref("password");
const loading = ref(false);

const rules = reactive({
  password: [{required: true, message: "请输入密码", trigger: "blur"}],
  code: [{required: true, message: "请输入工号", trigger: "blur"}],
});

// const v_rules = reactive({
//   required: value => !!value || "不能为空"
// });

// 表单数据
const ruleForm = reactive({
  code: "1209",
  password: "666"
});

// 显示密码图标
const showPwd = () => {
  passwordType.value = passwordType.value === "password" ? "" : "password";
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      // 登录

      const result = await UserStore.login(ruleForm);
      if (!result.success) {
        ElNotification({
          title: getTimeStateStr(),
          message: result.msg,
          type: "warning",
          duration: 3000
        });
        loading.value = false
        return
      }
      await router.push({
        path: "/"
      });
      ElNotification({
        title: getTimeStateStr(),
        message: "欢迎登录",
        type: "success",
        duration: 3000
      });
      loading.value = true;

    } else {
      console.log("error submit!");
      return false;
    }
  });
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>
