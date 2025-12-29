<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { AiRun } from '#/api/loveos/ai';

import { h, onMounted, ref } from 'vue';

import { NButton, NDescriptions, NDescriptionsItem, NDrawer, NDrawerContent, NTag } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { listAiRuns, getAiRunDetail } from '#/api';

const statusMap: Record<AiRun['status'], { label: string; type: 'primary' | 'success' | 'warning' | 'error' }> = {
  success: { label: '成功', type: 'success' },
  failed: { label: '失败', type: 'error' },
  blocked: { label: '拦截', type: 'warning' },
  timeout: { label: '超时', type: 'warning' },
};

const filterSchemas: VbenFormSchema[] = [
  {
    fieldName: 'user_id',
    label: '用户ID',
    component: 'Input',
    colProps: {
      span: 8,
    },
  },
  {
    fieldName: 'scene',
    label: '场景',
    component: 'Input',
    colProps: {
      span: 8,
    },
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '成功', value: 'success' },
        { label: '失败', value: 'failed' },
        { label: '拦截', value: 'blocked' },
        { label: '超时', value: 'timeout' },
      ],
    },
    colProps: {
      span: 8,
    },
  },
  {
    fieldName: 'model',
    label: '模型',
    component: 'Input',
    colProps: {
      span: 8,
    },
  },
  {
    fieldName: 'date_from',
    label: '开始时间',
    component: 'DatePicker',
    componentProps: {
      type: 'datetime',
    },
    colProps: {
      span: 8,
    },
  },
  {
    fieldName: 'date_to',
    label: '结束时间',
    component: 'DatePicker',
    componentProps: {
      type: 'datetime',
    },
    colProps: {
      span: 8,
    },
  },
];

const [RunGrid, runGridApi] = useVbenVxeGrid<AiRun>({
  tableTitle: 'AI Run 列表',
  tableTitleHelp: '监控 /admin/ai/runs，分页字段: page / page_size / total',
  formOptions: {
    baseColProps: { span: 8 },
    schemas: filterSchemas,
    submitOnChange: true,
  },
  gridOptions: {
    columns: [
      { field: 'id', title: 'Run ID', minWidth: 160 },
      { field: 'scene', title: '场景', minWidth: 120 },
      { field: 'model', title: '模型', minWidth: 120 },
      { field: 'username', title: '用户', minWidth: 120 },
      {
        field: 'totalTokens',
        title: 'Tokens',
        minWidth: 120,
        formatter: ({ row }) => row.totalTokens || row.promptTokens || 0,
      },
      {
        field: 'cost',
        title: '成本',
        minWidth: 120,
        slots: {
          default: 'cost',
        },
      },
      {
        field: 'status',
        title: '状态',
        minWidth: 120,
        slots: {
          default: 'status',
        },
      },
      {
        field: 'latencyMs',
        title: '耗时(ms)',
        minWidth: 100,
      },
      {
        field: 'createdAt',
        title: '时间',
        minWidth: 180,
      },
      {
        title: '操作',
        width: 120,
        fixed: 'right',
        slots: {
          default: 'actions',
        },
      },
    ],
    pagerConfig: {},
    toolbarConfig: {
      search: true,
      zoom: true,
      custom: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page, form }) => {
          const result = await listAiRuns({
            ...form,
            page: page.currentPage,
            page_size: page.pageSize,
          });
          return {
            page: {
              total: result.total,
            },
            result: result.items,
          };
        },
      },
    },
  },
  separator: {
    show: true,
  },
});

const detailVisible = ref(false);
const detailLoading = ref(false);
const currentRun = ref<AiRun | null>(null);

function renderStatus(row: AiRun) {
  const status = statusMap[row.status] || { label: row.status, type: 'primary' };
  return h(NTag, { type: status.type, size: 'small' }, { default: () => status.label });
}

function renderCost(row: AiRun) {
  if (row.cost === undefined || row.cost === null) {
    return h('span', { class: 'text-gray-400' }, row.totalTokens ?? 0);
  }
  return h(
    'span',
    { class: 'whitespace-nowrap' },
    `${row.currency ?? ''} ${row.cost?.toFixed?.(4) ?? row.cost} / ${row.totalTokens} tok`,
  );
}

function renderActions(row: AiRun) {
  return h(
    NButton,
    {
      size: 'tiny',
      quaternary: true,
      onClick: () => openDetail(row.id),
    },
    { default: () => '详情' },
  );
}

async function openDetail(runId: string) {
  detailVisible.value = true;
  detailLoading.value = true;
  try {
    currentRun.value = await getAiRunDetail(runId);
  } finally {
    detailLoading.value = false;
  }
}

onMounted(async () => {
  await runGridApi.reload();
});
</script>

<template>
  <div class="p-4">
    <RunGrid>
      <template #status="{ row }">
        <component :is="renderStatus(row)" />
      </template>
      <template #cost="{ row }">
        <component :is="renderCost(row)" />
      </template>
      <template #actions="{ row }">
        <component :is="renderActions(row)" />
      </template>
      <template #toolbar-actions>
        <NButton size="small" type="primary" secondary @click="runGridApi.reload()">
          刷新
        </NButton>
      </template>
    </RunGrid>

    <NDrawer v-model:show="detailVisible" :width="520" placement="right">
      <NDrawerContent :title="currentRun?.id || 'Run 详情'" closable>
        <NDescriptions
          v-if="currentRun"
          :label-placement="'top'"
          :column="1"
          size="small"
          :bordered="true"
        >
          <NDescriptionsItem label="Run ID">{{ currentRun.id }}</NDescriptionsItem>
          <NDescriptionsItem label="用户">{{ currentRun.username }} ({{ currentRun.userId }})</NDescriptionsItem>
          <NDescriptionsItem label="场景">{{ currentRun.scene }}</NDescriptionsItem>
          <NDescriptionsItem label="模型">{{ currentRun.model }}</NDescriptionsItem>
          <NDescriptionsItem label="Tokens">{{ currentRun.totalTokens }}</NDescriptionsItem>
          <NDescriptionsItem label="成本">
            <span v-if="currentRun.cost !== undefined">
              {{ currentRun.currency }} {{ currentRun.cost }}
            </span>
            <span v-else class="text-gray-400">未配置价格表，仅显示 tokens</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="状态">
            <component :is="renderStatus(currentRun)" />
          </NDescriptionsItem>
          <NDescriptionsItem label="耗时">{{ currentRun.latencyMs }} ms</NDescriptionsItem>
          <NDescriptionsItem label="创建时间">{{ currentRun.createdAt }}</NDescriptionsItem>
          <NDescriptionsItem label="TraceId">{{ currentRun.traceId || '-' }}</NDescriptionsItem>
        </NDescriptions>
        <div v-else-if="detailLoading" class="py-6 text-center text-gray-400">
          加载中...
        </div>
        <div v-else class="py-6 text-center text-gray-400">选择一条记录查看详情</div>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>
