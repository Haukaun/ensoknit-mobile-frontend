import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock function for parsing yarn label
// TODO: Replace with actual Google Cloud Vision API call
const parseYarnLabel = async (base64Image: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return mock data
  return {
    name: 'Red Heart Super Saver',
    material: '100% Acrylic',
    weight: '198g',
    length: '333m',
  };
};

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Form State
  const [yarnName, setYarnName] = useState('');
  const [material, setMaterial] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-4">
        <Text className="mb-4 text-center text-white">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Button>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });

        if (photo?.base64) {
          const data = await parseYarnLabel(photo.base64);
          setYarnName(data.name);
          setMaterial(data.material);
          setWeight(data.weight);
          setLength(data.length);
        }

        setPhoto(photo?.uri || null);
      } catch (error) {
        console.error('Failed to take picture:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetScan = () => {
    setPhoto(null);
    setYarnName('');
    setMaterial('');
    setWeight('');
    setLength('');
  };

  if (photo) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView contentContainerClassName="p-5">
          <Image
            source={{ uri: photo }}
            className="mb-5 h-[200px] w-full rounded-lg bg-muted"
            resizeMode="contain"
          />

          <Text className="mb-5 text-2xl font-bold text-foreground">Scan Results</Text>

          <View className="mb-4 gap-1.5">
            <Label>Name / Brand</Label>
            <Input
              value={yarnName}
              onChangeText={setYarnName}
              placeholder="e.g. Red Heart Super Saver"
            />
          </View>

          <View className="mb-4 gap-1.5">
            <Label>Material</Label>
            <Input value={material} onChangeText={setMaterial} placeholder="e.g. 100% Acrylic" />
          </View>

          <View className="mb-4 gap-1.5">
            <Label>Weight</Label>
            <Input value={weight} onChangeText={setWeight} placeholder="e.g. 100g" />
          </View>

          <View className="mb-4 gap-1.5">
            <Label>Length</Label>
            <Input value={length} onChangeText={setLength} placeholder="e.g. 200m" />
          </View>

          <View className="mb-10 mt-5 flex-row justify-between gap-4">
            <Button variant="outline" className="flex-1" onPress={resetScan}>
              <Text>Retake</Text>
            </Button>
            <Button className="flex-1" onPress={() => alert('Saved!')}>
              <Text>Save Yarn</Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} facing="back" />

      {/* Overlay Container */}
      <View className="absolute inset-0 flex-1">
        {/* Top Overlay */}
        <View className="flex-1 bg-black/50" />

        {/* Middle Overlay */}
        <View className="h-[250px] flex-row">
          <View className="flex-1 bg-black/50" />
          <View className="relative h-[250px] w-[300px] border border-white/50 bg-transparent">
            {/* Corners */}
            <View className="absolute -left-0.5 -top-0.5 h-5 w-5 border-l-4 border-t-4 border-white" />
            <View className="absolute -right-0.5 -top-0.5 h-5 w-5 border-r-4 border-t-4 border-white" />
            <View className="absolute -bottom-0.5 -left-0.5 h-5 w-5 border-b-4 border-l-4 border-white" />
            <View className="absolute -bottom-0.5 -right-0.5 h-5 w-5 border-b-4 border-r-4 border-white" />
          </View>
          <View className="flex-1 bg-black/50" />
        </View>

        {/* Bottom Overlay */}
        <View className="flex-1 items-center justify-center bg-black/50 pb-10">
          <Text className="mb-8 text-center text-base font-medium text-white">
            Align label within the frame
          </Text>
          <TouchableOpacity
            className="h-[70px] w-[70px] items-center justify-center rounded-full bg-white/30"
            onPress={takePicture}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View className="h-[60px] w-[60px] rounded-full bg-white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
