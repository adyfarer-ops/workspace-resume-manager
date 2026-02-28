import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ArrowRight, Calendar, Tag, BookOpen } from 'lucide-react';
import type { Note } from '../types';

export function NotesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>(id ? 'detail' : 'list');

  useEffect(() => {
    loadNotes();
  }, []);

  // 只在初始加载时根据 URL 参数加载文章，后续切换不依赖 URL
  useEffect(() => {
    if (id && notes.length > 0) {
      const note = notes.find(n => n.id === id);
      if (note) {
        setCurrentNote(note);
        setViewMode('detail');
        // 增加浏览次数（异步，不阻塞）
        supabase.rpc('increment_note_view', { note_id: id });
      }
    }
  }, [id, notes]);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteClick = (noteId: string) => {
    // 直接从已加载的列表中查找，无需重新请求
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNote(note);
      setViewMode('detail');
      // 静默更新 URL，不触发页面刷新
      window.history.replaceState(null, '', `/notes/${noteId}`);
      // 增加浏览次数（异步）
      supabase.rpc('increment_note_view', { note_id: noteId });
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setCurrentNote(null);
    window.history.replaceState(null, '', '/notes');
  };

  const getAdjacentNotes = () => {
    if (!currentNote || notes.length === 0) return { prev: null, next: null };
    const currentIndex = notes.findIndex(n => n.id === currentNote.id);
    return {
      prev: currentIndex < notes.length - 1 ? notes[currentIndex + 1] : null,
      next: currentIndex > 0 ? notes[currentIndex - 1] : null
    };
  };

  const { prev, next } = getAdjacentNotes();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>返回首页</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：笔记列表 */}
          <div className={`lg:col-span-1 ${viewMode === 'detail' ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen size={24} className="text-amber-600" />
                <h1 className="text-2xl font-bold text-stone-900 font-serif">手札随笔</h1>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-stone-400">
                    暂无笔记
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleNoteClick(note.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        currentNote?.id === note.id
                          ? 'bg-amber-100 border-l-4 border-amber-600'
                          : 'bg-white hover:bg-stone-100 border-l-4 border-transparent'
                      }`}
                    >
                      <h3 className={`font-bold mb-2 font-serif ${
                        currentNote?.id === note.id ? 'text-amber-900' : 'text-stone-900'
                      }`}>
                        {note.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <Calendar size={12} />
                        {new Date(note.created_at).toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 右侧：详情内容 */}
          <div className={`lg:col-span-2 ${viewMode === 'list' ? 'hidden lg:block' : ''}`}>
            {viewMode === 'list' && !currentNote ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-stone-400">
                <BookOpen size={48} className="mb-4 opacity-50" />
                <p>点击左侧列表查看文章详情</p>
              </div>
            ) : currentNote ? (
              <article className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
                {/* 标题区 */}
                <header className="mb-8 pb-8 border-b border-stone-100">
                  <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4 font-serif">
                    {currentNote.title}
                  </h1>
                  
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(currentNote.created_at).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-600">大鱼</span>
                  </div>

                  {/* 标签 */}
                  {currentNote.tags && currentNote.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <Tag size={14} className="text-stone-400" />
                      {currentNote.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </header>

                {/* 摘要 */}
                {currentNote.summary && (
                  <div className="mb-6 p-4 bg-amber-50/50 border-l-4 border-amber-400 rounded-r-lg">
                    <p className="text-stone-700 italic font-serif text-sm">{currentNote.summary}</p>
                  </div>
                )}

                {/* 正文 */}
                <div 
                  className="prose prose-stone max-w-none font-serif leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentNote.content }}
                />

                {/* 底部导航 */}
                <div className="mt-12 pt-8 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    {prev ? (
                      <button
                        onClick={() => handleNoteClick(prev.id)}
                        className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors text-sm"
                      >
                        <ArrowLeft size={16} />
                        <div className="text-left">
                          <div className="text-xs text-stone-400">上一篇</div>
                          <div className="max-w-[150px] truncate">{prev.title}</div>
                        </div>
                      </button>
                    ) : (
                      <div />
                    )}

                    {next ? (
                      <button
                        onClick={() => handleNoteClick(next.id)}
                        className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors text-sm"
                      >
                        <div className="text-right">
                          <div className="text-xs text-stone-400">下一篇</div>
                          <div className="max-w-[150px] truncate">{next.title}</div>
                        </div>
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </article>
            ) : (
              <div className="text-center py-20 text-stone-400">
                笔记不存在或已被删除
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
