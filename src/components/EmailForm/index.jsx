import axios from 'axios';
import React, { useEffect, useReducer, useRef } from 'react';
import { ActivityIndicator, Alert, Animated, Platform, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { DFlexButton } from '../../styles';
import { ButtonText, ErrorText, FormContainer, Input, ResetButton, ResetButtonText, SubmitButton, SuccessContainer, SuccessText, Underline } from '../../styles/HomeStyled';
import RecaptchaWebView from '../RecaptchaWebView';

const initialState = {
  email: '',
  error: '',
  isSubmitting: false,
  isSubmitted: false
};

const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(message);
  }
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SUBMIT':
      return { ...state, isSubmitting: action.payload };
    case 'UPDATE_EMAIL':
      return { ...state, email: action.payload, error: '' };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isSubmitting: false };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_SUCCESS':
      return { ...initialState, isSubmitted: true };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

const SubmitIcon = <Icon name="arrow-right" size={18} color="#000" />


const EmailForm = ({ onClose }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { email, error, isSubmitting, isSubmitted } = state;
  const recaptcha = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

    const handleVerify = async (token) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('recaptcha_token', token);


      const response = await axios.post('https://propera.ai/mail.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      

      if (response.data.trim() === 'success') {
        dispatch({ type: 'SUBMIT_SUCCESS' });
        showToast('Thank you for subscribing!');
      } else if (response.data.trim() === 'recaptcha_error') {
        showToast('reCAPTCHA verification failed. Please try again.');
        dispatch({ type: "SET_SUBMIT", payload: false });
      } else {
        showToast('There was an error sending the email. Please try again.');
        dispatch({ type: "SET_SUBMIT", payload: false });
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Submission failed. Please try again.' });
      showToast('There was a problem with the server. Please try again later.');
    }
  };

    const handleSubmit = async () => {
    if (!validateEmail(email)) {
      dispatch({ type: 'SET_ERROR', payload: 'Please enter a valid email address' });
      return;
    }

    dispatch({ type: 'SUBMIT_START' });
    recaptcha.current?.execute('submit'); // triggers reCAPTCHA
  };

  useEffect(() => {
    if (isSubmitted) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isSubmitted, fadeAnim]);

  const handleReset = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch({ type: 'RESET_FORM' });
    });
  };

  if (isSubmitted) {
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <SuccessContainer>
          <SuccessText>Thank you! We'll contact you soon.</SuccessText>
          <ResetButton onPress={handleReset}>
            <ResetButtonText>Submit another email</ResetButtonText>
          </ResetButton>
        </SuccessContainer>
      </Animated.View>
    );
  }

  return (
    <FormContainer>
      <RecaptchaWebView ref={recaptcha} onVerify={handleVerify} />
      <Input
        placeholder="Enter your email"
        placeholderTextColor={'#999'}
        value={email}
        onChangeText={(text) => dispatch({ type: 'UPDATE_EMAIL', payload: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Underline />
      {error ? <ErrorText>{error}</ErrorText> : null}

      <SubmitButton
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <DFlexButton>
            <ButtonText>Register</ButtonText>
            {SubmitIcon}
          </DFlexButton>
        )}
      </SubmitButton>
    </FormContainer>
  );
};


export default EmailForm;