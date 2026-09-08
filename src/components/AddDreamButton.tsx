import { COLORS } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { SymbolView } from 'expo-symbols';
import light from 'expo-symbols/androidWeights/light';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AddDreamButtonProps = TouchableOpacityProps & {
  onPress: () => void;
};

export const AddDreamButton: React.FC<AddDreamButtonProps> = ({ onPress }) => {
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();

  return (
    <TouchableOpacity
      style={[
        styles.addBtn,
        {
          right: insets.right + 20,
          bottom: insets.bottom + 20,
        },
      ]}
      onPress={onPress}
      accessibilityLabel={t('accessibility.addDream')}
      accessibilityRole="button"
    >
      <SymbolView
        name={{
          ios: 'plus',
          android: 'add',
          web: 'add',
        }}
        size={28}
        tintColor={COLORS.DARK.PRIMARY}
        weight={{
          ios: 'light',
          android: light,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    padding: 10,
    height: 55,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: '50%',
    backgroundColor: COLORS.DARK.SECONDARY,
  },
});
