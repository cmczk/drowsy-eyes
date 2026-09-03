import { StyleSheet, View } from 'react-native';
import { DrowsyButton } from './DrowsyButton';
import { DrowsyText } from './DrowsyText';

export const Header = () => {
  return (
    <View style={styles.container}>
      <DrowsyText type="logo">Drowsy Eyes</DrowsyText>
      <View style={styles.buttonsContainer}>
        <DrowsyButton type="icon" icon="search" />
        <DrowsyButton type="icon" icon="more" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
});
