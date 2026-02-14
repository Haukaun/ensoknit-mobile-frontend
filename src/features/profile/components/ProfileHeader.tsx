import { Text } from '@/components/ui/text';
import { themeColors } from '@/lib/theme-colors';
import { useGetYarns } from '@/features/yarn/queries';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import type { ProfileUser } from '../types';
import { getInitials } from '../utils';

interface ProfileHeaderProps {
  user: ProfileUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { data: yarns } = useGetYarns();
  const { colorScheme } = useColorScheme();
  const colors = themeColors[colorScheme ?? 'light'];

  const stats = [
    { icon: 'color-palette-outline' as const, count: yarns?.length || 0, label: 'Yarns' },
    { icon: 'document-text-outline' as const, count: 0, label: 'Patterns' },
    { icon: 'construct-outline' as const, count: 0, label: 'Projects' },
  ];

  return (
    <View className="px-4 pb-0 pt-6">
      {/* Top row: Avatar left, Name/Email right */}
      <View className="mb-4 flex-row items-center gap-4">
        {/* Avatar */}
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Text className="text-xl font-bold text-primary-foreground">
            {getInitials(user.fullName)}
          </Text>
        </View>

        {/* Name & Email */}
        <View className="flex-1">
          <Text className="text-lg font-bold">{user.fullName}</Text>
          <Text className="text-sm text-muted-foreground">{user.email}</Text>
        </View>
      </View>

      {/* Stat Chips */}
      <View className="flex-row gap-2 pb-3">
        {stats.map((stat) => (
          <View
            key={stat.label}
            className="flex-row items-center gap-1.5 rounded-full bg-muted px-3 py-1.5"
          >
            <Ionicons
              name={stat.icon}
              size={14}
              color={colors.mutedForeground}
            />
            <Text className="text-sm font-semibold">{stat.count}</Text>
            <Text className="text-xs text-muted-foreground">{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
