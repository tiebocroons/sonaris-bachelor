import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'display' | 'h2' | 'h3' | 'h4' | 'body';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'display' ? styles.display : undefined,
        type === 'h2' ? styles.h2 : undefined,
        type === 'h3' ? styles.h3 : undefined,
        type === 'h4' ? styles.h4 : undefined,
        type === 'body' ? styles.body : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  display: {
    fontSize: 96,
    lineHeight: 96,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 36,
    lineHeight: 36,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 36,
    lineHeight: 36,
    fontWeight: 'bold',
  },
  h4: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 20,
    lineHeight: 20,
  },
});
