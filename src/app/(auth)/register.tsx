import { SignUpForm } from '@/components/sign-up-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export default function RegisterScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerClassName="flex-1 items-center justify-center p-4 py-8">
        <View className="w-full max-w-sm">
          <SignUpForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
