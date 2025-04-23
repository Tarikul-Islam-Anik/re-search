import type { Editor } from '@tiptap/react';
import type { MinimalTiptapProps } from './index';

type ShortcutKeyResult = {
  symbol: string;
  readable: string;
};

export type FileError = {
  file: File | string;
  reason: 'type' | 'size' | 'invalidBase64' | 'base64NotAllowed';
};

export type FileValidationOptions = {
  allowedMimeTypes: string[];
  maxFileSize?: number;
  allowBase64: boolean;
};

type FileInput = File | { src: string | File; alt?: string; title?: string };

// Define regex patterns at the top level to improve performance
const DATA_IMAGE_BASE64_PATTERN = /^data:image\/[a-z]+;base64,/;
const URL_PROTOCOL_PATTERN = /^(\/|#|mailto:|sms:|fax:|tel:)/;
const BASE64_MIME_TYPE_PATTERN = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/;
const DATA_URL_BASE64_PATTERN = /^data:[^;]+;base64,(.+)$/;

export const isClient = (): boolean => typeof window !== 'undefined';
export const isServer = (): boolean => !isClient();
export const isMacOS = (): boolean =>
  isClient() && window.navigator.platform === 'MacIntel';

const shortcutKeyMap: Record<string, ShortcutKeyResult> = {
  mod: isMacOS()
    ? { symbol: '⌘', readable: 'Command' }
    : { symbol: 'Ctrl', readable: 'Control' },
  alt: isMacOS()
    ? { symbol: '⌥', readable: 'Option' }
    : { symbol: 'Alt', readable: 'Alt' },
  shift: { symbol: '⇧', readable: 'Shift' },
};

export const getShortcutKey = (key: string): ShortcutKeyResult =>
  shortcutKeyMap[key.toLowerCase()] || { symbol: key, readable: key };

export const getShortcutKeys = (keys: string[]): ShortcutKeyResult[] =>
  keys.map(getShortcutKey);

export const getOutput = (
  editor: Editor,
  format: MinimalTiptapProps['output']
): object | string => {
  switch (format) {
    case 'json':
      return editor.getJSON();
    case 'html':
      return editor.isEmpty ? '' : editor.getHTML();
    default:
      return editor.getText();
  }
};

export const isUrl = (
  text: string,
  options: { requireHostname: boolean; allowBase64?: boolean } = {
    requireHostname: false,
  }
): boolean => {
  if (text.includes('\n')) {
    return false;
  }

  try {
    const url = new URL(text);
    const blockedProtocols = [
      'javascript:',
      'file:',
      'vbscript:',
      ...(options.allowBase64 ? [] : ['data:']),
    ];

    if (blockedProtocols.includes(url.protocol)) {
      return false;
    }
    if (options.allowBase64 && url.protocol === 'data:') {
      return DATA_IMAGE_BASE64_PATTERN.test(text);
    }
    if (url.hostname) {
      return true;
    }

    return (
      url.protocol !== '' &&
      (url.pathname.startsWith('//') || url.pathname.startsWith('http')) &&
      !options.requireHostname
    );
  } catch {
    return false;
  }
};

export const sanitizeUrl = (
  url: string | null | undefined,
  options: { allowBase64?: boolean } = {}
): string | undefined => {
  if (!url) {
    return undefined;
  }

  if (options.allowBase64 && url.startsWith('data:image')) {
    return isUrl(url, { requireHostname: false, allowBase64: true })
      ? url
      : undefined;
  }

  return isUrl(url, {
    requireHostname: false,
    allowBase64: options.allowBase64,
  }) || URL_PROTOCOL_PATTERN.test(url)
    ? url
    : `https://${url}`;
};

export const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert Blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const randomId = (): string => Math.random().toString(36).slice(2, 11);

export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert File to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const validateFileOrBase64 = <T extends FileInput>(
  input: File | string,
  options: FileValidationOptions,
  originalFile: T,
  validFiles: T[],
  errors: FileError[]
): void => {
  const { isValidType, isValidSize } = checkTypeAndSize(input, options);

  if (isValidType && isValidSize) {
    validFiles.push(originalFile);
  } else {
    if (!isValidType) {
      errors.push({ file: input, reason: 'type' });
    }
    if (!isValidSize) {
      errors.push({ file: input, reason: 'size' });
    }
  }
};

const checkTypeAndSize = (
  input: File | string,
  { allowedMimeTypes, maxFileSize }: FileValidationOptions
): { isValidType: boolean; isValidSize: boolean } => {
  const mimeType = input instanceof File ? input.type : base64MimeType(input);
  const size =
    input instanceof File ? input.size : atob(input.split(',')[1]).length;

  const isValidType =
    allowedMimeTypes.length === 0 ||
    allowedMimeTypes.includes(mimeType) ||
    allowedMimeTypes.includes(`${mimeType.split('/')[0]}/*`);

  const isValidSize = !maxFileSize || size <= maxFileSize;

  return { isValidType, isValidSize };
};

const base64MimeType = (encoded: string): string => {
  const result = encoded.match(BASE64_MIME_TYPE_PATTERN);
  return result && result.length > 1 ? result[1] : 'unknown';
};

const isBase64 = (str: string): boolean => {
  if (str.startsWith('data:')) {
    const matches = str.match(DATA_URL_BASE64_PATTERN);
    if (matches?.[1]) {
      const extractedBase64 = matches[1];
      try {
        return btoa(atob(extractedBase64)) === extractedBase64;
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }

  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};

const processStringFile = <T extends FileInput>(
  actualFile: string,
  file: T,
  options: FileValidationOptions,
  validFiles: T[],
  errors: FileError[]
): void => {
  if (isBase64(actualFile)) {
    if (options.allowBase64) {
      validateFileOrBase64(actualFile, options, file, validFiles, errors);
    } else {
      errors.push({ file: actualFile, reason: 'base64NotAllowed' });
    }
  } else if (sanitizeUrl(actualFile, { allowBase64: options.allowBase64 })) {
    validFiles.push(file);
  } else {
    errors.push({ file: actualFile, reason: 'invalidBase64' });
  }
};

export const filterFiles = <T extends FileInput>(
  files: T[],
  options: FileValidationOptions
): [T[], FileError[]] => {
  const validFiles: T[] = [];
  const errors: FileError[] = [];

  for (const file of files) {
    const actualFile = 'src' in file ? file.src : file;

    if (actualFile instanceof File) {
      validateFileOrBase64(actualFile, options, file, validFiles, errors);
    } else if (typeof actualFile === 'string') {
      processStringFile(actualFile, file, options, validFiles, errors);
    }
  }

  return [validFiles, errors];
};

export function isValidUrlFormat(urlString: string) {
  try {
    new URL(urlString);
    return true;
  } catch (_error) {
    return false;
  }
}

export function formatUrlWithProtocol(rawUrlString: string) {
  if (isValidUrlFormat(rawUrlString)) {
    return rawUrlString;
  }
  try {
    if (rawUrlString.includes('.') && !rawUrlString.includes(' ')) {
      return new URL(`https://${rawUrlString}`).toString();
    }
  } catch (_error) {
    return null;
  }
}
