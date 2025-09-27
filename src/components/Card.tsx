import React, { useRef, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Image,
  Dimensions,
} from 'react-native';
import { UserProfile } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 200;

interface Props {
  user: UserProfile;
  onSwipe: (userId: string, liked: boolean) => void;
  isTop?: boolean;
}

export default function Card({ user, onSwipe, isTop = false }: Props) {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const isTopRef = useRef(isTop);

  useEffect(() => { isTopRef.current = isTop; }, [isTop]);
  useEffect(() => { position.setValue({ x: 0, y: 0 }); }, [user.id]);

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => onSwipe(user.id, direction === 'right'));
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !!isTopRef.current,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-25deg', '0deg', '25deg'],
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.25, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const animatedCardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  return (
    <Animated.View
      style={[styles.card, animatedCardStyle]}
      {...(isTop ? panResponder.panHandlers : {})}
      pointerEvents={isTop ? 'auto' : 'none'}
    >
      <Animated.Text style={[styles.likeLabel, { opacity: likeOpacity }]}>
        👍 Like
      </Animated.Text>
      <Animated.Text style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
        👎 Nope
      </Animated.Text>

      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.location}>
        {user.city}, {user.country}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '88%',
    left: '6%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  location: { fontSize: 14, color: '#666' },
  likeLabel: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
  },
  nopeLabel: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: 'red',
  },
});
