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
};

export const Profile: React.FC = () => {
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [replayingGame, setReplayingGame] = useState<GameRecord | null>(null);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replayFen, setReplayFen] = useState('start');

  useEffect(() => {
    const saved = localStorage.getItem('chess_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

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

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-[#e0e0e0] leading-relaxed font-sans w-full py-6">
      
      {!replayingGame ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-[#161616] border border-[#2a2a2a] p-6 rounded-xl shadow-xl flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-[#222]">
                <User size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-1">اللاعب 1</h2>
              <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">التقييم: 1200</p>
              
              <div className="w-full border-t border-[#2a2a2a] mt-6 pt-6 flex justify-around">
                 <div className="flex flex-col items-center">
                    <span className="text-gray-500 text-xs uppercase">المباريات</span>
                    <span className="text-white font-bold text-xl">{history.length}</span>
                 </div>
                 <div className="w-px h-full bg-[#2a2a2a]"></div>
                 <div className="flex flex-col items-center">
                    <span className="text-green-500 text-xs uppercase">فوز</span>
                    <span className="text-white font-bold text-xl">
                      {history.filter(g => g.outcome.includes('فاز')).length}
                    </span>
                 </div>
              </div>
            </div>
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
                    options={{
                       position: replayFen,
                       darkSquareStyle: { backgroundColor: '#714e3b' },
                       lightSquareStyle: { backgroundColor: '#d4b58c' },
                    }}
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
