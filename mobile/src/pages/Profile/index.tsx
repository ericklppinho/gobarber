import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImageEditor from '@react-native-community/image-editor';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  BackButton,
  UserAvatarButton,
  UserAvatar,
  Title,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

interface ImagePickerAction {
  title: string;
  type: 'capture' | 'library' | 'cancel';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { goBack } = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val: string) => !!val.length,
            then: Yup.string()
              .required('Nova senha obrigatória')
              .min(6, 'No mínimo 6 dígitos'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().when('old_password', {
            is: (val: string) => !!val.length,
            then: Yup.string()
              .required('Confirmação obrigatória')
              .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
            otherwise: Yup.string(),
          }),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        await updateUser(response.data);

        Alert.alert(
          'Perfil atualizado!',
          'Suas informações do perfil foram atualizadas com sucesso!',
        );

        goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        } else if (err.request) {
          if (err.request.status === 0) {
            Alert.alert('Erro de Conexão', 'Acesso ao sevidor indisponível.');
          } else if (err.request.status === 400) {
            Alert.alert(
              'Erro na atualização',
              'Ocorreu um erro ao fazer a atualização do perfil, tente novamente.',
            );
          } else if (err.request.status === 500) {
            Alert.alert(
              'Erro no Servidor',
              'Entre em contato com o administrador.',
            );
          }
        }
      }
    },
    [updateUser, goBack],
  );

  const responseImagePicker = useCallback(
    async (response: ImagePicker.ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorMessage) {
        Alert.alert('Erro ao atualizar seu avatar.');
        return;
      }

      if (
        !response.assets ||
        response.assets.length > 0 ||
        !response.assets[0].uri ||
        !response.assets[0].width ||
        !response.assets[0].height
      ) {
        return;
      }

      const x =
        response.assets[0].width > response.assets[0].height
          ? response.assets[0].width / 2 - response.assets[0].height / 2
          : 0;
      const y =
        response.assets[0].width > response.assets[0].height
          ? 0
          : response.assets[0].height / 2 - response.assets[0].width / 2;

      const minSize =
        response.assets[0].width < response.assets[0].height
          ? response.assets[0].width
          : response.assets[0].height;

      const imageURI = await ImageEditor.cropImage(response.assets[0].uri, {
        offset: { x, y },
        size: { width: minSize, height: minSize },
        displaySize: { width: 200, height: 200 },
        resizeMode: 'cover',
      });

      const data = new FormData();

      data.append('avatar', {
        type: 'image/jpeg',
        name: `${user.id}.jpg`,
        uri: imageURI,
      });

      api.patch('/profile/avatar', data).then(apiResponse => {
        updateUser(apiResponse.data);
      });
    },
    [user.id, updateUser],
  );

  const actions: ImagePickerAction[] = useMemo(() => {
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
        title: 'Cancelar',
        type: 'cancel',
        options: {} as ImagePicker.ImageLibraryOptions,
      },
    ];
  }, []);

  const handleUpdateAvatar = useCallback(() => {
    Alert.alert(
      'Selecione um avatar',
      undefined,
      actions.map(({ title, type, options }) => {
        return {
          text: title,
          style: type === 'cancel' ? 'cancel' : 'default',
          onPress: () => {
            if (type === 'cancel') {
              return;
            }

            if (type === 'capture') {
              ImagePicker.launchCamera(options, responseImagePicker);
            } else {
              ImagePicker.launchImageLibrary(options, responseImagePicker);
            }
          },
        };
      }),
    );
  }, [actions, responseImagePicker]);

  const handleGoBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form ref={formRef} initialData={user} onSubmit={handleSubmit}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />

              <Input
                ref={emailInputRef}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              />

              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                textContentType="newPassword"
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                containerStyle={{ marginTop: 16 }}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                textContentType="newPassword"
                name="password"
                icon="lock"
                placeholder="Nova senha"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              />

              <Input
                ref={confirmPasswordInputRef}
                secureTextEntry
                textContentType="newPassword"
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar senha"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>

            <Button onPress={() => formRef.current?.submitForm()}>
              Confirmar mudanças
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
