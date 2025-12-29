<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';

import { NButton, NCard, NDataTable, NEmpty, NResult, NTag } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface FeatureModelItem {
  feature: string;
  model: string;
  fallbackModel?: string;
  enabled?: boolean;
  updatedAt?: string;
}

const { loading, items, total, error, fetch } =
  usePaginatedEndpoint<FeatureModelItem>('/admin/ai/feature-models');

const columns = [
  { title: '场景', key: 'feature' },
  { title: '主模型', key: 'model' },
  { title: 'Fallback 模型', key: 'fallbackModel' },
  {
    title: '状态',
    key: 'enabled',
    render: (row: FeatureModelItem) =>
      h(NTag, { size: 'small', type: row.enabled ? 'success' : 'error' }, { default: () => (row.enabled ? '启用' : '禁用') }),
  },
  { title: '更新时间', key: 'updatedAt' },
  {
    title: '操作',
    key: 'actions',
    render: (row: FeatureModelItem) =>
      h(
        NButton,
        { size: 'tiny', quaternary: true, onClick: () => console.log('编辑', row) },
        { default: () => '编辑' },
      ),
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
    <NCard title="场景 → 模型路由配置" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/ai/feature-models 接口"
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
