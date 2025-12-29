<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';

import { NButton, NCard, NDataTable, NEmpty, NResult } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface TopicItem {
  code: string;
  title: string;
  category?: string;
  updatedAt?: string;
}

const { loading, items, total, error, fetch } =
  usePaginatedEndpoint<TopicItem>('/admin/relationship/topics');

const columns = [
  { title: '主题编码', key: 'code' },
  { title: '标题', key: 'title' },
  { title: '分类', key: 'category' },
  { title: '更新时间', key: 'updatedAt' },
  {
    title: '操作',
    key: 'actions',
    render: (row: TopicItem) =>
      h(
        NButton,
        {
          size: 'tiny',
          quaternary: true,
          onClick: () => window.location.assign(`#${'/relationship/topics/' + row.code + '/questions'}`),
        },
        { default: () => '问题配置' },
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
    <NCard title="关系话术主题" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/relationship/topics 接口"
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
