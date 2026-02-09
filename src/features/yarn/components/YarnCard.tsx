import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import type { YarnResponse } from '../types';

interface YarnCardProps {
  yarn: YarnResponse;
  onPress: (yarn: YarnResponse) => void;
}

function isValidColor(color: string | null): boolean {
  if (!color) return false;
  // Check if it's a valid hex color
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
}

function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function YarnCard({ yarn, onPress }: YarnCardProps) {
  const hasValidColor = isValidColor(yarn.color);
  const backgroundColor = hasValidColor ? yarn.color! : '#e5e7eb';
  const textColor = hasValidColor ? getContrastColor(yarn.color!) : '#374151';

  return (
    <Pressable
      className={cn(
        'aspect-square overflow-hidden rounded-lg',
        'active:opacity-80'
      )}
      style={{ backgroundColor }}
      onPress={() => onPress(yarn)}
      accessibilityLabel={`${yarn.name}, quantity ${yarn.quantity}`}
      accessibilityRole="button">
      {/* Yarn Icon for yarns without valid color */}
      {!hasValidColor && (
        <View className="absolute inset-0 items-center justify-center">
          <Ionicons name="color-palette" size={32} color="#9ca3af" />
        </View>
      )}

      {/* Quantity Badge */}
      <View className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5">
        <Text className="text-xs font-semibold text-white">x{yarn.quantity}</Text>
      </View>

      {/* Yarn Name (shown on hover/focus for accessibility) */}
      <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5">
        <Text className="text-xs text-white" numberOfLines={1}>
          {yarn.name}
        </Text>
      </View>
    </Pressable>
  );
}
