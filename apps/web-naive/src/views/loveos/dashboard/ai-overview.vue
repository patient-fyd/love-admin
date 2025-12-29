<script lang="ts" setup>
import type { AiOverview } from '#/api/loveos/ai';

import { computed, onMounted, ref } from 'vue';

import { NCard, NGrid, NGridItem, NProgress, NStatistic, NTag } from 'naive-ui';

import { fetchAiOverview } from '#/api';

const loading = ref(false);
const error = ref<string | null>(null);
const overview = ref<AiOverview | null>(null);

async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    overview.value = await fetchAiOverview();
  } catch (err: any) {
    error.value = err?.message ?? '无法获取AI概览数据';
  } finally {
    loading.value = false;
  }
}

const tokensLabel = computed(() =>
  overview.value?.currency
    ? `${overview.value.currency} / tokens`
    : 'Tokens',
);

onMounted(fetchData);
</script>

<template>
  <div class="space-y-4 p-4">
    <NCard title="AI 总览" :loading="loading">
      <div v-if="error" class="text-red-500">{{ error }}</div>
      <template v-else>
        <NGrid :cols="4" x-gap="16" y-gap="12" responsive="screen">
          <NGridItem :span="4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-gray-500">今日请求</div>
                <div class="text-2xl font-semibold">
                  {{ overview?.todayRequests ?? 0 }}
                </div>
              </div>
              <NTag type="info">/admin/ai/overview</NTag>
            </div>
          </NGridItem>
          <NGridItem :span="4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-gray-500">今日 Tokens</div>
                <div class="text-2xl font-semibold">
                  {{ overview?.todayTokens ?? 0 }}
                </div>
              </div>
              <NTag type="success">{{ tokensLabel }}</NTag>
            </div>
          </NGridItem>
          <NGridItem :span="4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-gray-500">今日成本</div>
                <div class="text-2xl font-semibold">
                  <span v-if="overview?.currency && overview?.todayCost !== undefined">
                    {{ overview.currency }} {{ overview.todayCost?.toFixed?.(2) ?? overview.todayCost }}
                  </span>
                  <span v-else class="text-gray-400">未配置价格表</span>
                </div>
              </div>
              <NTag type="warning">成本</NTag>
            </div>
          </NGridItem>
          <NGridItem :span="4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-gray-500">Fallback / 拦截率</div>
                <div class="flex space-x-4">
                  <div class="w-40">
                    <NStatistic label="Fallback">
                      {{ (overview?.fallbackRate ?? 0) * 100 }}%
                    </NStatistic>
                    <NProgress
                      type="line"
                      :percentage="(overview?.fallbackRate ?? 0) * 100"
                      :indicator-placement="'inside'"
                      processing
                    />
                  </div>
                  <div class="w-40">
                    <NStatistic label="拦截率">
                      {{ (overview?.interceptRate ?? 0) * 100 }}%
                    </NStatistic>
                    <NProgress
                      type="line"
                      :percentage="(overview?.interceptRate ?? 0) * 100"
                      status="warning"
                    />
                  </div>
                </div>
              </div>
            </div>
          </NGridItem>
        </NGrid>
      </template>
    </NCard>
    <NCard title="成本趋势">
      <div v-if="overview?.costTrend?.length">
        <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div v-for="item in overview.costTrend" :key="item.date" class="flex items-center justify-between rounded-md border border-dashed p-3">
            <span class="text-sm text-gray-500">{{ item.date }}</span>
            <span class="font-semibold">
              <span v-if="overview.currency">{{ overview.currency }} </span>{{ item.cost }}
              <span class="ml-2 text-xs text-gray-400">Tokens: {{ item.tokens }}</span>
            </span>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-400">暂无趋势数据，接入 /admin/ai/overview 的 costTrend 字段即可展示</div>
    </NCard>
  </div>
</template>
