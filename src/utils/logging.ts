import { Colors, colorText } from './colors';

/**
 * Log an error
 *
 * @param text The error text to log
 */
export const logError = (text: string) => {
  const coloredText = colorText(text, Colors.RED, true);
  console.error(coloredText);
};
