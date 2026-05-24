import type { TankConfig } from '../types/dashboard'

export const apiBaseUrl =
  import.meta.env.VITE_BERNOULLI_API_URL ?? 'http://localhost:8080'

export const gatewayId =
  import.meta.env.VITE_BERNOULLI_GATEWAY_ID ?? 'gateway-simulator'

export const pumpTag = 'pump'

export const tankConfigs: TankConfig[] = [
  {
    id: 'tank_1',
    name: 'Tank 1',
    flowTag: 'tank_1_flow',
    valveTag: 'tank_1_valve',
  },
  {
    id: 'tank_2',
    name: 'Tank 2',
    flowTag: 'tank_2_flow',
    valveTag: 'tank_2_valve',
  },
  {
    id: 'tank_3',
    name: 'Tank 3',
    flowTag: 'tank_3_flow',
    valveTag: 'tank_3_valve',
  },
]

export const refreshRateOptions = [
  { label: 'Paused', value: 0 },
  { label: '1s', value: 1 },
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
]
