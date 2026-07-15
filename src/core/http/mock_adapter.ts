import {HttpError} from './http_error';
import type {HttpAdapter, HttpRequestConfig, HttpResponse} from './types';

type PedidoMock = {
  id: number;
  codigo: string;
  status: string;
  criadoEm: string;
};

type MetricaMock = {
  id: string;
  nome: string;
  valor: string;
};

type ContadorMock = {
  valor: number;
  atualizadoEm: string;
};

const MOCK_PEDIDOS: PedidoMock[] = [
  {
    id: 1024,
    codigo: 'PED-1024',
    status: 'EM_SEPARACAO',
    criadoEm: '2026-07-10T10:00:00.000Z',
  },
  {
    id: 1025,
    codigo: 'PED-1025',
    status: 'EM_TRANSITO',
    criadoEm: '2026-07-11T14:30:00.000Z',
  },
  {
    id: 1026,
    codigo: 'PED-1026',
    status: 'ENTREGUE',
    criadoEm: '2026-07-08T09:15:00.000Z',
  },
  {
    id: 1027,
    codigo: 'PED-1027',
    status: 'AGUARDANDO_PAGAMENTO',
    criadoEm: '2026-07-14T16:45:00.000Z',
  },
];

const MOCK_METRICAS: MetricaMock[] = [
  {id: 'cpu', nome: 'CPU', valor: '42%'},
  {id: 'memoria', nome: 'Memória', valor: '68%'},
  {id: 'rede', nome: 'Rede', valor: '12 Mb/s'},
  {id: 'disco', nome: 'Disco', valor: '81%'},
];

let contadorEstado: ContadorMock = {
  valor: 0,
  atualizadoEm: new Date().toISOString(),
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function pathOf(url: string): string {
  const withoutQuery = url.split('?')[0] ?? url;
  try {
    if (/^https?:\/\//i.test(withoutQuery)) {
      return new URL(withoutQuery).pathname;
    }
  } catch {
    // ignore parse errors — treat as relative path
  }
  return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
}

function ok<T>(config: HttpRequestConfig, data: T, status = 200): HttpResponse<T> {
  return {
    data,
    status,
    headers: {'content-type': 'application/json'},
    config,
  };
}

function notFound(config: HttpRequestConfig, message: string): never {
  throw new HttpError({
    message,
    status: 404,
    config,
    data: {message},
  });
}

/**
 * In-memory adapter for the POC — serves microapp domain routes.
 * Swap for `fetchAdapter` in production via `configureHttpClient`.
 */
export const mockAdapter: HttpAdapter = async (
  config: HttpRequestConfig,
): Promise<HttpResponse> => {
  await delay(120);
  const path = pathOf(config.url);
  const method = config.method;
  if (method === 'GET' && path === '/pedidos') {
    return ok(config, {data: MOCK_PEDIDOS});
  }
  const pedidoMatch = /^\/pedidos\/(\d+)$/.exec(path);
  if (method === 'GET' && pedidoMatch) {
    const id = Number(pedidoMatch[1]);
    const pedido = MOCK_PEDIDOS.find(item => item.id === id);
    if (!pedido) {
      notFound(config, `Pedido ${id} não encontrado`);
    }
    return ok(config, pedido);
  }
  if (method === 'GET' && path === '/metricas') {
    return ok(config, {data: MOCK_METRICAS});
  }
  const metricaMatch = /^\/metricas\/([^/]+)$/.exec(path);
  if (method === 'GET' && metricaMatch) {
    const id = metricaMatch[1];
    const metrica = MOCK_METRICAS.find(item => item.id === id);
    if (!metrica) {
      notFound(config, `Métrica ${id} não encontrada`);
    }
    return ok(config, metrica);
  }
  if (method === 'GET' && path === '/contador') {
    return ok(config, {data: {...contadorEstado}});
  }
  if (method === 'POST' && path === '/contador') {
    const body = (config.body ?? {}) as {valor?: number};
    const valor = typeof body.valor === 'number' ? body.valor : 0;
    contadorEstado = {
      valor,
      atualizadoEm: new Date().toISOString(),
    };
    return ok(config, {...contadorEstado});
  }
  notFound(config, `Rota mock não encontrada: ${method} ${path}`);
};
