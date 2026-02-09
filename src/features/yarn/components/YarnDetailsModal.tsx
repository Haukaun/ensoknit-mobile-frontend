import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDeleteYarn } from '../mutations';
import type { YarnResponse } from '../types';

interface YarnDetailsModalProps {
  yarn: YarnResponse | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (yarn: YarnResponse) => void;
}

function DetailRow({ label, value }: { label: string; value: string | number | null }) {
  if (value === null || value === undefined || value === '') return null;
  
  return (
    <View className="flex-row justify-between border-border border-b py-3">
      <Text className="text-muted-foreground">{label}</Text>
      <Text className="font-medium">{value}</Text>
    </View>
  );
}

function formatCategory(category: string): string {
  return category
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function YarnDetailsModal({ yarn, visible, onClose, onEdit }: YarnDetailsModalProps) {
  const insets = useSafeAreaInsets();
  const deleteYarn = useDeleteYarn();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!yarn) return null;

  const handleDelete = async () => {
    try {
      await deleteYarn.mutateAsync(yarn.id);
      onClose();
    } catch (error) {
      // Error is handled by React Query
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="bg-background flex-1" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="border-border flex-row items-center justify-between border-b px-4 py-3">
          <Pressable onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#374151" />
          </Pressable>
          <Text className="text-lg font-semibold">Yarn Details</Text>
          <Pressable onPress={() => onEdit(yarn)} className="p-2">
            <Ionicons name="pencil" size={24} color="#6366f1" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4">
          {/* Color Preview */}
          {yarn.color && (
            <View className="my-4 items-center">
              <View
                className="h-24 w-24 rounded-full border-4 border-border"
                style={{ backgroundColor: yarn.color }}
              />
            </View>
          )}

          {/* Yarn Name */}
          <Text className="mb-4 text-center text-2xl font-bold">{yarn.name}</Text>

          {/* Details */}
          <View className="mb-6">
            <DetailRow label="Brand" value={yarn.brand} />
            <DetailRow label="Color" value={yarn.color} />
            <DetailRow label="Category" value={formatCategory(yarn.category)} />
            <DetailRow label="Quantity" value={yarn.quantity} />
            <DetailRow 
              label="Weight" 
              value={yarn.weightInGrams ? `${yarn.weightInGrams}g` : null} 
            />
            <DetailRow 
              label="Length" 
              value={yarn.lengthInMeters ? `${yarn.lengthInMeters}m` : null} 
            />
            <DetailRow label="Fiber Content" value={yarn.fiberContent} />
            <DetailRow label="Folder" value={yarn.folderName} />
            {yarn.pricePerUnit && (
              <DetailRow 
                label="Price" 
                value={`${yarn.pricePerUnit} ${yarn.currencyCode || 'USD'}`} 
              />
            )}
          </View>

          {/* Delete Confirmation */}
          {showDeleteConfirm ? (
            <View className="border-destructive bg-destructive/10 mb-6 rounded-lg border p-4">
              <Text className="mb-4 text-center font-medium">
                Are you sure you want to delete "{yarn.name}"?
              </Text>
              <View className="flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={() => setShowDeleteConfirm(false)}
                  disabled={deleteYarn.isPending}>
                  <Text>Cancel</Text>
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onPress={handleDelete}
                  disabled={deleteYarn.isPending}>
                  {deleteYarn.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text>Delete</Text>
                  )}
                </Button>
              </View>
            </View>
          ) : (
            <Button
              variant="outline"
              className="border-destructive mb-6"
              onPress={() => setShowDeleteConfirm(true)}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
              <Text className="text-destructive">Delete Yarn</Text>
            </Button>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
