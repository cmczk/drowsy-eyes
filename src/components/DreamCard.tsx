import { COLORS } from '@/constants/theme';
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
    borderWidth: 1,
    borderColor: COLORS.DARK.SECONDARY,
    borderRadius: 12,
  },
});
