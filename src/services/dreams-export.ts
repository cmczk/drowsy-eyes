import { getDreams } from '@/db/dreams-repository';
import { DreamPreview } from '@/db/schema';
import { Directory } from 'expo-file-system';
import JSZip from 'jszip';

const ARCHIVE_MIME_TYPE = 'application/zip';
const DIRECTORY_PICKER_CANCELLATION_CODES = new Set([
  'ERR_PICKER_CANCELLED',
  'ERR_FILE_PICKING_CANCELLED',
]);
const INVALID_FILE_NAME_CHARACTERS = /[<>:"/\\|?*\u0000-\u001f]/g;
const RESERVED_WINDOWS_FILE_NAME =
  /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i;
const MAX_FILE_NAME_STEM_LENGTH = 120;

export type ExportDreamsResult =
  | { status: 'empty' }
  | { status: 'cancelled' }
  | { status: 'exported'; count: number; fileName: string };

function serializeYamlString(value: string) {
  return JSON.stringify(value);
}

export function dreamToMarkdown(dream: DreamPreview) {
  const sortedTags = [...dream.tags].sort((firstTag, secondTag) =>
    firstTag.title.localeCompare(secondTag.title),
  );

  const tagsMetadata =
    sortedTags.length === 0
      ? 'tags: []'
      : [
          'tags:',
          ...sortedTags.map(
            (tag) => `  - ${serializeYamlString(tag.title)}`,
          ),
        ].join('\n');

  return [
    '---',
    `created_at: ${serializeYamlString(dream.createdAt.toISOString())}`,
    tagsMetadata,
    '---',
    '',
    dream.text,
  ].join('\n');
}

function truncateFileNameStem(stem: string) {
  return Array.from(stem).slice(0, MAX_FILE_NAME_STEM_LENGTH).join('');
}

function sanitizeFileNameStem(title: string, dreamId: number) {
  let stem = title
    .normalize('NFC')
    .replace(INVALID_FILE_NAME_CHARACTERS, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[. ]+$/g, '');

  stem = truncateFileNameStem(stem).replace(/[. ]+$/g, '');

  if (!stem) return `dream-${dreamId}`;

  if (RESERVED_WINDOWS_FILE_NAME.test(stem)) {
    return `_${stem}`;
  }

  return stem;
}

export function createUniqueMarkdownFileName(
  title: string,
  dreamId: number,
  usedFileNames: Set<string>,
) {
  const stem = sanitizeFileNameStem(title, dreamId);
  let candidate = `${stem}.md`;
  let collisionIndex = 1;

  while (usedFileNames.has(candidate.toLowerCase())) {
    const suffix =
      collisionIndex === 1
        ? ` (${dreamId})`
        : ` (${dreamId}-${collisionIndex})`;

    candidate = `${truncateFileNameStem(stem)}${suffix}.md`;
    collisionIndex += 1;
  }

  usedFileNames.add(candidate.toLowerCase());

  return candidate;
}

function createArchiveName() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  return `drowsy-eyes-${timestamp}.zip`;
}

function isDirectoryPickerCancellation(error: unknown) {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  return (
    typeof error.code === 'string' &&
    DIRECTORY_PICKER_CANCELLATION_CODES.has(error.code)
  );
}

async function pickDestinationDirectory() {
  try {
    return await Directory.pickDirectoryAsync();
  } catch (error) {
    if (isDirectoryPickerCancellation(error)) return null;

    throw error;
  }
}

export async function exportDreamsToMarkdown(): Promise<ExportDreamsResult> {
  const dreams = await getDreams();

  if (dreams.length === 0) return { status: 'empty' };

  const destinationDirectory = await pickDestinationDirectory();

  if (!destinationDirectory) return { status: 'cancelled' };

  const zip = new JSZip();
  const usedFileNames = new Set<string>();

  dreams.forEach((dream) => {
    zip.file(
      createUniqueMarkdownFileName(dream.title, dream.id, usedFileNames),
      dreamToMarkdown(dream),
      { date: dream.createdAt },
    );
  });

  const archiveName = createArchiveName();
  const archiveBytes = await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const archiveFile = destinationDirectory.createFile(
    archiveName,
    ARCHIVE_MIME_TYPE,
  );
  archiveFile.write(archiveBytes);

  return {
    status: 'exported',
    count: dreams.length,
    fileName: archiveName,
  };
}
