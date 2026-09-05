import { DreamPreview } from '@/models/dreams';
import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { DreamCard } from './DreamCard';

type DreamListProps = {
  dreams: DreamPreview[];
};

export const DreamList: React.FC<DreamListProps> = ({ dreams }) => {
  return (
    <View>
      <FlatList
        contentContainerStyle={styles.dreamList}
        data={dreams}
        keyExtractor={(dream) => `${dream.id.toString()}`}
        renderItem={({ item }) => (
          <DreamCard
            title={item.title}
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
    </View>
  );
};

const styles = StyleSheet.create({
  dreamList: {
    rowGap: 15,
  },
});
