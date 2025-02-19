import type { Task } from '@/types/laboratory'

export const tasks: Task[] = [
  {
    id: '1',
    registrationNo: 'BJ2024001',
    plantName: '水稻',
    symptom: '叶片出现褐色斑点，疑似真菌感染',
    samplingDate: '2024-02-17T10:00:00',
    priority: 'high',
    status: 'pending',
    inspector: null
  },
  {
    id: '2',
    registrationNo: 'BJ2024002',
    plantName: '玉米',
    symptom: '茎秆基部变色，生长受阻',
    samplingDate: '2024-02-17T11:30:00',
    priority: 'normal',
    status: 'in_progress',
    inspector: {
      id: '1',
      name: '张三'
    }
  },
  {
    id: '3',
    registrationNo: 'BJ2024003',
    plantName: '小麦',
    symptom: '叶片黄化，生长缓慢',
    samplingDate: '2024-02-17T09:00:00',
    priority: 'high',
    status: 'completed',
    inspector: {
      id: '2',
      name: '李四'
    }
  },
  {
    id: '4',
    registrationNo: 'BJ2024004',
    plantName: '大豆',
    symptom: '根部出现褐变',
    samplingDate: '2024-02-17T14:00:00',
    priority: 'normal',
    status: 'completed',
    inspector: {
      id: '1',
      name: '张三'
    }
  },
  {
    id: '5',
    registrationNo: 'BJ2024005',
    plantName: '水稻',
    symptom: '种子表面有可疑斑点',
    samplingDate: '2024-02-17T15:30:00',
    priority: 'low',
    status: 'pending',
    inspector: null
  }
] 