<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { NCard, NDescriptions, NDescriptionsItem, NResult, NSkeleton } from 'naive-ui';

import { requestClient } from '#/api/request';

const route = useRoute();
const loading = ref(false);
const error = ref<string | null>(null);
const detail = ref<Record<string, any> | null>(null);

async function fetchDetail() {
  loading.value = true;
  error.value = null;
  try {
    detail.value = await requestClient.get(`/admin/users/${route.params.id}/overview`);
  } catch (err: any) {
    error.value = err?.message ?? '获取用户详情失败';
  } finally {
    loading.value = false;
  }
}

onMounted(fetchDetail);
</script>

<template>
  <div class="p-4">
    <NCard :title="`用户 ${route.params.id}`" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/users/:id/overview 接口"
      />
      <NSkeleton v-else-if="!detail" text :repeat="6" />
      <NDescriptions v-else :column="2" label-placement="top" :bordered="true">
        <NDescriptionsItem label="用户名">{{ detail.username }}</NDescriptionsItem>
        <NDescriptionsItem label="角色">{{ detail.roles?.join(', ') }}</NDescriptionsItem>
        <NDescriptionsItem label="关系状态">{{ detail.relationshipStatus ?? '-' }}</NDescriptionsItem>
        <NDescriptionsItem label="订阅">{{ detail.subscription ?? '-' }}</NDescriptionsItem>
        <NDescriptionsItem label="最近活跃">{{ detail.lastActiveAt ?? '-' }}</NDescriptionsItem>
        <NDescriptionsItem label="AI 使用">{{ detail.aiUsageSummary ?? '-' }}</NDescriptionsItem>
      </NDescriptions>
    </NCard>
  </div>
</template>
