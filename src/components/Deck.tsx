import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Card from './Card';
import { UserProfile, SwipeResult } from '../types';
import { saveResults, loadResults } from '../storage';

type Props = {
  users: UserProfile[];
  onAllDone: (results: { likes: number; dislikes: number }) => void;
};

export default function Deck({ users, onAllDone }: Props) {
  const [index, setIndex] = useState(0);
  const [swipes, setSwipes] = useState<SwipeResult[]>([]);

  useEffect(() => {
    (async () => {
      const saved = await loadResults();
      if (saved) {
        const likedIds = saved.liked || [];
        const dislikedIds = saved.disliked || [];
        const persisted: SwipeResult[] = [
          ...likedIds.map((id) => ({ userId: id, liked: true, at: new Date().toISOString() })),
          ...dislikedIds.map((id) => ({ userId: id, liked: false, at: new Date().toISOString() })),
        ];
        setSwipes(persisted);
        const advanced = persisted.length;
        setIndex(advanced >= users.length ? users.length : advanced);
      }
    })();
  }, [users]);

  useEffect(() => {
    if (index >= users.length && users.length > 0) {
      const likes = swipes.filter((s) => s.liked).length;
      const dislikes = swipes.filter((s) => !s.liked).length;
      onAllDone({ likes, dislikes });
    }
  }, [index, users.length, swipes, onAllDone]);

  const topUsers = useMemo(() => users.slice(index, index + 3), [users, index]);

  const handleSwipe = async (userId: string, liked: boolean) => {
    const newSwipes: SwipeResult[] = [...swipes, { userId, liked, at: new Date().toISOString() }];
    setSwipes(newSwipes);

    const likedIds = newSwipes.filter((s) => s.liked).map((s) => s.userId);
    const dislikedIds = newSwipes.filter((s) => !s.liked).map((s) => s.userId);

    await saveResults({ liked: likedIds, disliked: dislikedIds, currentIndex: index + 1 });
    setIndex((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      {topUsers.length === 0 && <Text>No more cards</Text>}
      {topUsers.map((u, i) => (
        <Card
          key={u.id}
          user={u}
          isTop={i === topUsers.length - 1}
          onSwipe={handleSwipe}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
});
