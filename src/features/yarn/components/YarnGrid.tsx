import { Text } from '@/components/ui/text';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useGetYarns } from '../queries';
import type { YarnResponse } from '../types';
import { YarnCard } from './YarnCard';
import { YarnEmptyState } from './YarnEmptyState';

interface YarnGridProps {
  onYarnPress: (yarn: YarnResponse) => void;
  onAddYarn: () => void;
}

export function YarnGrid({ onYarnPress, onAddYarn }: YarnGridProps) {
  const { data: yarns, isLoading, isError, error, refetch } = useGetYarns();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-4">Loading yarns...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-8 py-16">
        <Text className="text-destructive mb-2 text-center">Failed to load yarns</Text>
        <Text className="text-muted-foreground mb-4 text-center text-sm">
          {error?.message || 'Unknown error'}
        </Text>
        <Text className="text-primary text-sm" onPress={() => refetch()}>
          Tap to retry
        </Text>
      </View>
    );
  }

  if (!yarns || yarns.length === 0) {
    return <YarnEmptyState onAddYarn={onAddYarn} />;
  }

  return (
    <FlatList
      data={yarns}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      contentContainerClassName="p-2"
      columnWrapperClassName="gap-2"
      ItemSeparatorComponent={() => <View className="h-2" />}
      renderItem={({ item }) => (
        <View className="flex-1 px-1">
          <YarnCard yarn={item} onPress={onYarnPress} />
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
