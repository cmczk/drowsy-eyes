import { COLORS } from '@/constants/theme';
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  HEADER_HEIGHT,
  MENU,
} from '@/constants/ui';
import { TagPreview } from '@/db/schema';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { DrowsyButton } from './DrowsyButton';
import { DrowsyText } from './DrowsyText';
import { DrowsyTextInput } from './DrowsyTextInput';
import { TagPlate } from './TagPlate';

type MenuPosition = {
  top: number;
  right: number;
};

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tags: TagPreview[];
  selectedTagIds: number[];
  onTagToggle: (tagId: number) => void;
  onResetFilter: () => void;
  onExportMarkdown: () => void;
  isExporting: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  tags,
  selectedTagIds,
  onTagToggle,
  onResetFilter,
  onExportMarkdown,
  isExporting,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    right: 20,
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterPosition, setFilterPosition] = useState<MenuPosition>({
    top: 0,
    right: 20,
  });

  const [searchBarOpened, setSearchBarOpened] = useState(false);

  const moreButtonRef = useRef<View>(null);
  const filterButtonRef = useRef<View>(null);

  const { width: windowWidth } = useWindowDimensions();

  const openMenu = () => {
    moreButtonRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPosition({
        top: y + height + MENU.GAP,
        right: Math.max(8, windowWidth - x - width),
      });
    });

    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const openFilter = () => {
    filterButtonRef.current?.measureInWindow((x, y, width, height) => {
      setFilterPosition({
        top: y + height + MENU.GAP,
        right: Math.max(8, windowWidth - x - width),
      });
    });

    setFilterVisible(true);
  };

  const closeFilter = () => {
    setFilterVisible(false);
  };

  const handleAboutPress = () => {
    closeMenu();
    router.push('/about');
  };

  const handleExportMarkdownPress = () => {
    closeMenu();
    onExportMarkdown();
  };

  return (
    <>
      <View style={styles.container}>
        {searchBarOpened ? (
          <View style={styles.searchBar}>
            <DrowsyTextInput
              autoFocus
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Искать"
              placeholderTextColor={COLORS.DARK.MUTED}
              maxLength={100}
            />
            <DrowsyButton
              style={styles.closeBtn}
              type="icon"
              icon="close"
              onPress={() => {
                setSearchBarOpened(false);
                setSearchQuery('');
              }}
            />
          </View>
        ) : (
          <>
            <DrowsyText type="logo">Drowsy Eyes</DrowsyText>
            <View style={styles.buttonsContainer}>
              <DrowsyButton
                type="icon"
                icon="search"
                onPress={() => {
                  setSearchBarOpened(true);
                }}
              />

              {tags.length > 0 && (
                <View ref={filterButtonRef} collapsable={false}>
                  <DrowsyButton
                    type="icon"
                    icon="filter"
                    onPress={openFilter}
                    accessibilityLabel="Фильтровать по тегам"
                    accessibilityRole="button"
                  />
                </View>
              )}

              <View ref={moreButtonRef} collapsable={false}>
                <DrowsyButton
                  type="icon"
                  icon="more"
                  onPress={openMenu}
                  accessibilityLabel="Открыть меню"
                  accessibilityRole="button"
                />
              </View>
            </View>
          </>
        )}
      </View>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeMenu}
            accessibilityLabel="Закрыть меню"
          />

          <View
            accessibilityViewIsModal
            style={[
              styles.menu,
              { top: menuPosition.top, right: menuPosition.right },
            ]}
          >
            <Pressable
              accessibilityRole="menuitem"
              onPress={() => {}}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
            >
              <DrowsyText>Настройки</DrowsyText>
            </Pressable>
            <Pressable
              accessibilityRole="menuitem"
              accessibilityState={{ disabled: isExporting }}
              disabled={isExporting}
              onPress={handleExportMarkdownPress}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
                isExporting && styles.menuItemDisabled,
              ]}
            >
              <DrowsyText>
                {isExporting ? 'Создание архива…' : 'Экспорт в Markdown'}
              </DrowsyText>
            </Pressable>
            <Pressable
              accessibilityRole="menuitem"
              onPress={handleAboutPress}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
            >
              <DrowsyText>О проекте</DrowsyText>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={filterVisible}
        animationType="fade"
        onRequestClose={closeFilter}
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeFilter}
            accessibilityLabel="Закрыть фильтр"
          />

          <View
            accessibilityViewIsModal
            style={[
              styles.menu,
              styles.filterMenu,
              {
                top: filterPosition.top,
                right: 20,
                width: windowWidth - 40,
              },
            ]}
          >
            <ScrollView
              style={styles.filterTagsScroll}
              contentContainerStyle={styles.filterTags}
              showsVerticalScrollIndicator={false}
            >
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);

                return (
                  <TagPlate
                    key={tag.id}
                    type="readonly"
                    title={tag.title}
                    color={tag.color}
                    onPress={() => onTagToggle(tag.id)}
                    style={[
                      styles.filterTag,
                      isSelected && styles.selectedFilterTag,
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                  />
                );
              })}
            </ScrollView>

            <DrowsyButton
              type="cancel"
              label="Сбросить фильтры"
              onPress={onResetFilter}
              style={styles.resetFilterButton}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    width: MENU.WIDTH,
    overflow: 'hidden',

    backgroundColor: COLORS.DARK.BG,
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.DARK.SECONDARY,
    borderRadius: BORDER_RADIUS,

    // Android
    elevation: 8,

    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  menuItem: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 16,
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.DARK.SECONDARY,
  },
  menuItemPressed: {
    backgroundColor: '#202020',
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  filterMenu: {
    padding: 12,
    gap: 12,
  },
  filterTagsScroll: {
    maxHeight: 240,
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTag: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFilterTag: {
    borderColor: COLORS.DARK.MUTED,
  },
  resetFilterButton: {
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: HEADER_HEIGHT,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    paddingLeft: 0,
    paddingRight: 54,
    borderColor: 'transparent',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
});
