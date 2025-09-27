// src/hooks/useUsers.ts
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  login: { uuid: string };
  name?: { first?: string; last?: string };
  location?: { city?: string; country?: string };
  picture?: { large?: string };
}

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CACHE_KEY = 'swipe_deck_cached_users_v1';

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://randomuser.me/api/?results=10');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data: User[] = Array.isArray(json.results) ? json.results : [];
      setUsers(data);
      // cache
      try {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to cache users', e);
      }
    } catch (e: any) {
      // on network failure try to load cached
      setError(e?.message ?? 'Failed to fetch users');
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as User[];
          setUsers(parsed);
          setError(null); // clear error if we have fallback
        }
      } catch (err) {
        console.warn('Failed to read cached users', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
