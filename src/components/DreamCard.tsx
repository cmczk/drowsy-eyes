import { COLORS } from '@/constants/theme';
import { BORDER_RADIUS, BORDER_WIDTH } from '@/constants/ui';
import { TagPreview } from '@/db/schema';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { DrowsyText } from './DrowsyText';
import { TagPlate } from './TagPlate';

type DreamCardProps = TouchableOpacityProps & {
  title: string;
  tags: TagPreview[];
};

export const DreamCard: React.FC<DreamCardProps> = ({
  title,
  tags,
  ...props
}) => {
  return (
    <TouchableOpacity style={styles.dreamCard} {...props}>
      <DrowsyText type="title">{title}</DrowsyText>
      <View style={styles.platesList}>
        {tags.map((tag) => {
          return (
            <TagPlate
              style={styles.tagPlate}
              type="readonly"
              title={tag.title}
              color={tag.color}
            />
          );
        })}
      </View>
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
    gap: 16,
  },
  platesList: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  tagPlate: {
    alignSelf: 'flex-start',
  },
});
