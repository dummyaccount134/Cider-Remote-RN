import { changeToIndex, fetchQueue, moveToPosition, queueItems, removeByIndex } from "@/lib/queue";
import { QueueItem } from "@/types/musickit";
import { useIsFocused } from "@react-navigation/native";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Button, Dialog, List, Portal, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Queue() {
  const isFocused = useIsFocused();
  const [queue, setQueue] = useAtom(queueItems);
  const theme = useTheme();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  function UIQueueView() {
    return (
      <View>
        <Text variant="headlineSmall" style={styles.header}>
          Up Next
        </Text>
        {queue.map((item, idx) => (
          <UIQueueItem
            key={idx}
            item={item}
            idx={idx}
            isDragged={draggedIndex === idx}
            onDragStart={() => setDraggedIndex(idx)}
            onDragEnd={() => setDraggedIndex(null)}
          />
        ))}
      </View>
    )
  }

  useEffect(() => {
    if (isFocused) {
      fetchQueue();
    }
  }, [isFocused])

  if (!isFocused) {
    return null;
  }
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView>
        {isFocused && <UIQueueView />}
      </SafeAreaView>
    </ScrollView>
  );
}

type UIQueueItemProps = {
  item: QueueItem;
  idx: number;
  isDragged?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

function UIQueueItem({ item, idx, isDragged, onDragStart, onDragEnd }: UIQueueItemProps) {
  const [queue, setQueue] = useAtom(queueItems);
  const [showActions, setShowActions] = useState(false);
  const theme = useTheme();
  const translateY = new Animated.Value(0);
  const scale = new Animated.Value(1);

  const artworkUri = useMemo(() => {
    return item.attributes.artwork?.url
      .replace("{h}", "60")
      .replace("{w}", "60");
  }, [item]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      onDragStart?.(); queueItems
      Animated.spring(scale, {
        toValue: 1.05,
        useNativeDriver: true,
      }).start();
    } else if (event.nativeEvent.state === State.END) {
      const { translationY } = event.nativeEvent;
      const itemHeight = 80; // Approximate height of each item
      const moveDistance = Math.round(translationY / itemHeight);
      const newIndex = Math.max(0, Math.min(idx + moveDistance, queue.length - 1));

      if (newIndex !== idx) {
        moveToPosition(idx, newIndex);
      }

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      onDragEnd?.();
    }
  };

  return (
    <>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            {
              transform: [{ translateY }, { scale }],
              zIndex: isDragged ? 1000 : 1,
              elevation: isDragged ? 8 : 0,
            },
            isDragged && styles.dragging,
          ]}
        >
          <List.Item
            title={item.attributes.name ?? "Untitled"}
            description={item.attributes.artistName ?? ""}
            onPress={() => {
              changeToIndex(idx);
            }}
            onLongPress={() => {
              setShowActions(true);
            }}
            left={(props) =>
              item.attributes.artwork?.url ? (
                <List.Image
                  {...props}
                  source={{ uri: artworkUri }}
                  style={styles.artwork}
                />
              ) : (
                <List.Icon {...props} icon="music" style={styles.artwork} />
              )
            }
            right={(props) => (
              <List.Icon {...props} icon="drag" style={styles.dragHandle} />
            )}
            titleStyle={styles.title}
            descriptionStyle={[styles.description, { color: theme.colors.onSurfaceVariant }]}
            style={[
              styles.listItem,
              isDragged && { backgroundColor: theme.colors.surfaceVariant }
            ]}
          />
        </Animated.View>
      </PanGestureHandler>

      <View>
        <Portal>
          <Dialog visible={showActions} onDismiss={() => setShowActions(false)}>
            <Dialog.Title>
              {item.attributes.name ?? "Untitled"}
            </Dialog.Title>
            <Dialog.Content>
              <Button
                icon="close"

                onPress={() => {
                  removeByIndex(idx);
                  setShowActions(false);
                }}>Remove From Queue</Button>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowActions(false)}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginVertical: 16,
    fontWeight: '600',
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  artwork: {
    borderRadius: 8,
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  dragging: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dragHandle: {
    opacity: 0.5,
  },
});
