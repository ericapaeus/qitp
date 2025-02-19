import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function generatePDF(element: HTMLElement, filename: string) {
  try {
    // 创建 canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    // 创建 PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4 宽度
    const pageHeight = 297 // A4 高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    // 添加第一页
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      0,
      position,
      imgWidth,
      imgHeight
    )
    heightLeft -= pageHeight

    // 如果内容超过一页，添加新页面
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        position,
        imgWidth,
        imgHeight
      )
      heightLeft -= pageHeight
    }

    // 保存 PDF
    pdf.save(filename)
    return true
  } catch (error) {
    console.error('Generate PDF failed:', error)
    return false
  }
} 