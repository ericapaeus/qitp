import type { Result } from '@/types/api/laboratory'

export const results: Result[] = [
  {
    id: '1',
    registrationNo: 'BJ2024001',
    plantName: '水稻',
    symptom: '叶片出现褐色斑点，疑似真菌感染',
    inspectionDate: '2024-02-17T10:00:00',
    inspector: {
      id: '1',
      name: '张三'
    },
    method: 'microscope',
    findings: [
      {
        id: '1',
        type: '真菌',
        description: '在叶片组织中发现褐斑病菌孢子'
      }
    ],
    conclusion: 'NEED_PROCESS',
    reviewStatus: 'PENDING',
    attachments: [
      { id: '1', name: '显微镜照片1.jpg' },
      { id: '2', name: '检验记录.pdf' }
    ]
  },
  {
    id: '2',
    registrationNo: 'BJ2024002',
    plantName: '玉米',
    symptom: '茎秆基部变色，生长受阻',
    inspectionDate: '2024-02-17T11:30:00',
    inspector: {
      id: '2',
      name: '李四'
    },
    method: 'culture',
    findings: [
      {
        id: '1',
        type: '细菌',
        description: '分离培养发现青枯病菌'
      }
    ],
    conclusion: 'FAIL',
    reviewStatus: 'APPROVED',
    reviewer: {
      id: '3',
      name: '王五',
      comments: '检验结果准确，建议按处理方案执行'
    },
    attachments: [
      { id: '1', name: '培养皿照片.jpg' },
      { id: '2', name: '检验报告.pdf' }
    ]
  }
] 