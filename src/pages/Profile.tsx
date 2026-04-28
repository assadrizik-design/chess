import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { User, History, Trophy, Swords, X, Play, ArrowRight, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

export type GameRecord = {
  id: string;
  date: string;
  moves: string[];
  outcome: string;
  opponent: string;
  finalFen: string;
  userResult?: 'win' | 'loss' | 'draw';
};

export const Profile: React.FC = () => {
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [replayingGame, setReplayingGame] = useState<GameRecord | null>(null);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replayFen, setReplayFen] = useState('start');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('chess_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
    const savedPic = localStorage.getItem('chess_profile_pic');
    if (savedPic) {
       setProfilePic(savedPic);
    }
  }, []);

  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
           if (event.target?.result) {
              setProfilePic(event.target.result as string);
              localStorage.setItem('chess_profile_pic', event.target.result as string);
           }
        };
        reader.readAsDataURL(e.target.files[0]);
     }
  };

  const clearHistory = () => {
    if (confirm('هل أنت متأكد من مسح السجل بأكمله؟')) {
      localStorage.removeItem('chess_history');
      setHistory([]);
    }
  };

  const startReplay = (game: GameRecord) => {
    setReplayingGame(game);
    setReplayIndex(0);
    setReplayFen('start'); // Starting FEN
  };

  const closeReplay = () => {
    setReplayingGame(null);
  };

  const stepForward = () => {
    if (!replayingGame) return;
    if (replayIndex < replayingGame.moves.length) {
      const c = new Chess();
      for (let i = 0; i <= replayIndex; i++) {
        c.move(replayingGame.moves[i]);
      }
      setReplayFen(c.fen());
      setReplayIndex(replayIndex + 1);
    }
  };

  const stepBackward = () => {
    if (!replayingGame) return;
    if (replayIndex > 0) {
      const c = new Chess();
      for (let i = 0; i < replayIndex - 1; i++) {
        c.move(replayingGame.moves[i]);
      }
      setReplayFen(c.fen());
      setReplayIndex(replayIndex - 1);
    }
  };

  const wins = history.filter(g => g.userResult === 'win' || (!g.userResult && g.outcome.includes('فاز'))).length;
  const losses = history.filter(g => g.userResult === 'loss' || (!g.userResult && !g.outcome.includes('فاز') && !g.outcome.includes('تعادل') && g.outcome.includes('!'))).length;
  const draws = history.filter(g => g.userResult === 'draw' || (!g.userResult && (g.outcome.includes('تعادل') || g.outcome.includes('تكرار') || g.outcome.includes('ستالميت')))).length;
  const rating = 1200 + (wins * 15) - (losses * 10);

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-[#e0e0e0] leading-relaxed font-sans w-full py-6">
      
      {!replayingGame ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-[#161616] border border-[#2a2a2a] p-6 rounded-xl shadow-xl flex flex-col items-center text-center">
              <div className="relative group cursor-pointer w-28 h-28 mb-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  onChange={handlePicUpload}
                />
                <div className="w-full h-full bg-[#222] rounded-full flex items-center justify-center shadow-xl border-4 border-[#333] overflow-hidden transition-all group-hover:border-amber-500">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-gray-500 group-hover:text-amber-500 transition-colors" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-white text-xs font-bold px-2 text-center text-balance leading-tight">تغيير الصورة</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-1">اللاعب 1</h2>
              <p className="text-amber-500 text-lg font-mono tracking-widest uppercase">التقييم: {rating}</p>
              
              <div className="w-full border-t border-[#2a2a2a] mt-6 pt-6 grid grid-cols-3 gap-2">
                 <div className="flex flex-col items-center">
                    <span className="text-green-500 text-xs uppercase mb-1">فوز</span>
                    <span className="text-white font-bold text-xl">{wins}</span>
                 </div>
                 <div className="flex flex-col items-center border-l lg:border-l-0 lg:border-r border-[#2a2a2a] pl-2 lg:pl-0 lg:pr-2">
                    <span className="text-gray-500 text-xs uppercase mb-1">تعادل</span>
                    <span className="text-white font-bold text-xl">{draws}</span>
                 </div>
                 <div className="flex flex-col items-center border-l lg:border-l-0 lg:border-r border-[#2a2a2a] pl-2 lg:pl-0 lg:pr-2">
                    <span className="text-red-500 text-xs uppercase mb-1">خسارة</span>
                    <span className="text-white font-bold text-xl">{losses}</span>
                 </div>
              </div>
            </div>
            
            <div className="bg-[#161616] border border-[#2a2a2a] p-4 rounded-xl shadow-xl flex items-center justify-between text-sm">
                <span className="text-gray-400">إجمالي المباريات</span>
                <span className="text-white font-bold font-mono text-lg">{history.length}</span>
            </div>
            {history.length > 0 && (
                <button onClick={clearHistory} className="w-full py-3 rounded-lg border border-red-900/50 bg-red-900/10 hover:bg-red-900/20 text-red-500 font-bold transition-colors">
                    مسح السجل
                </button>
            )}
          </div>
          
          {/* Match History */}
          <div className="lg:col-span-3 bg-[#161616] border border-[#2a2a2a] p-6 lg:p-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-[#2a2a2a] pb-4">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <History className="text-amber-500" /> سجل المباريات
               </h3>
            </div>

            {history.length === 0 ? (
               <div className="py-20 text-center text-gray-500 flex flex-col items-center justify-center">
                  <Swords size={48} className="mb-4 opacity-20" />
                  <p>لا توجد مباريات مسجلة حالياً.</p>
                  <p className="text-xs mt-2">العب مباراة لترى تفاصيلها هنا!</p>
               </div>
            ) : (
               <div className="space-y-4">
                  {history.map((record, idx) => (
                    <div key={`${record.id}-${idx}`} className="bg-[#111] border border-[#2a2a2a] p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-amber-500/50 transition-colors">
                       <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-inner", 
                               record.outcome.includes('فاز') ? 'bg-gradient-to-br from-green-500 to-emerald-700' : 'bg-gradient-to-br from-red-500 to-rose-700'
                             )}>
                             {record.outcome.includes('فاز') ? <Trophy size={20} /> : <X size={20} />}
                          </div>
                          <div>
                             <div className="text-white font-bold text-lg">{record.outcome}</div>
                             <div className="text-gray-400 text-xs">الخصم: <span className="text-amber-500">{record.opponent}</span></div>
                             <div className="text-gray-500 text-[10px] mt-1 font-mono tracking-widest">{new Date(record.date).toLocaleString('ar-EG')}</div>
                          </div>
                       </div>
                       
                       <button 
                         onClick={() => startReplay(record)}
                         className="w-full sm:w-auto bg-[#222] hover:bg-[#333] border border-[#2a2a2a] px-5 py-2 rounded-lg text-sm font-bold text-gray-300 transition-colors flex items-center justify-center gap-2"
                       >
                         <Play size={16} className="text-amber-500" /> إعاده العرض
                       </button>
                    </div>
                  )).reverse()}
               </div>
            )}
          </div>
        </div>
      ) : (
        /* Replay View */
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 bg-[#161616] border border-[#2a2a2a] p-6 rounded-xl animate-fade-in">
           <div className="w-full lg:w-[500px] flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                 <button onClick={closeReplay} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm bg-[#222] px-3 py-1.5 rounded border border-[#2a2a2a]">
                    <X size={16} /> إغلاق
                 </button>
                 <span className="font-bold text-amber-500 text-sm">إعادة عرض المباراة</span>
              </div>
              <div className="relative rounded bg-[#222] border-4 border-[#222] shadow-black shadow-2xl">
                 <Chessboard
                    position={replayFen}
                    customDarkSquareStyle={{ backgroundColor: '#714e3b' }}
                    customLightSquareStyle={{ backgroundColor: '#d4b58c' }}
                 />
              </div>
              <div className="flex justify-between items-center mt-6 bg-[#111] p-2 rounded-lg border border-[#2a2a2a]">
                 <button onClick={stepBackward} disabled={replayIndex === 0} className="p-3 text-white disabled:opacity-30 hover:bg-[#222] rounded transition-colors bg-[#222]">
                    <ArrowRight size={20} />
                 </button>
                 <div className="font-mono text-amber-500 font-bold tracking-widest">
                    نقلة: {replayIndex} / {replayingGame.moves.length}
                 </div>
                 <button onClick={stepForward} disabled={replayIndex === replayingGame.moves.length} className="p-3 text-white disabled:opacity-30 hover:bg-[#222] rounded transition-colors bg-[#222]">
                    <ArrowLeft size={20} />
                 </button>
              </div>
           </div>
           
           <div className="flex-1 w-full flex flex-col gap-4">
               {/* Metadata */}
               <div className="bg-[#111] border border-[#2a2a2a] p-6 rounded-xl text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{replayingGame.outcome}</h3>
                  <p className="text-gray-400">الخصم: <strong className="text-amber-500">{replayingGame.opponent}</strong></p>
                  <p className="text-gray-600 text-xs mt-2 font-mono">{new Date(replayingGame.date).toLocaleString('ar-EG')}</p>
               </div>
               
               {/* Moves */}
               <div className="bg-[#111] border border-[#2a2a2a] p-4 rounded-xl flex-1 max-h-[350px] flex flex-col">
                  <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 border-b border-[#2a2a2a] pb-2">سجل الحركات</h4>
                  <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-sm pr-2" dir="ltr">
                     {Array.from({ length: Math.ceil(replayingGame.moves.length / 2) }).map((_, i) => (
                           <div key={i} className={clsx("flex justify-between px-3 py-1.5 rounded transition-colors group", 
                              replayIndex > i * 2 ? 'text-amber-400 bg-amber-500/5' : 'text-gray-400 hover:bg-[#222]'
                           )}>
                               <span className="w-8 font-bold text-gray-600 group-hover:text-amber-500">{i + 1}.</span>
                               <span className={clsx("w-16", replayIndex === i * 2 + 1 && 'text-white border-b border-white')}>{replayingGame.moves[i * 2]}</span>
                               <span className={clsx("w-16", replayIndex === i * 2 + 2 && 'text-white border-b border-white')}>{replayingGame.moves[i * 2 + 1] || ''}</span>
                           </div>
                     ))}
                  </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};
