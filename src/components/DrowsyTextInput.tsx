import { COLORS } from '@/constants/theme';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

type DrowsyTextInputPropd = TextInputProps & {
  type?: 'oneline' | 'multiline';
};

export const DrowsyTextInput: React.FC<DrowsyTextInputPropd> = ({
  type = 'oneline',
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[
        type === 'oneline' && styles.oneline,
        type === 'multiline' && styles.multiline,
        style,
      ]}
      multiline={type === 'multiline'}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  oneline: {
    padding: 14,
    color: COLORS.DARK.TEXT,
    borderBottomWidth: 1,
    borderColor: '#777',
    fontSize: 18,
  },
  multiline: {
    flex: 1,
    padding: 14,
    color: COLORS.DARK.TEXT,
    fontSize: 16,
  },
});
