import { Text } from '@/components/ui/text';
import { useGetYarns } from '@/features/yarn/queries';
import { View } from 'react-native';
import type { ProfileUser } from '../types';
import { getInitials } from '../utils';

interface ProfileHeaderProps {
  user: ProfileUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { data: yarns } = useGetYarns();

  const stats = {
    yarns: yarns?.length || 0,
    patterns: 0,
    projects: 0,
  };

  return (
    <View className="items-center px-4 pb-4 pt-6">
      {/* Avatar */}
      <View className="mb-3 h-24 w-24 items-center justify-center rounded-full bg-primary">
        <Text className="text-3xl font-bold text-primary-foreground">
          {getInitials(user.fullName)}
        </Text>
      </View>

      {/* Username */}
      <Text className="mb-1 text-xl font-bold">{user.fullName}</Text>

      {/* Email (as bio placeholder) */}
      <Text className="text-muted-foreground mb-4 text-sm">{user.email}</Text>

      {/* Stats Row */}
      <View className="flex-row gap-8">
        <View className="items-center">
          <Text className="text-lg font-bold">{stats.yarns}</Text>
          <Text className="text-muted-foreground text-sm">Yarns</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">{stats.patterns}</Text>
          <Text className="text-muted-foreground text-sm">Patterns</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">{stats.projects}</Text>
          <Text className="text-muted-foreground text-sm">Projects</Text>
        </View>
      </View>
    </View>
  );
}
