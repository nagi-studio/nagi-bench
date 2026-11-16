import { validateVoiceCues, type Shot, type VoiceCue, type SoundCue } from "@agentbench/cinematic-player";
import { buildWorld, type FilmContext } from "./world";
import { buildShots } from "./shots";
import { voiceCues, soundCues, FILM_DURATION } from "./manifest";

export interface Film {
  context: FilmContext;
  shots: Shot<FilmContext>[];
  voiceCues: VoiceCue[];
  soundCues: SoundCue[];
  duration: number;
}

/** Build the entire film's scene graph + editorial structure (no renderer/DOM). */
export function createFilm(): Film {
  const context = buildWorld();
  const shots = buildShots(context);
  validateVoiceCues(voiceCues, FILM_DURATION);
  return { context, shots, voiceCues, soundCues, duration: FILM_DURATION };
}

export { voiceCues, soundCues, FILM_DURATION };
export type { FilmContext };