import { COLORS } from '@/constants/theme';
import { BORDER_RADIUS, BORDER_WIDTH, MENU } from '@/constants/ui';
import { TagPreview } from '@/db/schema';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TagPlate } from './TagPlate';

type TagDropdownProps = {
  tags: TagPreview[];
  onTagPress: (tag: TagPreview) => void;
};

export const TagDropdown: React.FC<TagDropdownProps> = ({
  tags,
  onTagPress,
}) => {
  if (tags.length === 0) return null;

  return (
    <View style={styles.dropdown}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.tags}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {tags.map((tag) => (
          <TagPlate
            key={tag.id}
            type="readonly"
            title={tag.title}
            color={tag.color}
            onPress={() => onTagPress(tag)}
            style={styles.tag}
            accessibilityRole="button"
            accessibilityLabel={`Добавить тег ${tag.title}`}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    left: 0,
    zIndex: 30,
    elevation: 8,
    marginTop: MENU.GAP,
    padding: 12,
    backgroundColor: COLORS.DARK.BG,
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.DARK.SECONDARY,
    borderRadius: BORDER_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  scroll: {
    maxHeight: 240,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    alignSelf: 'flex-start',
  },
});
