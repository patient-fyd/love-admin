<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';

import { NCard, NDataTable, NEmpty, NResult, NTag } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface AnomalyItem {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: string;
}

const { loading, items, total, error, fetch } =
  usePaginatedEndpoint<AnomalyItem>('/admin/ai/anomaly/report');

const columns = [
  { title: 'ID', key: 'id' },
  { title: '类型', key: 'type' },
  {
    title: '等级',
    key: 'severity',
    render: (row: AnomalyItem) =>
      h(NTag, { size: 'small', type: row.severity === 'critical' ? 'error' : row.severity === 'warning' ? 'warning' : 'info' }, { default: () => row.severity }),
  },
  { title: '描述', key: 'message' },
  { title: '时间', key: 'createdAt' },
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
    <NCard title="异常/治理报告" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/ai/anomaly/report 接口"
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
