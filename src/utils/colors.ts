/** ANSI Escape Color Codes */
enum Colors {
  RED = 31,
  GREEN = 32,
  YELLOW = 33,
  BLUE = 34,
  MAGENTA = 35,
  CYAN = 36,
  WHITE = 37,
  DEFAULT = 39,
}

/** ANSI Escape Reset Code */
const ESC_RESET = '\x1b[0m';

/**
 * Transform an ANSI Escape Color Code to an Escape Sequence
 *
 * @param color The ANSI Escape Color Code to transform to an Escape Sequence
 * @param bold Make the color bold - _default: `false`_
 * @returns The `color` transformed as an Escape Sequence
 */
const toEscapeSequence = (color: Colors, bold = false) =>
  '\x1b[' + (bold ? '1;' : '') + color + 'm';

/**
 * Color a text using ANSI Escape Sequence
 *
 * @param text The text to color
 * @param color The ANSI Escape Color Code to color the text - _default: `39` (DEFAULT)_
 * @param bold Make the color bold - _default: `false`_
 * @returns The text colored with a reset at the end
 */
const colorText = (text: string, color = Colors.DEFAULT, bold = false) =>
  toEscapeSequence(color, bold) + text + ESC_RESET;

export { Colors, colorText };
