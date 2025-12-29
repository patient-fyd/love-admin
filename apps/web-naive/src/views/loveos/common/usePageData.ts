import { ref } from 'vue';

import { message } from '#/adapter/naive';
import { requestClient } from '#/api/request';

export function usePaginatedEndpoint<T = any>(
  url: string,
  defaultParams: Record<string, any> = {},
) {
  const loading = ref(false);
  const items = ref<T[]>([]);
  const total = ref(0);
  const error = ref<string | null>(null);

  const fetch = async (params: Record<string, any> = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await requestClient.get<any>(url, {
        params: {
          page: 1,
          page_size: 10,
          ...defaultParams,
          ...params,
        },
      });
      items.value = result?.items ?? [];
      total.value = result?.total ?? items.value.length;
    } catch (err: any) {
      error.value = err?.message ?? '加载失败';
      message.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  return { loading, items, total, error, fetch };
}
