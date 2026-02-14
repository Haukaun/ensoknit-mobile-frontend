import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreateYarn, useUpdateYarn } from '../mutations';
import { YARN_CATEGORIES, yarnFormSchema } from '../schemas';
import type { YarnRequest, YarnResponse } from '../types';

interface YarnFormModalProps {
  visible: boolean;
  onClose: () => void;
  yarn?: YarnResponse; // If provided, we're editing; otherwise creating
}

function formatCategoryLabel(category: string): string {
  return category
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function YarnFormModal({ visible, onClose, yarn }: YarnFormModalProps) {
  const insets = useSafeAreaInsets();
  const createYarn = useCreateYarn();
  const updateYarn = useUpdateYarn();
  const isEditing = !!yarn;

  // Form state
  const [name, setName] = useState(yarn?.name || '');
  const [brand, setBrand] = useState(yarn?.brand || '');
  const [color, setColor] = useState(yarn?.color || '');
  const [category, setCategory] = useState<string>(yarn?.category || 'WORSTED');
  const [weightInGrams, setWeightInGrams] = useState(yarn?.weightInGrams?.toString() || '');
  const [lengthInMeters, setLengthInMeters] = useState(yarn?.lengthInMeters?.toString() || '');
  const [fiberContent, setFiberContent] = useState(yarn?.fiberContent || '');
  const [quantity, setQuantity] = useState(yarn?.quantity?.toString() || '1');
  const [pricePerUnit, setPricePerUnit] = useState(yarn?.pricePerUnit?.toString() || '');
  const [currencyCode, setCurrencyCode] = useState(yarn?.currencyCode || 'USD');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Refs for keyboard navigation
  const brandRef = useRef<TextInput>(null);
  const colorRef = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);
  const lengthRef = useRef<TextInput>(null);
  const fiberRef = useRef<TextInput>(null);
  const quantityRef = useRef<TextInput>(null);
  const priceRef = useRef<TextInput>(null);

  const isPending = createYarn.isPending || updateYarn.isPending;

  const resetForm = () => {
    setName(yarn?.name || '');
    setBrand(yarn?.brand || '');
    setColor(yarn?.color || '');
    setCategory(yarn?.category || 'WORSTED');
    setWeightInGrams(yarn?.weightInGrams?.toString() || '');
    setLengthInMeters(yarn?.lengthInMeters?.toString() || '');
    setFiberContent(yarn?.fiberContent || '');
    setQuantity(yarn?.quantity?.toString() || '1');
    setPricePerUnit(yarn?.pricePerUnit?.toString() || '');
    setCurrencyCode(yarn?.currencyCode || 'USD');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setErrors({});

    const formData = {
      name,
      brand: brand || undefined,
      color: color || undefined,
      category,
      weightInGrams: weightInGrams || undefined,
      lengthInMeters: lengthInMeters || undefined,
      fiberContent: fiberContent || undefined,
      quantity: parseInt(quantity, 10) || 1,
      pricePerUnit: pricePerUnit || undefined,
      currencyCode: currencyCode || undefined,
    };

    const result = yarnFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const request: YarnRequest = {
      name: result.data.name,
      brand: result.data.brand,
      color: result.data.color || undefined,
      category: result.data.category,
      weightInGrams: typeof result.data.weightInGrams === 'number' ? result.data.weightInGrams : undefined,
      lengthInMeters: typeof result.data.lengthInMeters === 'number' ? result.data.lengthInMeters : undefined,
      fiberContent: result.data.fiberContent,
      quantity: result.data.quantity,
      pricePerUnit: typeof result.data.pricePerUnit === 'number' ? result.data.pricePerUnit : undefined,
      currencyCode: result.data.currencyCode,
    };

    try {
      if (isEditing && yarn) {
        await updateYarn.mutateAsync({ id: yarn.id, request });
      } else {
        await createYarn.mutateAsync(request);
      }
      handleClose();
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to save yarn. Please try again.',
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
          <Pressable onPress={handleClose} className="p-2" disabled={isPending}>
            <Ionicons name="close" size={24} color={isPending ? '#9ca3af' : '#374151'} />
          </Pressable>
          <Text className="text-lg font-semibold">{isEditing ? 'Edit Yarn' : 'Add Yarn'}</Text>
          <Pressable onPress={handleSubmit} className="p-2" disabled={isPending}>
            {isPending ? <ActivityIndicator size="small" /> : <Text className="font-semibold text-primary">Save</Text>}
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
          {/* Name */}
          <View className="mb-4 gap-1.5">
            <Label>Name *</Label>
            <Input
              placeholder="Malabrigo Rios"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
              returnKeyType="next"
              onSubmitEditing={() => brandRef.current?.focus()}
              editable={!isPending}
              aria-invalid={!!errors.name}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <Text variant="small" className="text-destructive">
                {errors.name}
              </Text>
            )}
          </View>

          {/* Brand */}
          <View className="mb-4 gap-1.5">
            <Label>Brand</Label>
            <Input
              ref={brandRef}
              placeholder="Malabrigo"
              value={brand}
              onChangeText={setBrand}
              returnKeyType="next"
              onSubmitEditing={() => colorRef.current?.focus()}
              editable={!isPending}
            />
          </View>

          {/* Color */}
          <View className="mb-4 gap-1.5">
            <Label>Color (Hex)</Label>
            <View className="flex-row items-center gap-2">
              <Input
                ref={colorRef}
                placeholder="#FF5733"
                value={color}
                onChangeText={(text) => {
                  setColor(text);
                  setErrors((prev) => ({ ...prev, color: '' }));
                }}
                autoCapitalize="characters"
                returnKeyType="next"
                editable={!isPending}
                className={`flex-1 ${errors.color ? 'border-destructive' : ''}`}
              />
              {color && /^#([0-9A-Fa-f]{3}){1,2}$/.test(color) && (
                <View className="h-10 w-10 rounded-md border border-border" style={{ backgroundColor: color }} />
              )}
            </View>
            {errors.color && (
              <Text variant="small" className="text-destructive">
                {errors.color}
              </Text>
            )}
          </View>

          {/* Category */}
          <View className="mb-4 gap-1.5">
            <Label>Category *</Label>
            <Pressable
              className="h-10 flex-row items-center justify-between rounded-md border border-input bg-background px-3"
              onPress={() => setShowCategoryPicker(true)}
              disabled={isPending}>
              <Text>{formatCategoryLabel(category)}</Text>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </Pressable>
          </View>

          {/* Quantity */}
          <View className="mb-4 gap-1.5">
            <Label>Quantity *</Label>
            <Input
              ref={quantityRef}
              placeholder="1"
              value={quantity}
              onChangeText={(text) => {
                setQuantity(text);
                setErrors((prev) => ({ ...prev, quantity: '' }));
              }}
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => weightRef.current?.focus()}
              editable={!isPending}
              aria-invalid={!!errors.quantity}
              className={errors.quantity ? 'border-destructive' : ''}
            />
            {errors.quantity && (
              <Text variant="small" className="text-destructive">
                {errors.quantity}
              </Text>
            )}
          </View>

          {/* Weight & Length Row */}
          <View className="mb-4 flex-row gap-4">
            <View className="flex-1 gap-1.5">
              <Label>Weight (g)</Label>
              <Input
                ref={weightRef}
                placeholder="100"
                value={weightInGrams}
                onChangeText={setWeightInGrams}
                keyboardType="decimal-pad"
                returnKeyType="next"
                onSubmitEditing={() => lengthRef.current?.focus()}
                editable={!isPending}
              />
            </View>
            <View className="flex-1 gap-1.5">
              <Label>Length (m)</Label>
              <Input
                ref={lengthRef}
                placeholder="200"
                value={lengthInMeters}
                onChangeText={setLengthInMeters}
                keyboardType="decimal-pad"
                returnKeyType="next"
                onSubmitEditing={() => fiberRef.current?.focus()}
                editable={!isPending}
              />
            </View>
          </View>

          {/* Fiber Content */}
          <View className="mb-4 gap-1.5">
            <Label>Fiber Content</Label>
            <Input
              ref={fiberRef}
              placeholder="100% Merino Wool"
              value={fiberContent}
              onChangeText={setFiberContent}
              returnKeyType="next"
              onSubmitEditing={() => priceRef.current?.focus()}
              editable={!isPending}
            />
          </View>

          {/* Price */}
          <View className="mb-4 flex-row gap-4">
            <View className="flex-2 gap-1.5">
              <Label>Price per Unit</Label>
              <Input
                ref={priceRef}
                placeholder="12.99"
                value={pricePerUnit}
                onChangeText={setPricePerUnit}
                keyboardType="decimal-pad"
                editable={!isPending}
              />
            </View>
            <View className="flex-1 gap-1.5">
              <Label>Currency</Label>
              <Input
                placeholder="USD"
                value={currencyCode}
                onChangeText={setCurrencyCode}
                autoCapitalize="characters"
                maxLength={3}
                editable={!isPending}
              />
            </View>
          </View>

          {/* Submit Error */}
          {errors.submit && (
            <Text variant="small" className="mb-4 text-center text-destructive">
              {errors.submit}
            </Text>
          )}

          {/* Submit Button */}
          <Button className="mb-8 w-full" onPress={handleSubmit} disabled={isPending}>
            {isPending ? <ActivityIndicator size="small" color="white" /> : <Text>{isEditing ? 'Update Yarn' : 'Add Yarn'}</Text>}
          </Button>
        </ScrollView>

        {/* Category Picker Modal */}
        <Modal visible={showCategoryPicker} animationType="fade" transparent onRequestClose={() => setShowCategoryPicker(false)}>
          <Pressable className="flex-1 items-center justify-center bg-black/50" onPress={() => setShowCategoryPicker(false)}>
            <View className="m-4 w-full max-w-sm rounded-lg bg-background p-4">
              <Text className="mb-4 text-center text-lg font-semibold">Select Category</Text>
              {YARN_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  className={`rounded-md p-3 ${category === cat ? 'bg-primary/10' : ''}`}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryPicker(false);
                  }}>
                  <Text className={category === cat ? 'font-semibold text-primary' : ''}>{formatCategoryLabel(cat)}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>
    </Modal>
  );
}
