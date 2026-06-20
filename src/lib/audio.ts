// src/lib/audio.ts

/**
 * Toca um som sutil e agradável ("Ding" duplo) usando a Web Audio API nativa do navegador.
 * Isso elimina a necessidade de carregar arquivos MP3 externos.
 */
export const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    
    // Cria dois osciladores para um som de "sino" mais rico
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Frequências para um "ding" suave (Harmonia C6 e E6)
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6

    // Envelope de volume: Ataque rápido (sutil) e fade out lento
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.0);
    osc2.stop(ctx.currentTime + 1.0);
  } catch (error) {
    console.error("Erro ao tentar tocar o som de notificação:", error);
  }
};
