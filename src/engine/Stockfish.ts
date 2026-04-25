import { useState, useEffect } from 'react';

type EngineMessage = { type: 'bestmove', move: string } | { type: 'evaluation', pv: string };

export class ChessEngine {
  private worker: Worker | null = null;
  private onMessage: (msg: any) => void = () => {};
  private ready = false;

  constructor() {}

  async init() {
    if (this.worker) return;
    try {
      const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');
      const text = await response.text();
      const blob = new Blob([text], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
      
      this.worker.onmessage = (e) => {
        const line = e.data;
        if (line === 'uciok') {
          this.ready = true;
        } else if (line.startsWith('bestmove')) {
          const move = line.split(' ')[1];
          this.onMessage({ type: 'bestmove', move });
        }
      };

      this.worker.postMessage('uci');
      this.worker.postMessage('isready');
    } catch (e) {
      console.error('Failed to load Stockfish', e);
    }
  }

  isReady() {
    return this.ready;
  }

  setCallback(cb: (msg: any) => void) {
    this.onMessage = cb;
  }

  evaluatePosition(fen: string, depth: number, skill: number = 20) {
    if (!this.worker) return;
    
    // Set skill level (0 to 20)
    // Sometimes modifying Contempt or MultiPV makes it play different styles
    this.worker.postMessage(`setoption name Skill Level value ${skill}`);
    
    // Add some variety to the engine moves based on skill
    if (skill < 10) {
      this.worker.postMessage(`setoption name MultiPV value 3`);
    } else {
      this.worker.postMessage(`setoption name MultiPV value 1`);
    }

    this.worker.postMessage(`position fen ${fen}`);
    this.worker.postMessage(`go depth ${depth}`);
  }

  stop() {
    this.worker?.postMessage('stop');
  }

  quit() {
    this.worker?.postMessage('quit');
    this.worker?.terminate();
  }
}
