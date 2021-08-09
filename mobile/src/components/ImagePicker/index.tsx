import React, { useCallback, useMemo } from 'react';
import { Alert, AlertButton, View } from 'react-native';
import RNImagePicker, { ImagePickerResponse } from 'react-native-image-picker';

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: RNImagePicker.CameraOptions | RNImagePicker.ImageLibraryOptions;
}

const ImagePicker: React.FC = () => {
  const actions: Action[] = useMemo(() => {
    return [
      {
        title: 'Usar câmera',
        type: 'capture',
        options: {
          saveToPhotos: true,
          mediaType: 'photo',
          includeBase64: false,
        },
      },
      {
        title: 'Escolher da galeria',
        type: 'library',
        options: {
          selectionLimit: 1,
          mediaType: 'photo',
          includeBase64: false,
        },
      },
      {
        title: 'Take Video',
        type: 'capture',
        options: {
          saveToPhotos: true,
          mediaType: 'video',
        },
      },
      {
        title: 'Select Video',
        type: 'library',
        options: {
          selectionLimit: 0,
          mediaType: 'video',
        },
      },
      {
        title: `Select Image or Video\n(mixed)`,
        type: 'library',
        options: {
          selectionLimit: 0,
          mediaType: 'mixed',
        },
      },
    ];
  }, []);

  const responseImagePicker = useCallback((response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorMessage) {
      Alert.alert('Erro ao atualizar seu avatar.');
      return;
    }

    if (!response.assets) {
      return;
    }

    if (response.assets.length > 0) {
      return;
    }

    if (!response.assets[0].uri) {
      return;
    }

    const data = new FormData();

    data.append('avatar', {
      type: 'image/jpg',
      name: `${response.assets[0].fileName}.jpg`,
      uri: response.assets[0].uri,
    });
  }, []);

  const handleImagePicker = useCallback(() => {
    Alert.alert(
      'Selecione um avatar',
      undefined,
      actions.map(({ title, type, options }) => {
        return {
          text: title,
          onPress: () => {
            if (type === 'capture') {
              RNImagePicker.launchCamera(options, responseImagePicker);
            } else {
              RNImagePicker.launchImageLibrary(options, responseImagePicker);
            }
          },
        };
      }),
    );
  }, [actions, responseImagePicker]);

  return <View />;
};

export default ImagePicker;
