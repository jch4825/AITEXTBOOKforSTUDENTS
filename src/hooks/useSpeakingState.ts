import { useSyncExternalStore } from 'react';
import { getSpeakingState, subscribeSpeaking, type SpeakingState } from '../utils/tts';

/** 지금 어떤 소리를 읽는 중인지. 듣기 단추가 자기 차례일 때 모양을 바꾸는 데 쓴다. */
export function useSpeakingState(): SpeakingState {
  return useSyncExternalStore(subscribeSpeaking, getSpeakingState, getSpeakingState);
}
