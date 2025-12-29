<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';

import { NCard, NDataTable, NEmpty, NResult, NTag } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface SceneUsageItem {
  scene: string;
  requests: number;
  tokens: number;
  cost?: number;
  currency?: string;
}

const { loading, items, total, error, fetch } =
  usePaginatedEndpoint<SceneUsageItem>('/admin/ai/usage/scene');

const columns = [
  { title: '场景', key: 'scene' },
  { title: '请求数', key: 'requests' },
  { title: 'Tokens', key: 'tokens' },
  {
    title: '成本',
    key: 'cost',
    render: (row: SceneUsageItem) =>
      row.cost !== undefined
        ? `${row.currency ?? ''} ${row.cost}`
        : h(NTag, { size: 'small' }, { default: () => '未配置价格' }),
  },
];

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page: number) => {
    pagination.page = page;
    fetch({ page, page_size: pagination.pageSize });
  },
  onUpdatePageSize: (size: number) => {
    pagination.pageSize = size;
    pagination.page = 1;
    fetch({ page: 1, page_size: size });
  },
});

watch(total, (val) => (pagination.itemCount = val));

onMounted(() => fetch({ page: pagination.page, page_size: pagination.pageSize }));
</script>

<template>
  <div class="p-4">
    <NCard title="按场景统计" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/ai/usage/scene 接口"
      />
      <NEmpty v-else-if="!items.length && !loading" description="暂无数据" />
      <NDataTable
        v-else
        :data="items"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
      />
    </NCard>
  </div>
</template>
