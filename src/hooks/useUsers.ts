import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

interface UseUsersResult {
  users: UserProfile[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CACHE_KEY = 'cached_users_v1';
const API_URL = 'https://randomuser.me/api/?results=10&nat=us,gb,au,ca,fr,dk,fi,es,ch';

function mapToUserProfile(raw: any): UserProfile {
  return {
    id: raw.login?.uuid,
    name: `${raw.name?.first ?? ''} ${raw.name?.last ?? ''}`.trim(),
    avatar: raw.picture?.large,
    city: raw.location?.city ?? '',
    country: raw.location?.country ?? '',
    raw,
  };
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data: UserProfile[] = json.results.map(mapToUserProfile);
      setUsers(data);
      try {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to cache users', e);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch users');
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          setUsers(JSON.parse(cached));
        }
      } catch (ce) {
        console.warn('Failed reading cache', ce);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}
