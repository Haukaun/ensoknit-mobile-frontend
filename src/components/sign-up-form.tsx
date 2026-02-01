import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/context';
import { signUpSchema } from '@/features/auth/schemas';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

export function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);

  function onFullNameSubmitEditing() {
    emailInputRef.current?.focus();
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    // Clear previous errors
    setErrors({});

    // Validate with Zod
    const result = signUpSchema.safeParse({ fullName, email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Submit to API
    setIsPending(true);
    try {
      await signUp(result.data.fullName, result.data.email, result.data.password);
      router.push('/(auth)/login' as any);
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                autoComplete="name"
                autoCapitalize="words"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                onSubmitEditing={onFullNameSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
                editable={!isPending}
                aria-invalid={!!errors.fullName}
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && (
                <Text variant="small" className="text-destructive">
                  {errors.fullName}
                </Text>
              )}
            </View>

            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailInputRef}
                id="email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
                editable={!isPending}
                aria-invalid={!!errors.email}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <Text variant="small" className="text-destructive">
                  {errors.email}
                </Text>
              )}
            </View>

            <View className="gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                editable={!isPending}
                aria-invalid={!!errors.password}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <Text variant="small" className="text-destructive">
                  {errors.password}
                </Text>
              )}
            </View>

            {errors.submit && (
              <Text variant="small" className="text-center text-destructive">
                {errors.submit}
              </Text>
            )}

            <Button className="w-full" onPress={onSubmit} disabled={isPending}>
              {isPending ? <ActivityIndicator size="small" color="white" /> : <Text>Continue</Text>}
            </Button>
          </View>
          <Text className="text-center text-sm">
            Already have an account?{' '}
            <Pressable
              onPress={() => {
                router.push('/(auth)/login' as any);
              }}
              disabled={isPending}>
              <Text className="text-sm underline underline-offset-4">Sign in</Text>
            </Pressable>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
