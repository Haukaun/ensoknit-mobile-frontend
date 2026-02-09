import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export function ProjectsTabContent() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Ionicons name="construct-outline" size={64} color="#9ca3af" />
      <Text className="text-muted-foreground mt-4">Projects coming soon</Text>
    </View>
  );
}
