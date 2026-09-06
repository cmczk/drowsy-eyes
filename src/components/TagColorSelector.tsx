import { COLORS } from '@/constants/theme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const COLOR_SIZE = 32;
const GAP = 5;
const PADDING = 8;

type TagColorSelectorProps = {
  onColorSelect: (color: string) => void;
};

export const TagColorSelector: React.FC<TagColorSelectorProps> = ({
  onColorSelect,
}) => {
  return (
    <View
      style={styles.palette}
      onTouchStart={(event) => event.stopPropagation()}
    >
      {COLORS.TAGS.map((tagColor) => (
        <TouchableOpacity
          key={tagColor}
          style={[styles.selectColorButton, { backgroundColor: tagColor }]}
          onPress={() => onColorSelect(tagColor)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  palette: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 20,
    elevation: 8,
    marginTop: 6,
    borderRadius: 12,
    gap: GAP,
    padding: PADDING,
  },

  selectColorButton: {
    height: COLOR_SIZE,
    aspectRatio: 1,
    borderRadius: COLOR_SIZE / 2,
  },
});
