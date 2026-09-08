export const en = {
  common: {
    actions: {
      cancel: 'Cancel',
      continue: 'Continue',
      save: 'Save',
      update: 'Update',
    },
    error: 'Error',
    loading: 'Loading',
  },
  database: {
    migrationError: 'Failed to prepare the database: %{message}',
  },
  home: {
    loadError: "Couldn't load dreams.",
    noResults: 'Nothing found.',
    empty: 'Add your first dream',
    export: {
      empty: 'There are no entries to export',
      successTitle: 'Archive saved',
      successMessage: '%{fileName} was saved to the selected folder.',
      error: "Couldn't save the archive",
    },
  },
  header: {
    searchPlaceholder: 'Search',
    settings: 'Settings',
    creatingArchive: 'Creating archive…',
    exportMarkdown: 'Export to Markdown',
    about: 'About',
    resetFilters: 'Reset filters',
  },
  dream: {
    loadError: "Couldn't load the dream.",
    notFound: 'Dream not found',
    form: {
      titlePlaceholder: 'Title',
      tagsPlaceholder: 'Tags',
      textPlaceholder: 'What did you dream about?',
    },
    create: {
      saveError: "Couldn't save the dream.",
      confirmTitle: 'Save dream?',
      confirmMessage:
        'If you leave without saving, the text you entered will be lost.',
      discard: "Don't save",
    },
    edit: {
      updateError: "Couldn't update the dream.",
      confirmTitle: 'Save changes?',
      confirmMessage:
        'If you leave without saving, the edited text will be lost.',
      discard: "Don't update",
    },
    delete: {
      confirmTitle: 'Delete dream?',
      confirmMessage: 'Your dream will be deleted permanently.',
      action: 'Delete',
      error: "Couldn't delete the dream.",
    },
  },
  about: {
    title: 'About',
    description: 'Drowsy Eyes — ...',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    saveError: "Couldn't save the language choice.",
    languages: {
      ru: 'Русский',
      en: 'English',
    },
  },
  accessibility: {
    addDream: 'Add dream',
    addTag: 'Add tag %{title}',
    back: 'Go back',
    closeFilter: 'Close filter',
    closeMenu: 'Close menu',
    closeSearch: 'Close search',
    deleteDream: 'Delete dream',
    editDream: 'Edit dream',
    filterTags: 'Filter by tags',
    filterTagsSelected: 'Filter by tags, selected: %{count}',
    openMenu: 'Open menu',
    removeTag: 'Remove tag %{title}',
    search: 'Search dreams',
    selectTagColor: 'Select tag color %{index}',
  },
} as const;

type TranslationShape<T> = {
  [Key in keyof T]: T[Key] extends string ? string : TranslationShape<T[Key]>;
};

export const ru: TranslationShape<typeof en> = {
  common: {
    actions: {
      cancel: 'Отмена',
      continue: 'Продолжить',
      save: 'Сохранить',
      update: 'Обновить',
    },
    error: 'Ошибка',
    loading: 'Загрузка',
  },
  database: {
    migrationError: 'Не удалось подготовить базу данных: %{message}',
  },
  home: {
    loadError: 'Не удалось загрузить сновидения.',
    noResults: 'Ничего не нашлось.',
    empty: 'Добавь первое сновидение',
    export: {
      empty: 'Нет записей для экспорта',
      successTitle: 'Архив сохранён',
      successMessage: '%{fileName} сохранён в выбранную папку.',
      error: 'Не удалось сохранить архив',
    },
  },
  header: {
    searchPlaceholder: 'Искать',
    settings: 'Настройки',
    creatingArchive: 'Создание архива…',
    exportMarkdown: 'Экспорт в Markdown',
    about: 'О проекте',
    resetFilters: 'Сбросить фильтры',
  },
  dream: {
    loadError: 'Не удалось загрузить сновидение.',
    notFound: 'Сновидение не найдено',
    form: {
      titlePlaceholder: 'Название',
      tagsPlaceholder: 'Теги',
      textPlaceholder: 'Что тебе снилось?',
    },
    create: {
      saveError: 'Не удалось сохранить сновидение.',
      confirmTitle: 'Сохранить сновидение?',
      confirmMessage:
        'Если выйти без сохранения, введённый текст будет потерян.',
      discard: 'Не сохранять',
    },
    edit: {
      updateError: 'Не удалось обновить сновидение.',
      confirmTitle: 'Сохранить изменения?',
      confirmMessage:
        'Если выйти без сохранения, отредактированный текст будет потерян.',
      discard: 'Не обновлять',
    },
    delete: {
      confirmTitle: 'Удалить сновидение?',
      confirmMessage: 'Ваше сновидение будет удалено навсегда.',
      action: 'Удалить',
      error: 'Не удалось удалить сновидение.',
    },
  },
  about: {
    title: 'О проекте',
    description: 'Drowsy Eyes — ...',
  },
  settings: {
    title: 'Настройки',
    language: 'Язык',
    saveError: 'Не удалось сохранить выбор языка.',
    languages: {
      ru: 'Русский',
      en: 'English',
    },
  },
  accessibility: {
    addDream: 'Добавить сновидение',
    addTag: 'Добавить тег %{title}',
    back: 'Вернуться назад',
    closeFilter: 'Закрыть фильтр',
    closeMenu: 'Закрыть меню',
    closeSearch: 'Закрыть поиск',
    deleteDream: 'Удалить сновидение',
    editDream: 'Редактировать сновидение',
    filterTags: 'Фильтровать по тегам',
    filterTagsSelected: 'Фильтровать по тегам, выбрано: %{count}',
    openMenu: 'Открыть меню',
    removeTag: 'Удалить тег %{title}',
    search: 'Искать сновидения',
    selectTagColor: 'Выбрать цвет тега %{index}',
  },
};

export const translations = { en, ru };
