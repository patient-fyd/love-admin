<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';

import { NButton, NCard, NDataTable, NEmpty, NResult } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface PlanItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
}

const { loading, items, total, error, fetch } =
  usePaginatedEndpoint<PlanItem>('/admin/subscriptions/plans');

const columns = [
  { title: '套餐ID', key: 'id' },
  { title: '名称', key: 'name' },
  { title: '价格', key: 'price', render: (row: PlanItem) => `${row.currency} ${row.price}` },
  { title: '周期', key: 'period' },
  {
    title: '操作',
    key: 'actions',
    render: (row: PlanItem) =>
      h(
        NButton,
        { size: 'tiny', quaternary: true, onClick: () => console.log('编辑套餐', row) },
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
    <NCard title="订阅套餐" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/subscriptions/plans 接口"
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
