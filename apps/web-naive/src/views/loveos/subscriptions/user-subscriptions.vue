<script lang="ts" setup>
import { h, onMounted, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';

import { NButton, NCard, NDataTable, NEmpty, NResult, NSpace } from 'naive-ui';

import { usePaginatedEndpoint } from '../common/usePageData';

interface UserSubscriptionItem {
  id: string;
  planName: string;
  status: string;
  expiredAt?: string;
}

const route = useRoute();
const { loading, items, total, error, fetch } = usePaginatedEndpoint<
  UserSubscriptionItem
>(`/admin/subscriptions/users/${route.params.userId}`);

const columns = [
  { title: '订阅ID', key: 'id' },
  { title: '套餐', key: 'planName' },
  { title: '状态', key: 'status' },
  { title: '过期时间', key: 'expiredAt' },
  {
    title: '操作',
    key: 'actions',
    render: (row: UserSubscriptionItem) =>
      h(NSpace, null, {
        default: () => [
          h(
            NButton,
            { size: 'tiny', quaternary: true, onClick: () => console.log('手动开通', row) },
            { default: () => '开通' },
          ),
          h(
            NButton,
            { size: 'tiny', quaternary: true, type: 'error', onClick: () => console.log('取消订阅', row) },
            { default: () => '取消' },
          ),
        ],
      }),
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
    <NCard :title="`用户 ${route.params.userId} 订阅`" :loading="loading">
      <NResult
        v-if="error"
        status="error"
        :title="error"
        description="检查 /admin/subscriptions/users/:userId 接口"
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
