import { StyleSheet } from 'react-native';
import { colors } from './colors';

export { colors };

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.slate100,
  },
  keyboardWrap: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    minHeight: '100%',
  },
  card: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.slate200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    backgroundColor: colors.slate900,
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: colors.slate400,
    marginTop: 4,
  },
  form: {
    padding: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.slate700,
    marginBottom: 8,
  },
  labelRole: {
    marginTop: 8,
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.slate900,
    backgroundColor: colors.white,
  },
  randomButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.slate200,
    justifyContent: 'center',
  },
  randomButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.slate700,
  },
  roleList: {
    gap: 8,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
  },
  roleOptionSelected: {
    borderColor: colors.indigo500,
    backgroundColor: colors.indigo50,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.slate900,
  },
  roleLabelSelected: {
    color: colors.indigo600,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: colors.indigo600,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
