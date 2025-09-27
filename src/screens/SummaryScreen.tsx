import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
  useNavigation,
  useRoute,
  CommonActions,
  RouteProp,
} from '@react-navigation/native';
import { clearResults } from '../storage';
import type { RootStackParamList } from '../../App';

export default function SummaryScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'Summary'>>();

  const liked = route.params?.liked ?? [];
  const disliked = route.params?.disliked ?? [];

  const restart = async () => {
    await clearResults();
    nav.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summary</Text>
      <Text style={styles.stat}>👍 Likes: {liked.length}</Text>
      <Text style={styles.stat}>👎 Dislikes: {disliked.length}</Text>
      <View style={{ marginTop: 20 }}>
        <Button title="Restart Deck" onPress={restart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  stat: { fontSize: 18, marginTop: 6 },
});
