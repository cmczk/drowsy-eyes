import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyText } from '@/components/DrowsyText';
import { COLORS } from '@/constants/theme';
import { useDreams } from '@/context/DreamsContext';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DreamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dreams } = useDreams();

  const dream = dreams.find((item) => item.id === Number(id));

  if (!dream) {
    return (
      <SafeAreaView style={styles.container}>
        <DrowsyText>Сновидение не найдено</DrowsyText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.btnContainer}>
        <DrowsyButton type="icon" icon="back" onPress={() => router.back()} />
        <View style={styles.editDeleteContainer}>
          <DrowsyButton type="icon" icon="edit" onPress={() => router.back()} />
          <DrowsyButton
            type="icon"
            icon="delete"
            onPress={() => router.back()}
          />
        </View>
      </View>

      <View style={styles.textContainer}>
        <DrowsyText type="heading">{dream.title}</DrowsyText>
        <DrowsyText>{dream.text}</DrowsyText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.DARK.PRIMARY,
    padding: 20,
  },
  textContainer: {
    marginTop: 12,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editDeleteContainer: {
    flexDirection: 'row',
  },
});
