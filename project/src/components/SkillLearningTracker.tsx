import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, TrendingUp } from 'lucide-react';

interface SkillLearningLog {
  id: string;
  date: string;
  content: string;
  extracted_skills: string[];
  related_skill_category: string;
  confidence_score: number;
}

export function SkillLearningTracker() {
  const [logs, setLogs] = useState<SkillLearningLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 获取最近的学习记录
      const { data: logsData } = await supabase
        .from('skill_learning_logs')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);
      
      setLogs(logsData || []);
    } catch (error) {
      console.error('Error loading skill learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-stone-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-stone-200 rounded w-1/3"></div>
          <div className="h-20 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp size={20} className="text-theme-primary" />
        <h3 className="font-bold text-stone-900 font-serif">技能学习追踪</h3>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
          <h3 className="font-bold text-stone-900 flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-theme-primary" />
            最近学习记录
          </h3>
        </div>

        <div className="divide-y divide-stone-100">
          {logs.length === 0 ? (
            <div className="px-6 py-8 text-center text-stone-500">
              暂无学习记录，系统将在每天0点自动分析
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="px-6 py-4 hover:bg-stone-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-stone-900">
                    {log.related_skill_category}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(log.date).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <p className="text-sm text-stone-600 mb-2 line-clamp-2">
                  {log.content}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {log.extracted_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
