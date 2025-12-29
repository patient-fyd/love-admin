<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { NCard, NGrid, NGridItem, NResult, NSkeleton, NStatistic } from 'naive-ui';

import { requestClient } from '#/api/request';

const loading = ref(false);
const error = ref<string | null>(null);
const stats = ref<Record<string, any> | null>(null);

async function fetchStats() {
  loading.value = true;
  error.value = null;
  try {
    stats.value = await requestClient.get('/admin/mbti/stats');
  } catch (err: any) {
    error.value = err?.message ?? '获取 MBTI 指标失败';
  } finally {
    loading.value = false;
  }
}

onMounted(fetchStats);
</script>

<template>
  <div class="p-4">
    <NCard title="MBTI 指标汇总" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/mbti/stats 接口"
      />
      <NSkeleton v-else-if="!stats" text :repeat="6" />
      <NGrid v-else :cols="4" x-gap="12" y-gap="12" responsive="screen">
        <NGridItem v-for="(value, key) in stats" :key="key" :span="4">
          <NStatistic :label="key" :value="value" />
        </NGridItem>
      </NGrid>
    </NCard>
  </div>
</template>
