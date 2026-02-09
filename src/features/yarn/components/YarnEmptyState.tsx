import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

interface YarnEmptyStateProps {
  onAddYarn: () => void;
}

export function YarnEmptyState({ onAddYarn }: YarnEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      {/* Illustration */}
      <View className="bg-muted mb-6 h-32 w-32 items-center justify-center rounded-full">
        <Ionicons name="color-palette-outline" size={64} color="#9ca3af" />
      </View>

      {/* Text */}
      <Text className="mb-2 text-center text-lg font-semibold">No yarns yet</Text>
      <Text className="text-muted-foreground mb-6 text-center">
        Start building your yarn stash by adding your first yarn.
      </Text>

      {/* CTA Button */}
      <Button onPress={onAddYarn}>
        <Ionicons name="add" size={20} color="white" />
        <Text>Add your first yarn</Text>
      </Button>
    </View>
  );
}
