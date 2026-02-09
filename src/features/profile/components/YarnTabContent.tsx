import { YarnDetailsModal, YarnFormModal, YarnGrid } from '@/features/yarn/components';
import type { YarnResponse } from '@/features/yarn/types';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

export function YarnTabContent() {
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
