import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredResult {
  liked: string[];
  disliked: string[];
  currentIndex: number;
}

const STORAGE_KEY = 'swipedeck_results_v1';

export async function saveResults(results: StoredResult) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch (e) {
    console.error('Failed to save results', e);
  }
}

export async function loadResults(): Promise<StoredResult | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredResult) : null;
  } catch (e) {
    console.error('Failed to load results', e);
    return null;
  }
}

export async function clearResults() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear results', e);
  }
}
