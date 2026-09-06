import { COLORS } from '@/constants/theme';
import { BORDER_RADIUS } from '@/constants/ui';
import { SymbolView } from 'expo-symbols';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { DrowsyText } from './DrowsyText';

type TagPlateProps = TouchableOpacityProps & {
  type?: 'readonly' | 'editable';
  title: string;
  color?: string | null;
  onCrossPress?: () => void;
};

export const TagPlate: React.FC<TagPlateProps> = ({
  type = 'editable',
  title,
  color: bgColor,
  onCrossPress,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        { backgroundColor: bgColor ?? COLORS.DARK.SECONDARY },
        styles.tagPlate,
        type === 'readonly' && { paddingRight: 12, paddingLeft: 12 },
        style,
      ]}
      {...props}
    >
      <DrowsyText
        style={[
          styles.tagPreviewTxt,
          bgColor && { color: COLORS.DARK.SECONDARY },
        ]}
      >
        {title}
      </DrowsyText>
      {type === 'editable' && (
        <TouchableOpacity onPress={onCrossPress}>
          <SymbolView
            name={{
              ios: 'xmark',
              android: 'close',
              web: 'close',
            }}
            size={20}
            tintColor={bgColor ? COLORS.DARK.SECONDARY : COLORS.DARK.PRIMARY}
          ></SymbolView>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tagPlate: {
    borderRadius: BORDER_RADIUS,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 5,
    paddingLeft: 20,
    paddingRight: 5,
  },
  tagPreviewTxt: {
    color: COLORS.DARK.PRIMARY,
    fontSize: 14,
  },
});
