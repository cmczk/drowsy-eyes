import { COLORS } from '@/constants/theme';
import { StyleSheet, Text, TextProps } from 'react-native';

type DrowsyTextProps = TextProps & {
  type?: 'simple' | 'logo' | 'heading' | 'title';
};

export const DrowsyText: React.FC<DrowsyTextProps> = ({
  type = 'simple',
  style,
  ...props
}) => {
  return (
    <Text
      style={[
        styles.default,
        type === 'logo' && styles.logo,
        type === 'heading' && styles.heading,
        type === 'title' && styles.title,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  default: {
    color: COLORS.DARK.TEXT,
    fontSize: 16,
  },
  logo: {
    fontSize: 24,
  },
  heading: {
    fontSize: 24,
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
  },
});
