import { useEffect, useState } from 'react';
import {
  getResourceFavorites,
  getToolFavorites,
  saveResourceFavorites,
  saveToolFavorites,
} from '../services/storage';

const READERS = {
  resource: getResourceFavorites,
  tool: getToolFavorites,
} as const;

const WRITERS = {
  resource: saveResourceFavorites,
  tool: saveToolFavorites,
} as const;

export function useFavoritesList(kind: 'resource' | 'tool') {
  const [favorites, setFavorites] = useState<string[]>(() => READERS[kind]());

  useEffect(() => {
    WRITERS[kind](favorites);
  }, [kind, favorites]);

  const toggle = (id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  return { favorites, toggle };
}
