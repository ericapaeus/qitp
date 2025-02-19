import { isolationHandlers } from './handlers/isolation'
import { laboratoryHandlers } from './handlers/laboratory'

export const handlers = [
  ...isolationHandlers,
  ...laboratoryHandlers,
] 