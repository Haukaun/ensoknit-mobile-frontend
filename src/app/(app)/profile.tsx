import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/context';
import { PatternsTabContent } from '@/features/profile/components/PatternsTabContent';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileTabs } from '@/features/profile/components/ProfileTabs';
import { ProjectsTabContent } from '@/features/profile/components/ProjectsTabContent';
import { YarnTabContent } from '@/features/profile/components/YarnTabContent';
import type { ProfileTab } from '@/features/profile/types';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ProfileTab>('yarns');

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ProfileHeader user={user} />

        {/* Sticky Tabs */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <View className="min-h-[400px]">
          {activeTab === 'yarns' && <YarnTabContent />}
          {activeTab === 'patterns' && <PatternsTabContent />}
          {activeTab === 'projects' && <ProjectsTabContent />}
        </View>
      </ScrollView>
    </View>
  );
}
