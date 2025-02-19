import { enterpriseHandlers } from './handlers/enterprises'
import { quarantineHandlers } from './handlers/quarantine'
import { isolationHandlers } from './handlers/isolation'
import { laboratoryHandlers } from './handlers/laboratory'
import { reportHandlers } from './handlers/reports'

export const handlers = [
  ...enterpriseHandlers,
  ...quarantineHandlers,
  ...isolationHandlers,
  ...laboratoryHandlers,
  ...reportHandlers,
] 