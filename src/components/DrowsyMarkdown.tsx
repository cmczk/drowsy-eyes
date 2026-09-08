import { COLORS } from '@/constants/theme';
import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown, { useMarkdown } from 'react-native-marked';

type DrowsyMarkdownProps = {
  value: string;
  variant?: 'document' | 'preview';
};

const markdownTheme = {
  colors: {
    text: COLORS.DARK.TEXT,
    link: '#58A6FF',
    code: '#161B22',
    border: COLORS.DARK.MUTED,
  },
};

const documentMarkdownStyles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  li: {
    fontSize: 16,
    lineHeight: 24,
  },
  paragraph: {
    paddingVertical: 6,
  },
});

const previewMarkdownStyles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: undefined,
  },
  li: {
    fontSize: 16,
    lineHeight: undefined,
  },
  em: {
    lineHeight: undefined,
  },
  strong: {
    lineHeight: undefined,
  },
  strikethrough: {
    lineHeight: undefined,
  },
  link: {
    lineHeight: undefined,
  },
  codespan: {
    lineHeight: undefined,
  },
  paragraph: {
    paddingVertical: 0,
  },
});

const DrowsyMarkdownPreview: React.FC<Pick<DrowsyMarkdownProps, 'value'>> = ({
  value,
}) => {
  const elements = useMarkdown(value, {
    colorScheme: 'dark',
    theme: markdownTheme,
    styles: previewMarkdownStyles,
  });

  return (
    <View pointerEvents="none">
      {elements.map((element, index) => (
        <Fragment key={index}>{element}</Fragment>
      ))}
    </View>
  );
};

export const DrowsyMarkdown: React.FC<DrowsyMarkdownProps> = ({
  value,
  variant = 'document',
}) => {
  if (variant === 'preview') {
    return <DrowsyMarkdownPreview value={value} />;
  }

  return (
    <Markdown
      value={value}
      theme={markdownTheme}
      styles={documentMarkdownStyles}
      flatListProps={{
        style: styles.document,
        contentContainerStyle: styles.documentContent,
        showsVerticalScrollIndicator: false,
      }}
    />
  );
};

const styles = StyleSheet.create({
  document: {
    flex: 1,
  },
  documentContent: {
    paddingBottom: 20,
  },
});
