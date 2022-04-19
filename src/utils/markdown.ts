enum MarkdownHeaders {
  H1 = '#',
  H2 = '##',
  H3 = '###',
  H4 = '####',
  H5 = '#####',
  H6 = '######',
}

enum MarkdownLists {
  UNORDERED = '-',
  ORDERED = '1.',
  INDENTED = '&nbsp;&nbsp;-',
}

enum MarkdownEmphasis {
  ITALICS = '*',
  BOLD = '**',
  ITALICS_BOLD = '***',
  STRIKETHROUGH = '~~',
}

/**
 * Format text into a markdown header
 *
 * @param text The text to format
 * @param type The type of header
 * @returns `text` formatted as a markdown header
 */
const toHeader = (text: string, type: MarkdownHeaders) => {
  return type + ' ' + text + '\n';
};

/**
 * Format an array of strings into a markdown list
 *
 * @param items The strings to format as markdown list items
 * @param type The type of the list
 * @param title The title of the list
 * @param titleBold Make the title bold - _default `false`_
 * @returns `items` formatted as a markdown list
 */
const toList = (
  items: string[],
  type: MarkdownLists,
  title?: string,
  titleBold = false
) => {
  let markdownList = '';
  if (title)
    markdownList = titleBold ? toEmphasis(title, MarkdownEmphasis.BOLD) : title;

  for (const item of items) {
    if (type === MarkdownLists.INDENTED) markdownList += ' \\';
    markdownList += '\n' + type + ' ' + item;
  }

  if (type === MarkdownLists.INDENTED) markdownList += ' \\';
  return markdownList + '\n';
};

/**
 * Format text as emphasis text
 *
 * @param text The text to format
 * @param type The type of the emphasis
 * @returns `text` formatted as an emphasis text
 */
const toEmphasis = (text: string, type: MarkdownEmphasis) => {
  return type + text + type;
};

/**
 * Format text into a markdown block code
 *
 * @param text The text to format
 * @param language The language of the code
 * @returns The text formatted as a markdown code block
 */
const toCode = (text: string, language?: string) => {
  const code = '```';
  return `${code}${language ?? ''}\n${text}\n${code}\n`;
};

export {
  MarkdownHeaders,
  MarkdownLists,
  MarkdownEmphasis,
  toHeader,
  toList,
  toEmphasis,
  toCode,
};
