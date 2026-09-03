import { Dream } from '@/models/Dream';
import { FlatList, StyleSheet, View } from 'react-native';
import { DreamCard } from './DreamCard';

type DreamListProps = {
  dreams: Dream[];
};

export const DreamList: React.FC<DreamListProps> = ({ dreams }) => {
  return (
    <View>
      <FlatList
        contentContainerStyle={styles.dreamList}
        data={dreams}
        keyExtractor={(dream) =>
          `${dream.id.toString()}${Math.random().toString()}`
        }
        renderItem={({ item }) => <DreamCard title={item.title} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dreamList: {
    rowGap: 15,
  },
});
