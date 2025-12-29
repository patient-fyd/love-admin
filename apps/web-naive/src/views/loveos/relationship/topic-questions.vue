<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';

import { NButton, NCard, NDataTable, NEmpty, NResult } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface QuestionItem {
  id: string;
  question: string;
  tone?: string;
  updatedAt?: string;
}

const route = useRoute();
const { loading, items, total, error, fetch } = usePaginatedEndpoint<
  QuestionItem
>(`/admin/relationship/topics/${route.params.code}/questions`);

const columns = [
  { title: 'ID', key: 'id' },
  { title: '问题', key: 'question' },
  { title: '语气', key: 'tone' },
  { title: '更新时间', key: 'updatedAt' },
  {
    title: '操作',
    key: 'actions',
    render: (row: QuestionItem) =>
      h(
        NButton,
        { size: 'tiny', quaternary: true, onClick: () => console.log('编辑问题', row) },
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
    <NCard :title="`话术 ${route.params.code} 问题列表`" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/relationship/topics/:code/questions 接口"
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
