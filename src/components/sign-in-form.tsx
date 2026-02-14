import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/context';
import { signInSchema } from '@/features/auth/schemas';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, type TextInput, View } from 'react-native';

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const passwordInputRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    setErrors({});

    const result = signInSchema.safeParse({ email, password });

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

    setIsPending(true);
    try {
      await signIn(result.data.email, result.data.password);
      router.replace('/(app)/' as any);
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Invalid email or password',
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Sign in to StashWise</CardTitle>
          <CardDescription className="text-center sm:text-left">Welcome back! Please sign in to continue</CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
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
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4"
                  onPress={() => {
                    // TODO: Navigate to forgot password screen
                  }}
                  disabled={isPending}>
                  <Text className="font-normal leading-4">Forgot your password?</Text>
                </Button>
              </View>
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
            Don&apos;t have an account?{' '}
            <Pressable
              onPress={() => {
                router.push('/(auth)/register' as any);
              }}
              disabled={isPending}>
              <Text className="text-sm underline underline-offset-4">Sign up</Text>
            </Pressable>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
