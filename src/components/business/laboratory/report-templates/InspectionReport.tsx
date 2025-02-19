'use client'

import type { GenerateReportResponse } from '@/types/api/laboratory'

interface InspectionReportProps {
  report: GenerateReportResponse
}

export function InspectionReport({ report }: InspectionReportProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8 print:p-0">
      {/* 标题 */}
      <div className="text-center relative mb-12">
        <h2 className="text-2xl font-bold mb-8">隔离检疫实验室检验结果报告</h2>
        <div className="absolute top-0 right-0">
          登记号：{report.registrationNo}
        </div>
      </div>

      {/* 表格内容 */}
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="border border-black p-3">登记号：</td>
            <td className="border border-black p-3">{report.registrationNo}</td>
            <td className="border border-black p-3">审批编号：</td>
            <td className="border border-black p-3">{report.approvalNo}</td>
          </tr>
          <tr>
            <td className="border border-black p-3">植物中名：</td>
            <td className="border border-black p-3">{report.plantName}</td>
            <td className="border border-black p-3">样品编号：</td>
            <td className="border border-black p-3">{report.sampleNo}</td>
          </tr>
          <tr>
            <td className="border border-black p-3">取样部位：</td>
            <td className="border border-black p-3">{report.samplingLocation}</td>
            <td className="border border-black p-3">取样数量：</td>
            <td className="border border-black p-3">{report.samplingQuantity}</td>
          </tr>
          <tr>
            <td className="border border-black p-3">取样时间：</td>
            <td className="border border-black p-3">{report.samplingTime}</td>
            <td className="border border-black p-3">取样人：</td>
            <td className="border border-black p-3">{report.sampler}</td>
          </tr>
          <tr>
            <td className="border border-black p-3">送检时间：</td>
            <td className="border border-black p-3">{report.submissionTime}</td>
            <td className="border border-black p-3">检验时间：</td>
            <td className="border border-black p-3">{report.inspectionTime}</td>
          </tr>
          <tr>
            <td className="border border-black p-3">检验方法：</td>
            <td className="border border-black p-3" colSpan={3}>{report.method}</td>
          </tr>
          <tr>
            <td className="border border-black p-3">检验结果：</td>
            <td className="border border-black p-3 min-h-[300px] align-top" colSpan={3}>
              <div className="whitespace-pre-line">{report.findings}</div>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-3" colSpan={4}>
              <div className="flex justify-between">
                <div>检验员(签名)：{report.inspector}</div>
                <div>实验室负责人：{report.labManager}</div>
              </div>
              <div className="text-right mt-8">
                {report.date}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
} 