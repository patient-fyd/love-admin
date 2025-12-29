<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';

import { NButton, NCard, NDataTable, NEmpty, NResult, NSpace, NTag } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface UserItem {
  id: string;
  username: string;
  roles?: string[];
  status?: string;
  subscription?: string;
}

const { loading, items, total, error, fetch } =
  usePaginatedEndpoint<UserItem>('/admin/users');

const columns = [
  { title: '用户ID', key: 'id' },
  { title: '用户名', key: 'username' },
  {
    title: '角色',
    key: 'roles',
    render: (row: UserItem) => row.roles?.join(', ') || '-',
  },
  {
    title: '状态',
    key: 'status',
    render: (row: UserItem) =>
      row.status
        ? h(
            NTag,
            { size: 'small', type: row.status === 'active' ? 'success' : 'warning' },
            { default: () => row.status },
          )
        : '- ',
  },
  { title: '订阅', key: 'subscription' },
  {
    title: '操作',
    key: 'actions',
    render: (row: UserItem) =>
      h(
        NSpace,
        null,
        {
          default: () => [
            h(
              NButton,
              {
                size: 'tiny',
                type: 'primary',
                quaternary: true,
                onClick: () => window.location.assign(`#${'/admin/users/' + row.id + '/overview'}`),
              },
              { default: () => '详情' },
            ),
          ],
        },
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

watch(total, (val) => {
  pagination.itemCount = val;
});

onMounted(() => fetch({ page: pagination.page, page_size: pagination.pageSize }));
</script>

<template>
  <div class="p-4">
    <NCard title="用户列表" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/users 接口"
      />
      <NEmpty v-else-if="!items.length && !loading" description="暂无数据" />
      <NDataTable
        v-else
        :loading="loading"
        :data="items"
        :columns="columns"
        :pagination="pagination"
      />
    </NCard>
  </div>
</template>
