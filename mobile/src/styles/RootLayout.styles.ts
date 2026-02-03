import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgAlt,
  },
  loadingText: {
    marginTop: 8,
    color: colors.gray500,
  },
});
