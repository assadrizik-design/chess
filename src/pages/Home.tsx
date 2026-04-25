import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { ChessEngine } from '../engine/Stockfish';
import { Search, Bot, Users, Swords, RefreshCw, Cpu, Trophy, AlertTriangle, Loader2, Clock, Hourglass, User, Check, Globe } from 'lucide-react';

import Peer, { DataConnection } from 'peerjs';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Home: React.FC<{ onNavigate: (p: string) => void, onGameChange?: (inGame: boolean) => void }> = ({ onNavigate, onGameChange }) => {
  const [game, setGame] = useState(new Chess());
  const [gameMode, setGameMode] = useState<'menu' | 'bot-setup' | 'bot' | 'online'>('menu');

  useEffect(() => {
    if (onGameChange) {
      onGameChange(gameMode === 'bot' || gameMode === 'online');
    }
  }, [gameMode, onGameChange]);
  const [fen, setFen] = useState(game.fen());
  const [history, setHistory] = useState<string[]>([]);
  
  // Board Highlighting State
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});
  const [moveFrom, setMoveFrom] = useState('');
  const [pendingPromotion, setPendingPromotion] = useState<{from: string, to: string, color: "w"|"b"} | null>(null);

  // Bot settings
  const [botLevel, setBotLevel] = useState<'easy'|'medium'|'hard'>('medium');
  const engine = useRef<ChessEngine | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);

  // Multiplayer Matchmaking settings
  const [matchmakingState, setMatchmakingState] = useState<'idle' | 'searching' | 'found'>('idle');
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [isHost, setIsHost] = useState(true); // Host plays white by default
  const peerInstance = useRef<Peer | null>(null);

  // Status
  const [statusText, setStatusText] = useState('جاهز للعب');
  const [gameOver, setGameOver] = useState('');

  // Timer settings
  const INITIAL_TIME_SEC = 600; // 10 minutes
  const [whiteTime, setWhiteTime] = useState(INITIAL_TIME_SEC);
  const [blackTime, setBlackTime] = useState(INITIAL_TIME_SEC);
  const [timerActive, setTimerActive] = useState(false);

  // Ad and tracking state
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [adTimer, setAdTimer] = useState(30);
  const [adCanSkip, setAdCanSkip] = useState(false);

  useEffect(() => {
    let adInterval: any;
    if (showAdOverlay) {
      setAdTimer(30);
      setAdCanSkip(false);
      adInterval = setInterval(() => {
        setAdTimer(prev => {
           if (prev <= 20) setAdCanSkip(true);
           if (prev <= 1) {
              clearInterval(adInterval);
              setShowAdOverlay(false);
              return 0;
           }
           return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(adInterval);
  }, [showAdOverlay]);

  // Time format helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeOut = (winnerStr: string) => {
    setGameOver(winnerStr);
    saveToHistory(game, winnerStr);
  };

  const saveToHistory = (currGame: Chess, outcomeStr: string) => {
    // Show Ad if game lasted more than 4 minutes (240,000 ms) and it's not a local game
    const elapsedTime = Date.now() - gameStartTime;
    if (elapsedTime > 4 * 60 * 1000 && gameMode !== 'menu') {
       setShowAdOverlay(true);
    }

    try {
      const saved = localStorage.getItem('chess_history');
      const historyArr = saved ? JSON.parse(saved) : [];
      let opponent = 'محلي';
      if (gameMode === 'bot') {
          opponent = botLevel === 'easy' ? 'بوت (سهل)' : (botLevel === 'medium' ? 'بوت (متوسط)' : 'بوت (صعب)');
      } else if (gameMode === 'online') {
          opponent = 'لاعب أونلاين';
      }

      historyArr.push({
        id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
        moves: currGame.history(),
        outcome: outcomeStr,
        opponent: opponent,
        finalFen: currGame.fen()
      });
      localStorage.setItem('chess_history', JSON.stringify(historyArr));
    } catch (e) {
      console.error("Failed to save history");
    }
  };

  const handleResign = () => {
    const outcomeStr = "انسحاب! فاز " + (game.turn() === 'w' ? "الأسود" : "الأبيض");
    setGameOver(outcomeStr);
    
    if (gameMode === 'online' && connection) {
      connection.send({ type: 'resign' });
    }
    
    saveToHistory(game, outcomeStr);
  };

  useEffect(() => {
    let timer: any;
    if (timerActive && !gameOver && !game.isGameOver() && gameMode !== 'bot' && gameMode !== 'menu') {
       timer = setInterval(() => {
          if (game.turn() === 'w') {
             setWhiteTime(prev => {
                if (prev <= 1) {
                   handleTimeOut('انتهى الوقت! فاز الأسود');
                   return 0;
                }
                return prev - 1;
             });
          } else {
             setBlackTime(prev => {
                if (prev <= 1) {
                   handleTimeOut('انتهى الوقت! فاز الأبيض');
                   return 0;
                }
                return prev - 1;
             });
          }
       }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, gameOver, game]);

  const initGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setHistory([]);
    setGameOver('');
    setStatusText('جاهز للعب');
    setOptionSquares({});
    setMoveFrom('');
    setPendingPromotion(null);
    setWhiteTime(INITIAL_TIME_SEC);
    setBlackTime(INITIAL_TIME_SEC);
    setTimerActive(false);
    setGameStartTime(Date.now());
  };

  useEffect(() => {
    // Engine Initialization
    if (!engine.current) {
      engine.current = new ChessEngine();
      engine.current.init();
      engine.current.setCallback((msg) => {
        if (msg.type === 'bestmove') {
          handleBotMove(msg.move);
        }
      });
    }

    // Load persisted state
    const saved = localStorage.getItem('active_game_state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.gameMode === 'bot' || state.gameMode === 'online') {
           setGameMode(state.gameMode);
           if (state.botLevel) setBotLevel(state.botLevel);
           const loadedGame = new Chess(state.fen);
           setGame(loadedGame);
           setFen(state.fen);
           setHistory(state.history || []);
           setWhiteTime(state.whiteTime);
           setBlackTime(state.blackTime);
           setTimerActive(state.timerActive);
           
           if (state.gameMode === 'online' && state.matchId) {
              setMatchmakingState('found');
              if (state.isHost) {
                 setupMatchHost(state.matchId, true);
              } else {
                 setupMatchClient(state.matchId, true);
              }
           }
        }
      } catch(e) {}
    }

    return () => {
      engine.current?.quit();
      if (peerInstance.current) {
         peerInstance.current.destroy();
      }
    };
  }, []);

  // Persist state on change
  useEffect(() => {
    if (gameMode === 'bot' || gameMode === 'online') {
      if (!gameOver && !game.isGameOver()) {
        let matchId = '';
        if (gameMode === 'online') {
          if (isHost && peerInstance.current) matchId = peerInstance.current.id;
          else if (connection) matchId = connection.peer;
        }
        localStorage.setItem('active_game_state', JSON.stringify({
          gameMode, botLevel, fen, history, whiteTime, blackTime, timerActive, isHost, matchId
        }));
      } else {
        localStorage.removeItem('active_game_state');
      }
    } else {
      localStorage.removeItem('active_game_state');
    }
  }, [gameMode, botLevel, fen, history, whiteTime, blackTime, timerActive, isHost, connection, gameOver]);

  const startMatchmaking = () => {
    setMatchmakingState('searching');
    setStatusText('جاري البحث عن لاعب...');
    
    // Clean up any existing peer
    if (peerInstance.current) {
      peerInstance.current.destroy();
      peerInstance.current = null;
    }

    const LOBBY_ID = 'CHESS_ARABIC_PRO_LOBBY_v3';
    const PeerJS = (Peer as any).default || Peer;
    const lobbyPeer = new PeerJS(LOBBY_ID);

    // Keep track of this specific attempt to avoid state leaks
    peerInstance.current = lobbyPeer;

    lobbyPeer.on('open', () => {
      // We are the lobby host
      lobbyPeer.on('connection', (conn: any) => {
        conn.on('open', () => {
          const matchId = `MATCH_${Math.random().toString(36).substr(2, 9)}`;
          conn.send({ type: 'REDIRECT', matchId });
          
          setTimeout(() => {
            lobbyPeer.destroy();
            setupMatchHost(matchId);
          }, 500);
        });
      });
    });

    lobbyPeer.on('error', (err: any) => {
      if (err.type === 'unavailable-id') {
        // Someone else is hosting lobby, we are the client
        const clientPeer = new PeerJS();
        peerInstance.current = clientPeer; // replace with client peer
        
        clientPeer.on('open', () => {
           const conn = clientPeer.connect(LOBBY_ID);

           conn.on('data', (data: any) => {
             if (data.type === 'REDIRECT') {
               clientPeer.destroy();
               setTimeout(() => {
                 setupMatchClient(data.matchId);
               }, 1500);
             }
           });
           
           conn.on('error', () => {
             // Could fail if lobby was destroyed exactly now
             clientPeer.destroy();
             setTimeout(() => {
                if (peerInstance.current === clientPeer) startMatchmaking();
             }, 1000);
           });
        });
      } else {
        setMatchmakingState('idle');
        setStatusText('فشل الاتصال بخادم البحث.');
      }
    });
  };

  const cancelMatchmaking = () => {
    if (peerInstance.current) {
      peerInstance.current.destroy();
      peerInstance.current = null;
    }
    setMatchmakingState('idle');
    setStatusText('تم إلغاء البحث.');
  };

  const setupMatchHost = (matchId: string, isReconnect = false) => {
    const PeerJS = (Peer as any).default || Peer;
    const peer = new PeerJS(matchId);
    peerInstance.current = peer;
    
    peer.on('connection', (conn: any) => {
       setConnection(conn);
       setIsHost(true);
       setGameMode('online');
       setMatchmakingState('found');
       if (!isReconnect) initGame();
       setStatusText('تم العثور على خصم! أنت تلعب بالقطع البيضاء.');
       
       conn.on('data', handleIncomingMove);
       conn.on('close', () => {
           setStatusText('انقطع الاتصال بالخصم. في انتظار عودته...');
       });
    });
  };

  const setupMatchClient = (matchId: string, isReconnect = false) => {
    const PeerJS = (Peer as any).default || Peer;
    const peer = new PeerJS();
    peerInstance.current = peer;
    
    peer.on('open', () => {
       const tryConnect = (retries = 3) => {
         // Check if matchmaking was cancelled during the wait
         if (peerInstance.current !== peer) return; 

         const conn = peer.connect(matchId);
         
         conn.on('open', () => {
           setConnection(conn);
           setIsHost(false);
           setGameMode('online');
           setMatchmakingState('found');
           if (!isReconnect) initGame();
           setStatusText('تم العثور على خصم! أنت تلعب بالقطع السوداء.');
           
           conn.on('data', handleIncomingMove);
           conn.on('close', () => {
               setStatusText('انقطع الاتصال بالخصم. تم قطع المباراة...');
           });
         });
         
         conn.on('error', () => {
            if (retries > 0) {
              setTimeout(() => tryConnect(retries - 1), 1000);
            } else {
              peer.destroy();
              if (peerInstance.current === peer) {
                 setMatchmakingState('idle');
                 setStatusText('فشل الاتصال بالخصم. حاول مجدداً.');
              }
            }
         });
       };
       
       tryConnect();
    });
  };

  const handleIncomingMove = (data: any) => {
    if (data.type === 'resign') {
      const outcomeStr = "انسحاب الخصم! مكسب سهل.";
      setGameOver(outcomeStr);
      saveToHistory(game, outcomeStr);
      return;
    }
    if (data.type === 'move') {
      const colorThatMoved = game.turn();
      if (!timerActive) setTimerActive(true);
      else {
        if (colorThatMoved === 'w') setWhiteTime(t => t + 2);
        else setBlackTime(t => t + 2);
      }
      setGame((g) => {
        const gameCopy = new Chess(g.fen());
        try {
          gameCopy.move(data.move);
          setFen(gameCopy.fen());
          setHistory(gameCopy.history());
          checkGameOver(gameCopy);
        } catch (e) {
          console.error("Invalid move received", e);
        }
        return gameCopy;
      });
    }
  };

  const checkGameOver = (currGame: Chess) => {
    if (currGame.isGameOver()) {
      let outcomeStr = '';
      if (currGame.isCheckmate()) {
        outcomeStr = currGame.turn() === 'w' ? 'فاز الأسود (كش مات)' : 'فاز الأبيض (كش مات)';
      } else if (currGame.isDraw()) {
        outcomeStr = 'تعادل';
      } else if (currGame.isStalemate()) {
        outcomeStr = 'تعادل (ملك مخنوق)';
      }
      setGameOver(outcomeStr);
      saveToHistory(currGame, outcomeStr);
    }
  };

  const triggerBotTurn = (currGame: Chess) => {
    if (currGame.isGameOver()) return;
    setIsBotThinking(true);
    let depth = 5; 
    let effSkill = 5; 
    if (botLevel === 'easy') {
      depth = 1;
      effSkill = 0;
    } else if (botLevel === 'medium') {
      depth = 5;
      effSkill = 5;
    } else if (botLevel === 'hard') {
      depth = 10;
      effSkill = 20;
    }

    engine.current?.evaluatePosition(currGame.fen(), depth, effSkill);
  };

  const handleBotMove = (bestMoveString: string) => {
    if(!bestMoveString) return;
    setGame((g) => {
      const colorThatMoved = g.turn();
      if (!timerActive) setTimerActive(true);
      else {
        if (colorThatMoved === 'w') setWhiteTime(t => t + 2);
        else setBlackTime(t => t + 2);
      }
      const copy = new Chess(g.fen());
      try {
        copy.move({
          from: bestMoveString.substring(0, 2),
          to: bestMoveString.substring(2, 4),
          promotion: bestMoveString.length > 4 ? bestMoveString[4] : 'q',
        });
        setFen(copy.fen());
        setHistory(copy.history());
        checkGameOver(copy);
      } catch (e) {
        console.error("Bot tried invalid move", bestMoveString);
      }
      return copy;
    });
    if (!timerActive) setTimerActive(true);
    setIsBotThinking(false);
  };

  const confirmPromotion = (piece: string) => {
    if (!pendingPromotion) return;
    
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        promotion: piece
      });

      if (move === null) {
        setPendingPromotion(null);
        return;
      }

      const colorThatMoved = pendingPromotion.color;
      if (gameMode === 'online') {
         if (!timerActive) setTimerActive(true);
         else {
            if (colorThatMoved === 'w') setWhiteTime(t => t + 2);
            else setBlackTime(t => t + 2);
         }
      }

      setGame(gameCopy);
      setFen(gameCopy.fen());
      setHistory(gameCopy.history());
      setMoveFrom('');
      setOptionSquares({});
      setPendingPromotion(null);
      
      checkGameOver(gameCopy);

      if (gameMode === 'online' && connection) {
        connection.send({ type: 'move', move: move.san });
      }

      if (gameMode === 'bot' && !gameCopy.isGameOver()) {
        setTimeout(() => triggerBotTurn(gameCopy), 300);
      }
    } catch (e) {
      setPendingPromotion(null);
    }
  };

  function getMoveOptions(square: string) {
    const moves = game.moves({
      square: square as Square,
      verbose: true
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const newSquares: Record<string, any> = {};
    moves.forEach((move: any) => {
      newSquares[move.to] = {
        background:
          game.get(move.to as Square) && game.get(move.to as Square)?.color !== game.get(square as Square)?.color
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.6) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 25%, transparent 25%)',
        borderRadius: '50%'
      };
    });
    newSquares[square] = {
      background: 'rgba(245, 158, 11, 0.5)'
    };
    setOptionSquares(newSquares);
  }

  function onSquareClick({ square }: { square: string }) {
    if (game.isGameOver()) return;
    if (gameMode === 'online' && ((isHost && game.turn() === 'b') || (!isHost && game.turn() === 'w'))) return;
    if (gameMode === 'bot' && game.turn() === 'b') return; 

    function resetFirstMove(square: string) {
      const hasPiece = game.get(square as Square);
      if (hasPiece && hasPiece.color === game.turn()) {
        setMoveFrom(square);
        getMoveOptions(square);
      } else {
        setMoveFrom('');
        setOptionSquares({});
      }
    }

    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    const moves = game.moves({ verbose: true });
    const isPromotion = moves.some(m => m.from === moveFrom && m.to === square && m.promotion);
    
    if (isPromotion) {
       setPendingPromotion({ from: moveFrom, to: square, color: game.turn() });
       return;
    }

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: 'q'
      });

      if (move === null) {
        resetFirstMove(square);
        return;
      }

      const colorThatMoved = game.turn();
      if (gameMode === 'online') {
         if (!timerActive) setTimerActive(true);
         else {
           if (colorThatMoved === 'w') setWhiteTime(t => t + 2);
           else setBlackTime(t => t + 2);
         }
      }

      setGame(gameCopy);
      setFen(gameCopy.fen());
      setHistory(gameCopy.history());
      setMoveFrom('');
      setOptionSquares({});
      
      checkGameOver(gameCopy);

      if (gameMode === 'online' && connection) {
        connection.send({ type: 'move', move: move.san });
      }

      if (gameMode === 'bot' && !gameCopy.isGameOver()) {
        setTimeout(() => triggerBotTurn(gameCopy), 300);
      }

    } catch (err) {
      resetFirstMove(square);
    }
  }

  const onPieceDragBegin = ({ square: sourceSquare }: { square: string }) => {
    if (game.isGameOver()) return;
    if (gameMode === 'online' && ((isHost && game.turn() === 'b') || (!isHost && game.turn() === 'w'))) return;
    if (gameMode === 'bot' && game.turn() === 'b') return;
    
    const hasPiece = game.get(sourceSquare as Square);
    if (hasPiece && hasPiece.color === game.turn()) {
      setMoveFrom(sourceSquare);
      getMoveOptions(sourceSquare);
    }
  };

  const onDrop = ({ sourceSquare, targetSquare }: { sourceSquare: string, targetSquare: string }) => {
    setMoveFrom('');
    setOptionSquares({});
    if (game.isGameOver()) return false;
    
    // Prevent moving if playing online and it's not our turn
    if (gameMode === 'online') {
      if ((isHost && game.turn() === 'b') || (!isHost && game.turn() === 'w')) {
        return false;
      }
    }

    // Prevent moving if bot is thinking
    if (gameMode === 'bot' && game.turn() === 'b') return false; 

    const moves = game.moves({ verbose: true });
    const isPromotion = moves.some(m => m.from === sourceSquare && m.to === targetSquare && m.promotion);
    
    if (isPromotion) {
       setPendingPromotion({ from: sourceSquare, to: targetSquare, color: game.turn() });
       return false; // don't apply immediately, wait for modal
    }

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
      });

      if (move === null) return false;

      const colorThatMoved = game.turn();
      if (gameMode === 'online') {
         if (!timerActive) setTimerActive(true);
         else {
           if (colorThatMoved === 'w') setWhiteTime(t => t + 2);
           else setBlackTime(t => t + 2);
         }
      }

      setGame(gameCopy);
      setFen(gameCopy.fen());
      setHistory(gameCopy.history());
      
      checkGameOver(gameCopy);

      if (gameMode === 'online' && connection) {
        connection.send({ type: 'move', move: move.san });
      }

      if (gameMode === 'bot' && !gameCopy.isGameOver()) {
        setTimeout(() => triggerBotTurn(gameCopy), 300);
      }

      return true;
    } catch (e) {
      return false; // Invalid move
    }
  };

      const currentBoardOrientation = gameMode === 'online' && !isHost ? 'black' : 'white';

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-6 relative">
      {showAdOverlay && (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0add] backdrop-blur-sm flex flex-col items-center justify-center p-4">
           <div className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
              <h2 className="text-2xl font-bold text-amber-500 mb-6">مساحة إعلانية</h2>
              <div className="w-full bg-[#111] rounded-xl overflow-hidden border border-[#2a2a2a] min-h-[250px] flex items-center justify-center relative shadow-2xl">
                 <ins className="adsbygoogle w-full h-[250px]"
                      style={{ display: 'block' }}
                      data-ad-client="ca-pub-8216688270722962"
                      data-ad-slot="1234567890" // User can change this ad-slot
                      data-ad-format="auto"
                      data-full-width-responsive="true"></ins>
                 <div className="absolute inset-x-0 bottom-2 text-xs text-gray-500 font-mono text-center pointer-events-none">جارِ التحميل...</div>
              </div>
           </div>
           
           <div className="mb-10 w-full flex flex-col items-center gap-4 animate-fade-in text-center px-4">
              <p className="text-gray-400 font-mono text-sm max-w-xs leading-relaxed">بقاءك هنا يساعدنا على الاستمرار في تطوير اللعبة والحفاظ على محركاتها القوية مجاناً.</p>
              <div className="flex flex-col items-center mt-2">
                <span className="text-amber-500/70 font-bold mb-2">ينتهي في {adTimer}ث</span>
                {adCanSkip ? (
                   <button onClick={() => setShowAdOverlay(false)} className="bg-amber-600 hover:bg-amber-500 text-black px-10 py-3.5 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 uppercase tracking-wider text-sm flex items-center gap-2">
                       تخطي الإعلان
                       <Check size={18} />
                   </button>
                ) : (
                   <button disabled className="bg-[#222] text-gray-600 border border-[#333] px-10 py-3.5 rounded-xl cursor-not-allowed uppercase tracking-wider text-sm flex items-center gap-2 transition-all">
                       تخطي الإعلان ({adTimer - 20})
                       <Clock size={16} />
                   </button>
                )}
              </div>
           </div>
        </div>
      )}

      {/* Decorative background gradients */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {gameMode === 'menu' && (
        <div className="bg-[#161616] border border-[#2a2a2a] w-full max-w-3xl rounded-xl p-10 shadow-2xl z-10 text-center animate-fade-in-up">
          <img src="./chess_banner.png" alt="Banner" className="w-full h-48 object-cover rounded-xl shadow-xl mb-6 border border-[#2a2a2a]" />
          <h2 className="text-4xl font-extrabold text-[#e0e0e0] mb-4 tracking-tight">اللعب والتدريب</h2>
          <p className="text-gray-400 text-sm mb-10">العب ضد المحرك الأقوى في العالم، اختبر مهاراتك مع أصدقائك مباشرة، أو قم بحل ألغاز الشطرنج الممتعة!</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => { setGameMode('bot-setup'); }}
              className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-xl text-sm flex flex-col items-center justify-center shadow-lg transition-colors focus:ring-2 focus:ring-amber-500"
            >
              <img src="./chess.png" alt="Bot Mode" className="w-14 h-14 rounded-full mb-3 object-cover shadow-inner bg-black/10" />
              <div className="text-xl mb-1">ضد البوت</div>
              <div className="text-black/70 text-xs text-center px-1">محرك ذكي جداً وصعب وتتغير تكتيكاته.</div>
            </button>

            <div className="w-full p-6 bg-[#222] border border-[#2a2a2a] rounded-xl flex flex-col items-center justify-center text-center transition-colors">
              <Globe className="w-10 h-10 text-gray-400 mb-2" />
              <div className="text-lg text-white font-bold mb-1">أونلاين</div>
              
              <div className="w-full mt-4 flex flex-col items-center gap-3">
                {matchmakingState === 'idle' ? (
                   <>
                     <p className="text-xs text-gray-400 mb-2">اضغط على الزر للبحث عن خصم بشكل عشوائي للعب ضده مباشرة.</p>
                     <button 
                       onClick={startMatchmaking}
                       className="w-full bg-amber-600 hover:bg-amber-500 text-black rounded-lg px-5 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-transparent shadow-lg"
                     >
                       <Search size={18} /> البحث عن خصم
                     </button>
                   </>
                ) : matchmakingState === 'searching' ? (
                   <div className="flex flex-col items-center bg-[#111] w-full p-4 rounded-lg border border-amber-500/50">
                      <Loader2 size={32} className="animate-spin text-amber-500 mb-3" />
                      <span className="text-sm font-bold text-amber-500 mb-1">يبحث عن خصم...</span>
                      <span className="text-xs text-gray-400 mb-4">يرجى الانتظار، سيتم بدء المباراة فور دخول لاعب آخر.</span>
                      <button 
                        onClick={cancelMatchmaking}
                        className="bg-[#333] hover:bg-[#444] text-gray-300 rounded px-4 py-1.5 text-xs font-bold transition-colors border border-[#2a2a2a]"
                      >
                         إلغاء البحث
                      </button>
                   </div>
                ) : (
                   <div className="text-green-500 font-bold text-sm bg-green-900/20 w-full p-3 rounded-lg border border-green-500/30">
                      تم العثور على خصم واعداد المباراة!
                   </div>
                )}

                {statusText !== 'جاهز للعب' && statusText && matchmakingState === 'idle' && (
                   <p className="text-[10px] text-center mt-2 text-red-400 font-bold flex justify-center items-center gap-1">
                     <AlertTriangle size={12} /> {statusText}
                   </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameMode === 'bot-setup' && (
        <div className="bg-[#161616] border border-[#2a2a2a] w-full max-w-md rounded-xl p-8 shadow-2xl z-10 text-center animate-fade-in">
           <img src="./chess.png" alt="Bot Mode" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-inner bg-black/10" />
           <h2 className="text-2xl font-bold text-white mb-6">اختر مستوى الصعوبة</h2>
           <div className="flex flex-col gap-3">
             <button onClick={() => { setBotLevel('easy'); initGame(); setGameMode('bot'); }} className="bg-[#222] hover:bg-amber-500 hover:text-black text-gray-300 font-bold py-3 rounded-lg border border-[#2a2a2a] transition-all">
               سهل - مبتدىء
             </button>
             <button onClick={() => { setBotLevel('medium'); initGame(); setGameMode('bot'); }} className="bg-[#222] hover:bg-amber-500 hover:text-black text-gray-300 font-bold py-3 rounded-lg border border-[#2a2a2a] transition-all">
               متوسط - لاعب جيد
             </button>
             <button onClick={() => { setBotLevel('hard'); initGame(); setGameMode('bot'); }} className="bg-[#222] hover:bg-amber-500 hover:text-black text-gray-300 font-bold py-3 rounded-lg border border-[#2a2a2a] transition-all relative overflow-hidden">
               صعب - أستاذ دولي
               <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />
             </button>
           </div>
           <button onClick={() => setGameMode('menu')} className="mt-6 text-sm text-gray-500 hover:text-white transition-colors">
              العودة للقائمة
           </button>
        </div>
      )}

      {gameMode !== 'menu' && gameMode !== 'bot-setup' && (
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:items-start items-center relative z-10">
          
          {/* Main Board Area */}
          <div className="bg-[#111] p-4 sm:p-6 rounded-2xl border border-[#2a2a2a] shadow-2xl flex-shrink-0 w-[100vw] sm:w-[500px] md:w-[600px] overflow-hidden">
             
             {/* Header Game Info */}
             <div className="flex justify-between items-center mb-6 px-1">
                <button 
                  onClick={() => { setGameMode('menu'); connection?.close(); }} 
                  className="bg-[#222] hover:bg-[#333] border border-[#2a2a2a] px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 text-gray-400 hover:text-white"
                >
                  العودة للقائمة
                </button>
                <div className="flex items-center gap-2 bg-[#161616] px-4 py-1.5 rounded-lg border border-[#2a2a2a]">
                    <span className={cn("w-2 h-2 rounded-full", game.turn() === 'w' ? 'bg-amber-500 animate-pulse' : 'bg-gray-500 animate-pulse')}></span>
                    <span className="text-xs font-bold text-gray-300 tracking-wider">{game.turn() === 'w' ? "دور الأبيض" : "دور الأسود"}</span>
                </div>
             </div>

            <div className="relative rounded bg-[#222] border-4 border-[#222] shadow-black shadow-2xl flex flex-col" id="chessboard-container">
              
              {/* Top Player (Opponent) Info & Timer */}
              <div className={cn("flex justify-between items-center bg-[#1a1a1a] p-3 border-b border-[#2a2a2a] transition-colors", game.turn() !== currentBoardOrientation[0] ? 'bg-[#252525]' : '')}>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#333] to-[#111] rounded shadow-inner flex items-center justify-center">
                       {gameMode === 'bot' ? <Bot className="text-gray-400" /> : <User className="text-gray-400" />}
                    </div>
                    <div>
                       <div className="text-white font-bold text-sm">{gameMode === 'bot' ? 'المحرك' : 'خصم أونلاين'}</div>
                       <div className="text-[10px] text-gray-500">{currentBoardOrientation === 'white' ? 'أسود' : 'أبيض'}</div>
                    </div>
                 </div>
                 {gameMode === 'online' && (
                   <div className={cn("text-2xl font-mono font-bold px-4 py-1 rounded bg-[#111] border transition-colors flex items-center gap-2", 
                      (currentBoardOrientation === 'white' ? blackTime : whiteTime) <= 60 ? "text-red-500 border-red-900/50" : "text-amber-500 border-[#2a2a2a]"
                   )}>
                      <Hourglass size={16} className={game.turn() !== currentBoardOrientation[0] ? "animate-spin-slow" : "opacity-30"} />
                      {formatTime(currentBoardOrientation === 'white' ? blackTime : whiteTime)}
                   </div>
                 )}
              </div>

              <Chessboard
                options={{
                  position: fen,
                  onPieceDrop: onDrop,
                  onSquareClick: onSquareClick,
                  onPieceDrag: onPieceDragBegin,
                  boardOrientation: currentBoardOrientation as any,
                  darkSquareStyle: { backgroundColor: '#714e3b' },
                  lightSquareStyle: { backgroundColor: '#d4b58c' },
                  dropSquareStyle: { boxShadow: 'inset 0 0 1px 6px rgba(245, 158, 11, 0.8)' },
                  squareStyles: optionSquares,
                  animationDurationInMs: 200
                }}
              />
              
              {/* Bottom Player (You) Info & Timer */}
              <div className={cn("flex justify-between items-center bg-[#1a1a1a] p-3 border-t border-[#2a2a2a] transition-colors", game.turn() === currentBoardOrientation[0] ? 'bg-[#252525]' : '')}>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded shadow-inner flex items-center justify-center">
                       <User className="text-white" />
                    </div>
                    <div>
                       <div className="text-white font-bold text-sm">أنت</div>
                       <div className="text-[10px] text-gray-500">{currentBoardOrientation === 'white' ? 'أبيض' : 'أسود'}</div>
                    </div>
                 </div>
                 {gameMode === 'online' && (
                   <div className={cn("text-2xl font-mono font-bold px-4 py-1 rounded bg-[#111] border transition-colors flex items-center gap-2", 
                      (currentBoardOrientation === 'white' ? whiteTime : blackTime) <= 60 ? "text-red-500 border-red-900/50" : "text-amber-500 border-[#2a2a2a]"
                   )}>
                      <Hourglass size={16} className={game.turn() === currentBoardOrientation[0] ? "animate-spin-slow" : "opacity-30"} />
                      {formatTime(currentBoardOrientation === 'white' ? whiteTime : blackTime)}
                   </div>
                 )}
              </div>

              {/* Game Over Layer */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded z-20 animate-fade-in pointer-events-none">
                  <Trophy className="w-16 h-16 text-amber-500 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tighter">{gameOver}</h3>
                  <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">{history.length} حركات</p>
                </div>
              )}
              
              {/* Pending Promotion Layer */}
              {pendingPromotion && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded z-30 animate-fade-in">
                  <div className="bg-[#1a1a1a] p-6 rounded-xl border border-amber-500/30 flex flex-col items-center gap-4 text-center shadow-xl">
                     <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-2">اختر قطعة للترقية</h3>
                     <div className="flex gap-4">
                        <button onClick={() => confirmPromotion('q')} className="w-14 h-14 bg-[#222] hover:bg-amber-500 hover:text-black text-amber-500 rounded-lg flex items-center justify-center transition-colors border border-[#2a2a2a] text-2xl">♛</button>
                        <button onClick={() => confirmPromotion('r')} className="w-14 h-14 bg-[#222] hover:bg-amber-500 hover:text-black text-amber-500 rounded-lg flex items-center justify-center transition-colors border border-[#2a2a2a] text-2xl">♜</button>
                        <button onClick={() => confirmPromotion('b')} className="w-14 h-14 bg-[#222] hover:bg-amber-500 hover:text-black text-amber-500 rounded-lg flex items-center justify-center transition-colors border border-[#2a2a2a] text-2xl">♝</button>
                        <button onClick={() => confirmPromotion('n')} className="w-14 h-14 bg-[#222] hover:bg-amber-500 hover:text-black text-amber-500 rounded-lg flex items-center justify-center transition-colors border border-[#2a2a2a] text-2xl">♞</button>
                     </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Control Footer */}
            <div className="mt-4 flex justify-between items-center px-1">
                <div className="text-[11px] text-gray-500 flex items-center gap-2 font-mono uppercase tracking-wider">
                   {isBotThinking && <><Loader2 className="animate-spin w-3 h-3 text-amber-500" /> البوت يفكر...</>}
                   {!isBotThinking && statusText}
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleResign}
                    disabled={!!gameOver}
                    className="bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-500 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-colors disabled:opacity-50"
                  >
                    انسحاب
                  </button>
                  <button 
                    onClick={initGame} 
                    className="bg-transparent hover:bg-[#222] border border-[#2a2a2a] px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-2 text-gray-400 hover:text-white focus:outline-none"
                  >
                    <RefreshCw size={14} /> إعادة اللعبة
                  </button>
                </div>
            </div>
          </div>

          {/* Right Panel: Options & History */}
          <div className="flex-grow w-full max-w-md lg:w-72 flex flex-col gap-4">
             
            {gameMode === 'bot' && (
              <div className="bg-[#161616] border border-[#2a2a2a] p-5 rounded-xl shadow-xl">
                 <h2 className="text-xs uppercase text-amber-500 font-bold mb-4 tracking-tighter flex items-center gap-2">
                    <Cpu size={14} /> إعدادات المحرك
                 </h2>
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs mb-1 font-bold text-[#e0e0e0]">
                        <span>مستوى الصعوبة</span>
                    </div>
                    <div className="w-full bg-[#222] border border-[#2a2a2a] text-gray-400 text-sm py-2 px-3 rounded font-bold">
                       {botLevel === 'easy' ? 'سهل' : botLevel === 'medium' ? 'متوسط' : 'صعب'} 
                       <span className="text-[10px] ml-2 text-red-500 font-normal">(لا يمكن تغييره أثناء اللعب)</span>
                    </div>
                 </div>
              </div>
            )}

            <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl flex-1 flex flex-col overflow-hidden min-h-[300px]">
                 <div className="p-4 border-b border-[#2a2a2a] text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    سجل الحركات
                 </div>
                 <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1 font-mono text-xs" dir="ltr">
                    {history.length === 0 ? (
                        <div className="text-gray-600 text-center mt-10 h-full flex items-center justify-center font-sans" dir="rtl">
                            لا توجد حركات بعد.
                        </div>
                    ) : (
                         Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                           <div key={i} className="flex justify-between px-3 py-1 hover:bg-[#222] rounded transition-colors text-gray-300 group">
                               <span className="w-8 text-gray-600 font-bold group-hover:text-amber-500">{i + 1}.</span>
                               <span className="w-16">{history[i * 2]}</span>
                               <span className="w-16">{history[i * 2 + 1] || ''}</span>
                           </div>
                        ))
                    )}
                 </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
