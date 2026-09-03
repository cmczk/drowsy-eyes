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
} as const;

type DrowsyIcon = keyof typeof ICONS;

type DrowsyButtonProps = TouchableOpacityProps & {
  type: 'default' | 'icon';
  label?: string;
  icon?: DrowsyIcon;
};

export const DrowsyButton: React.FC<DrowsyButtonProps> = ({
  type,
  label,
  icon,
  ...props
}) => {
  return (
    <TouchableOpacity style={[type === 'icon' && styles.icon]} {...props}>
      {label && <DrowsyText>{label}</DrowsyText>}

      {icon && (
        <SymbolView name={ICONS[icon]} size={24} tintColor={COLORS.DARK.TEXT} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 44,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
