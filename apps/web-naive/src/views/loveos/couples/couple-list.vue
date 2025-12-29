<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';

import { NCard, NDataTable, NEmpty, NResult, NTag } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface CoupleItem {
  id: string;
  userA: string;
  userB: string;
  status?: string;
  startedAt?: string;
}

const { loading, items, total, error, fetch } =
  usePaginatedEndpoint<CoupleItem>('/admin/couples');

const columns = [
  { title: '情侣ID', key: 'id' },
  { title: '用户A', key: 'userA' },
  { title: '用户B', key: 'userB' },
  {
    title: '状态',
    key: 'status',
    render: (row: CoupleItem) =>
      row.status
        ? h(NTag, { size: 'small' }, { default: () => row.status })
        : '- ',
  },
  { title: '开始时间', key: 'startedAt' },
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
    <NCard title="情侣列表" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/couples 接口"
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
