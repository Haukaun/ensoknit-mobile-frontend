import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export function PatternsTabContent() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
      <Text className="mt-4 text-muted-foreground">Patterns coming soon</Text>
    </View>
  );
}
