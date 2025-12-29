<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';

import { NButton, NCard, NDataTable, NEmpty, NResult, NTag } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface ModelPriceItem {
  model: string;
  currency: string;
  inputPrice: number;
  outputPrice: number;
  updatedAt?: string;
}

const { loading, items, total, error, fetch } =
  usePaginatedEndpoint<ModelPriceItem>('/admin/ai/model-prices');

const columns = [
  { title: '模型', key: 'model' },
  { title: '货币', key: 'currency' },
  { title: 'Prompt 单价', key: 'inputPrice' },
  { title: 'Completion 单价', key: 'outputPrice' },
  { title: '更新时间', key: 'updatedAt' },
  {
    title: '操作',
    key: 'actions',
    render: (row: ModelPriceItem) =>
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
    <NCard title="模型价格" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/ai/model-prices 接口"
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
