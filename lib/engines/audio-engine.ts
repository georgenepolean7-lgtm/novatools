export interface AudioEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function calculateAudioBitrateSize(
  durationSeconds: number,
  sampleRate: number = 44100,
  bitDepth: number = 16,
  channels: number = 2
): AudioEngineResult {
  if (durationSeconds <= 0) {
    return { success: false, output: "", error: "Duration must be greater than 0." };
  }

  // Uncompressed PCM formula: sampleRate * (bitDepth / 8) * channels * duration
  const pcmBytes = sampleRate * (bitDepth / 8) * channels * durationSeconds;
  const pcmMb = (pcmBytes / (1024 * 1024)).toFixed(2);

  // Compressed estimates
  const mp3_320kbps_Mb = ((320 * 1000 * durationSeconds) / (8 * 1024 * 1024)).toFixed(2);
  const mp3_128kbps_Mb = ((128 * 1000 * durationSeconds) / (8 * 1024 * 1024)).toFixed(2);
  const aac_256kbps_Mb = ((256 * 1000 * durationSeconds) / (8 * 1024 * 1024)).toFixed(2);

  const durationMin = (durationSeconds / 60).toFixed(1);

  return {
    success: true,
    output: `Uncompressed WAV: ${pcmMb} MB | MP3 (320kbps): ${mp3_320kbps_Mb} MB`,
    breakdown: {
      "Audio Duration": `${durationSeconds} sec (~${durationMin} min)`,
      "Sample Rate & Depth": `${sampleRate / 1000} kHz, ${bitDepth}-bit (${channels === 2 ? "Stereo" : "Mono"})`,
      "Uncompressed WAV / PCM Size": `${pcmMb} MB (${pcmBytes.toLocaleString()} bytes)`,
      "High Quality MP3 (320 kbps)": `${mp3_320kbps_Mb} MB`,
      "Standard MP3 (128 kbps)": `${mp3_128kbps_Mb} MB`,
      "Apple AAC (256 kbps)": `${aac_256kbps_Mb} MB`,
    },
  };
}

export function convertAudioDurationToSamples(durationSeconds: number): AudioEngineResult {
  if (durationSeconds <= 0) {
    return { success: false, output: "", error: "Duration must be positive." };
  }

  const samples44k = Math.round(durationSeconds * 44100);
  const samples48k = Math.round(durationSeconds * 48000);
  const samples96k = Math.round(durationSeconds * 96000);

  const frames24fps = (durationSeconds * 24).toFixed(1);
  const frames30fps = (durationSeconds * 30).toFixed(1);
  const frames60fps = (durationSeconds * 60).toFixed(1);

  return {
    success: true,
    output: `44.1 kHz: ${samples44k.toLocaleString()} samples | 48 kHz: ${samples48k.toLocaleString()} samples`,
    breakdown: {
      "CD Audio (44.1 kHz)": `${samples44k.toLocaleString()} Samples`,
      "Video Standard (48.0 kHz)": `${samples48k.toLocaleString()} Samples`,
      "Studio Hi-Res (96.0 kHz)": `${samples96k.toLocaleString()} Samples`,
      "Film Video (24 FPS Frames)": `${frames24fps} Frames`,
      "NTSC Video (30 FPS Frames)": `${frames30fps} Frames`,
      "60 FPS Video Frames": `${frames60fps} Frames`,
    },
  };
}

export function calculateBpmDelayTimes(bpm: number): AudioEngineResult {
  if (bpm <= 20 || bpm > 400) {
    return { success: false, output: "", error: "Please enter a realistic tempo between 20 and 400 BPM." };
  }

  // 1 beat = 60,000 / BPM (ms)
  const quarterNoteMs = 60000 / bpm;
  const halfNoteMs = quarterNoteMs * 2;
  const eighthNoteMs = quarterNoteMs / 2;
  const sixteenthNoteMs = quarterNoteMs / 4;
  const triplet8thMs = (quarterNoteMs * 2) / 3;
  const dotted8thMs = eighthNoteMs * 1.5;

  const lfoHz = (bpm / 60).toFixed(2);

  return {
    success: true,
    output: `Quarter Note (1/4): ${quarterNoteMs.toFixed(1)} ms | 8th Note (1/8): ${eighthNoteMs.toFixed(1)} ms`,
    breakdown: {
      "Tempo (BPM)": `${bpm} BPM`,
      "Quarter Note (1/4 Beat)": `${quarterNoteMs.toFixed(1)} ms`,
      "Eighth Note (1/8 Beat)": `${eighthNoteMs.toFixed(1)} ms`,
      "Sixteenth Note (1/16 Beat)": `${sixteenthNoteMs.toFixed(1)} ms`,
      "Dotted 8th Note (1/8d)": `${dotted8thMs.toFixed(1)} ms`,
      "Triplet 8th Note (1/8t)": `${triplet8thMs.toFixed(1)} ms`,
      "Half Note (1/2 Beat)": `${halfNoteMs.toFixed(1)} ms`,
      "LFO Frequency (1/4 Note)": `${lfoHz} Hz`,
    },
  };
}
