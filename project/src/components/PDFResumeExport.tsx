import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export function PDFResumeExport() {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPDF = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // 调用后端 API 生成 PDF
      const response = await fetch('/ady/api/resume/pdf');
      
      if (!response.ok) {
        throw new Error('PDF 生成失败');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '安鼎禹-计算机应用专业.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('下载失败:', error);
      alert('PDF 生成失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={downloadPDF}
      disabled={isGenerating}
      className="flex-1 px-5 py-2.5 bg-[#1c1917] text-[#e7e5e4] text-sm font-serif hover:bg-theme-primary transition-colors duration-300 shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span>生成中...</span>
        </>
      ) : (
        <>
          <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
          <span>下载简历</span>
        </>
      )}
    </button>
  );
}
