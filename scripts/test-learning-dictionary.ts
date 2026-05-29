import { getKnownLearningDictionaryEntry } from '../src/utils/learningDictionary';

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const mcpEntry = getKnownLearningDictionaryEntry('MCP');

assert(mcpEntry, 'MCP should resolve to a fixed learning dictionary entry.');
assert(mcpEntry!.includes('Model Context Protocol'), 'MCP entry should explain Model Context Protocol.');
assert(mcpEntry!.includes('마이크로소프트 시험이나 자격증이 아니라'), 'MCP entry should reject the certification meaning.');
assert(!/Microsoft Certified Professional/i.test(mcpEntry!), 'MCP entry should not use the certification expansion.');

const punctuatedMcpEntry = getKnownLearningDictionaryEntry('"MCP?"');
assert(punctuatedMcpEntry === mcpEntry, 'MCP lookup should tolerate quotes and punctuation.');

const vibeCodingEntry = getKnownLearningDictionaryEntry('바이브코딩');
assert(vibeCodingEntry, 'Vibe coding should resolve to a fixed learning dictionary entry.');
assert(vibeCodingEntry!.includes('자연어'), 'Vibe coding entry should explain natural language prompting.');
assert(vibeCodingEntry!.includes('AI'), 'Vibe coding entry should be grounded in AI-assisted coding.');
assert(!vibeCodingEntry!.includes('교육용 코딩 학습 플랫폼'), 'Vibe coding entry should not describe a coding education platform.');

const spacedVibeCodingEntry = getKnownLearningDictionaryEntry('바이브 코딩');
assert(spacedVibeCodingEntry === vibeCodingEntry, 'Vibe coding lookup should tolerate spacing.');

const unknownEntry = getKnownLearningDictionaryEntry('증발');
assert(unknownEntry === null, 'Unknown words should fall through to Gemini.');

console.log('learningDictionary tests passed');
