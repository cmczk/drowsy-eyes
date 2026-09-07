import { DreamPreview } from '@/db/schema';
import { router } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { DreamCard } from './DreamCard';

type DreamListProps = {
  dreams: DreamPreview[];
};

export const DreamList: React.FC<DreamListProps> = ({ dreams }) => {
  return (
    <FlatList
      style={styles.dreamList}
      contentContainerStyle={styles.dreamListContent}
      data={dreams}
      keyExtractor={(dream) => `${dream.id.toString()}`}
      renderItem={({ item }) => (
        <DreamCard
          title={item.title}
          shortText={
            item.text.length > 100
              ? `${item.text.slice(0, 100).trimEnd()}…`
              : item.text
          }
          tags={item.tags}
          onPress={() =>
            router.push({
              pathname: '/dreams/[id]',
              params: {
                id: item.id.toString(),
              },
            })
          }
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  dreamList: {
    flex: 1,
  },
  dreamListContent: {
    rowGap: 15,
    paddingBottom: 75,
  },
});
