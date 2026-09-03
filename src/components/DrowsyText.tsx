import { COLORS } from '@/constants/theme';
import { StyleSheet, Text, TextProps } from 'react-native';

type DrowsyTextProps = TextProps & {
  type?: 'simple' | 'logo' | 'heading';
};

export const DrowsyText: React.FC<DrowsyTextProps> = ({
  type = 'simple',
  ...props
}) => {
  return (
    <Text style={[styles.default, type === 'logo' && styles.logo]} {...props} />
  );
};

const styles = StyleSheet.create({
  default: {
    color: COLORS.DARK.TEXT,
  },
  logo: {
    fontSize: 24,
  },
});
