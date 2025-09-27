import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';
import { loadResults, saveResults, clearResults } from '../storage';
import { useUsers } from '../hooks/useUsers';
import type { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserProfile } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { users, loading: loadingUsers, error, refetch } = useUsers();

  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [disliked, setDisliked] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState(true);

  const indexRef = useRef(index);
  const likedRef = useRef(liked);
  const dislikedRef = useRef(disliked);
  useEffect(() => { indexRef.current = index; }, [index]);
  useEffect(() => { likedRef.current = liked; }, [liked]);
  useEffect(() => { dislikedRef.current = disliked; }, [disliked]);

  const navigatedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await loadResults();
        if (saved) {
          setLiked(saved.liked || []);
          setDisliked(saved.disliked || []);
          setIndex(typeof saved.currentIndex === 'number' ? saved.currentIndex : 0);
        }
      } catch (e) {
        console.warn('Failed to load saved results', e);
      } finally {
        setLoadingState(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loadingUsers) {
      saveResults({ liked, disliked, currentIndex: index }).catch((e) =>
        console.warn('Failed saving results', e)
      );
    }
  }, [liked, disliked, index, loadingUsers]);

  useEffect(() => {
    if (!navigatedRef.current && users.length > 0 && index === users.length) {
      navigatedRef.current = true;
      navigation.navigate('Summary', { liked, disliked });
    }
  }, [index, users.length, liked, disliked, navigation]);

  const onSwipe = useCallback((direction: 'left' | 'right', user: UserProfile) => {
    const id = user.id;
    const newLiked = direction === 'right' ? [...likedRef.current, id] : likedRef.current;
    const newDisliked = direction === 'left' ? [...dislikedRef.current, id] : dislikedRef.current;

    if (direction === 'right') setLiked(newLiked);
    else setDisliked(newDisliked);

    setIndex((prev) => prev + 1);
  }, []);

  const restart = async () => {
    await clearResults();
    navigatedRef.current = false;
    setIndex(0);
    setLiked([]);
    setDisliked([]);
    refetch();
  };

  const undoLast = () => {
    if (index === 0) return;
    const prevIndex = index - 1;
    const prevUser = users[prevIndex];
    if (!prevUser) return;
    const id = prevUser.id;
    setLiked((prev) => prev.filter((x) => x !== id));
    setDisliked((prev) => prev.filter((x) => x !== id));
    navigatedRef.current = false;
    setIndex(prevIndex);
  };

  if (loadingUsers || loadingState) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
        <Button title="Retry" onPress={refetch} />
      </View>
    );
  }

  if (index >= users.length) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>All cards swiped!</Text>
        <Button
          title="View Summary"
          onPress={() => navigation.navigate('Summary', { liked, disliked })}
        />
        <View style={{ height: 12 }} />
        <Button title="Restart Deck" onPress={restart} />
      </View>
    );
  }

  const windowCards = users.slice(index, index + 3);

  return (
    <View style={styles.container}>
      {windowCards.map((u, i) => {
        const isTop = i === windowCards.length - 1;
        return (
          <Card
            key={u.id}
            user={u}
            isTop={isTop}
            onSwipe={(userId, liked) => onSwipe(liked ? 'right' : 'left', u)}
          />
        );
      })}

      <View style={styles.bottom}>
        <Button title="Restart Deck" onPress={restart} />
      </View>

      <TouchableOpacity style={styles.undo} onPress={undoLast}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Undo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f3f3', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  undo: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 3,
  },
});
