<script lang="ts" setup>
import type { AiRun } from '#/api/loveos/ai';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { NCard, NDescriptions, NDescriptionsItem, NResult } from 'naive-ui';

import { getAiRunDetail } from '#/api';

const route = useRoute();
const detail = ref<AiRun | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchDetail() {
  loading.value = true;
  error.value = null;
  try {
    detail.value = await getAiRunDetail(route.params.id as string);
  } catch (err: any) {
    error.value = err?.message ?? '加载失败';
  } finally {
    loading.value = false;
  }
}

onMounted(fetchDetail);
</script>

<template>
  <div class="p-4">
    <NCard title="Run 详情" :loading="loading">
      <NResult v-if="error" status="error" :title="error" description="检查 /admin/ai/runs/:id 接口" />
      <NDescriptions
        v-else-if="detail"
        :column="2"
        label-placement="top"
        :bordered="true"
        size="small"
      >
        <NDescriptionsItem label="Run ID">{{ detail.id }}</NDescriptionsItem>
        <NDescriptionsItem label="用户">{{ detail.username }}</NDescriptionsItem>
        <NDescriptionsItem label="场景">{{ detail.scene }}</NDescriptionsItem>
        <NDescriptionsItem label="模型">{{ detail.model }}</NDescriptionsItem>
        <NDescriptionsItem label="Tokens">{{ detail.totalTokens }}</NDescriptionsItem>
        <NDescriptionsItem label="成本">
          <span v-if="detail.cost !== undefined">{{ detail.currency }} {{ detail.cost }}</span>
          <span v-else class="text-gray-400">未配置价格表</span>
        </NDescriptionsItem>
        <NDescriptionsItem label="状态">{{ detail.status }}</NDescriptionsItem>
        <NDescriptionsItem label="耗时">{{ detail.latencyMs }} ms</NDescriptionsItem>
        <NDescriptionsItem label="创建时间">{{ detail.createdAt }}</NDescriptionsItem>
        <NDescriptionsItem label="TraceId">{{ detail.traceId || '-' }}</NDescriptionsItem>
      </NDescriptions>
      <div v-else class="text-gray-400">等待加载数据</div>
    </NCard>
  </div>
</template>
