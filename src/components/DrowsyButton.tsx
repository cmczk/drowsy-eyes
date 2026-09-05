import { COLORS } from '@/constants/theme';
import { SymbolView } from 'expo-symbols';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { DrowsyText } from './DrowsyText';

const ICONS = {
  search: {
    ios: 'magnifyingglass',
    android: 'search',
    web: 'search',
  },
  more: {
    ios: 'ellipsis',
    android: 'more_vert',
    web: 'more_vert',
  },
  back: {
    ios: 'chevron.left',
    android: 'arrow_back',
    web: 'arrow_back',
  },
  close: {
    ios: 'xmark',
    android: 'close',
    web: 'close',
  },
  edit: {
    ios: 'pencil',
    android: 'edit',
    web: 'edit',
  },
  delete: {
    ios: 'trash',
    android: 'delete',
    web: 'delete',
  },
} as const;

type DrowsyIcon = keyof typeof ICONS;

type DrowsyButtonProps = TouchableOpacityProps & {
  type: 'default' | 'cancel' | 'icon';
  label?: string;
  icon?: DrowsyIcon;
};

export const DrowsyButton: React.FC<DrowsyButtonProps> = ({
  type,
  label,
  icon,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        type === 'default' && styles.base,
        type === 'icon' && styles.icon,
        type === 'cancel' && styles.cancel,
        icon === 'back' && styles.back,
        style,
      ]}
      {...props}
    >
      {label && (
        <DrowsyText
          style={[styles.text, type === 'cancel' && styles.cancelText]}
        >
          {label}
        </DrowsyText>
      )}

      {icon && (
        <SymbolView name={ICONS[icon]} size={24} tintColor={COLORS.DARK.TEXT} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.DARK.SECONDARY,
    borderRadius: 18,
    padding: 10,
  },
  text: {
    color: COLORS.DARK.PRIMARY,
  },
  cancel: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.DARK.SECONDARY,
    borderRadius: 18,
    padding: 10,
  },
  cancelText: {
    color: COLORS.DARK.SECONDARY,
  },
  icon: {
    width: 44,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  back: {
    alignItems: 'flex-start',
  },
});
