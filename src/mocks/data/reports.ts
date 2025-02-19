import type { ProcessDecision, ProcessReport, QuarantineRelease } from '@/types/api/reports'

// 处理决定通知书数据
export const processDecisions: ProcessDecision[] = [
  {
    id: 'PD001',
    documentNo: 'PD202300001',
    sampleId: 'S001',
    title: '进口大豆处理决定通知书',
    content: '经检疫检测，发现该批次大豆携带检疫性有害生物，需要进行熏蒸处理。',
    status: 'DRAFT',
    attachments: [],
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2023-01-01T08:00:00Z'
  },
  {
    id: 'PD002',
    documentNo: 'PD202300002',
    sampleId: 'S002',
    title: '进口玉米处理决定通知书',
    content: '经检疫检测，发现该批次玉米水分含量超标，需要进行干燥处理。',
    status: 'ISSUED',
    issuedBy: {
      id: 'USER001',
      name: '张三'
    },
    issuedAt: '2023-01-02T10:00:00Z',
    attachments: [],
    createdAt: '2023-01-02T08:00:00Z',
    updatedAt: '2023-01-02T10:00:00Z'
  }
]

// 处理报告数据
export const processReports: ProcessReport[] = [
  {
    id: 'PR001',
    documentNo: 'PR202300001',
    decisionId: 'PD001',
    title: '进口大豆熏蒸处理报告',
    content: '按照处理决定要求，对该批次大豆进行了溴甲烷熏蒸处理。',
    processor: {
      id: 'USER002',
      name: '李四'
    },
    processMethod: '溴甲烷熏蒸',
    processResult: '处理完成，检疫性有害生物已被杀灭。',
    attachments: [],
    createdAt: '2023-01-03T08:00:00Z',
    updatedAt: '2023-01-03T08:00:00Z'
  },
  {
    id: 'PR002',
    documentNo: 'PR202300002',
    decisionId: 'PD002',
    title: '进口玉米干燥处理报告',
    content: '按照处理决定要求，对该批次玉米进行了干燥处理。',
    processor: {
      id: 'USER003',
      name: '王五'
    },
    processMethod: '热风干燥',
    processResult: '处理完成，水分含量已降至标准范围内。',
    attachments: [],
    createdAt: '2023-01-04T08:00:00Z',
    updatedAt: '2023-01-04T08:00:00Z'
  }
]

// 检疫放行证书数据
export const quarantineReleases: QuarantineRelease[] = [
  {
    id: 'QR001',
    documentNo: 'QR202300001',
    registrationNo: 'REG001',
    title: '进口大豆检疫放行证书',
    content: '该批次大豆经处理后符合检疫要求，准予放行。',
    issuer: {
      id: 'USER001',
      name: '张三'
    },
    issuedAt: '2023-01-05T08:00:00Z',
    validUntil: '2023-02-05T08:00:00Z',
    attachments: [],
    createdAt: '2023-01-05T08:00:00Z',
    updatedAt: '2023-01-05T08:00:00Z'
  },
  {
    id: 'QR002',
    documentNo: 'QR202300002',
    registrationNo: 'REG002',
    title: '进口玉米检疫放行证书',
    content: '该批次玉米经处理后符合检疫要求，准予放行。',
    issuer: {
      id: 'USER001',
      name: '张三'
    },
    issuedAt: '2023-01-06T08:00:00Z',
    validUntil: '2023-02-06T08:00:00Z',
    attachments: [],
    createdAt: '2023-01-06T08:00:00Z',
    updatedAt: '2023-01-06T08:00:00Z'
  }
] 