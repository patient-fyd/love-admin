<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';

import { NCard, NDataTable, NEmpty, NResult, NTag } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface AuditEventItem {
  id: string;
  actor: string;
  action: string;
  ip?: string;
  createdAt: string;
  severity?: 'info' | 'warning' | 'error';
}

const { loading, items, total, error, fetch } =
  usePaginatedEndpoint<AuditEventItem>('/admin/audit/events');

const columns = [
  { title: 'ID', key: 'id' },
  { title: '管理员', key: 'actor' },
  { title: '行为', key: 'action' },
  { title: 'IP', key: 'ip' },
  {
    title: '等级',
    key: 'severity',
    render: (row: AuditEventItem) =>
      row.severity
        ? h(
            NTag,
            { size: 'small', type: row.severity === 'error' ? 'error' : row.severity === 'warning' ? 'warning' : 'info' },
            { default: () => row.severity },
          )
        : '- ',
  },
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
    <NCard title="系统审计" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/audit/events 接口"
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
