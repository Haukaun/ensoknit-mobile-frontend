import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import type { ProfileTab } from '../types';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const TABS: { key: ProfileTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'yarns', label: 'Yarns', icon: 'color-palette-outline' },
  { key: 'patterns', label: 'Patterns', icon: 'document-text-outline' },
  { key: 'projects', label: 'Projects', icon: 'construct-outline' },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <View className="border-border flex-row border-b bg-background">
      {TABS.map((tab) => (
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
