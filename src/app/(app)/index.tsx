import { Text } from '@/components/ui/text';
import { StashwiseLogo } from '@/assets/logo/Stashwise';
import * as React from 'react';
import { View } from 'react-native';

export default function Screen() {
  return (
    <View className="flex-1 items-center justify-center gap-6 bg-background p-4">
      <StashwiseLogo width={240} height={86} />
      <Text className="text-lg text-muted-foreground">
        Your yarn stash, organized.
      </Text>
    </View>
  );
}
