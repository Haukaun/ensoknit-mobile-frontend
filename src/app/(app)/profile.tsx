import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/context';
import { YarnDetailsModal, YarnFormModal, YarnGrid } from '@/features/yarn/components';
import { useGetYarns } from '@/features/yarn/queries';
import type { YarnResponse } from '@/features/yarn/types';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ProfileTab = 'yarns' | 'patterns' | 'projects';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function ProfileHeader({ user }: { user: { fullName: string; email: string } }) {
  const { data: yarns } = useGetYarns();
  
  const stats = { 
    yarns: yarns?.length || 0, 
    patterns: 0, 
    projects: 0 
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

function ProfileTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}) {
  const tabs: { key: ProfileTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'yarns', label: 'Yarns', icon: 'color-palette-outline' },
    { key: 'patterns', label: 'Patterns', icon: 'document-text-outline' },
    { key: 'projects', label: 'Projects', icon: 'construct-outline' },
  ];

  return (
    <View className="border-border flex-row border-b bg-background">
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          className="flex-1 items-center py-3"
          onPress={() => onTabChange(tab.key)}>
          <Ionicons
            name={tab.icon}
            size={24}
            color={activeTab === tab.key ? '#6366f1' : '#9ca3af'}
          />
          <Text
            className={`mt-1 text-xs ${activeTab === tab.key ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
            {tab.label}
          </Text>
          {activeTab === tab.key && (
            <View className="bg-primary absolute bottom-0 left-4 right-4 h-0.5 rounded-full" />
          )}
        </Pressable>
      ))}
    </View>
  );
}

function YarnTabContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedYarn, setSelectedYarn] = useState<YarnResponse | null>(null);
  const [editingYarn, setEditingYarn] = useState<YarnResponse | undefined>(undefined);

  const handleYarnPress = (yarn: YarnResponse) => {
    setSelectedYarn(yarn);
  };

  const handleEditYarn = (yarn: YarnResponse) => {
    setSelectedYarn(null);
    setEditingYarn(yarn);
  };

  const handleCloseDetails = () => {
    setSelectedYarn(null);
  };

  const handleCloseForm = () => {
    setShowCreateModal(false);
    setEditingYarn(undefined);
  };

  return (
    <View className="flex-1">
      <YarnGrid
        onYarnPress={handleYarnPress}
        onAddYarn={() => setShowCreateModal(true)}
      />

      {/* FAB - Floating Action Button */}
      <Pressable
        className="bg-primary absolute bottom-4 right-4 h-14 w-14 items-center justify-center rounded-full shadow-lg active:opacity-80"
        onPress={() => setShowCreateModal(true)}
        accessibilityLabel="Add new yarn"
        accessibilityRole="button">
        <Ionicons name="add" size={28} color="white" />
      </Pressable>

      {/* Yarn Details Modal */}
      <YarnDetailsModal
        yarn={selectedYarn}
        visible={!!selectedYarn}
        onClose={handleCloseDetails}
        onEdit={handleEditYarn}
      />

      {/* Create/Edit Yarn Modal */}
      <YarnFormModal
        visible={showCreateModal || !!editingYarn}
        onClose={handleCloseForm}
        yarn={editingYarn}
      />
    </View>
  );
}

function PatternsTabContent() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
      <Text className="text-muted-foreground mt-4">Patterns coming soon</Text>
    </View>
  );
}

function ProjectsTabContent() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Ionicons name="construct-outline" size={64} color="#9ca3af" />
      <Text className="text-muted-foreground mt-4">Projects coming soon</Text>
    </View>
  );
}

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
    <View className="bg-background flex-1" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}>
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
