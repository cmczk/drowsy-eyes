import { COLORS } from '@/constants/theme';
import { BORDER_RADIUS, BORDER_WIDTH } from '@/constants/ui';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { DrowsyText } from './DrowsyText';

type DreamCardProps = TouchableOpacityProps & {
  title: string;
};

export const DreamCard: React.FC<DreamCardProps> = ({ title, ...props }) => {
  return (
    <TouchableOpacity style={styles.dreamCard} {...props}>
      <DrowsyText>{title}</DrowsyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dreamCard: {
    width: '100%',
    padding: 20,
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.DARK.SECONDARY,
    borderRadius: BORDER_RADIUS,
  },
});
