import React from 'react';
import { Alert, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FooterLogoContainer, LogoCircle } from '../../styles';
import { ContactContainer, ContactText, LinkText } from '../../styles/HomeStyled';

const facebook = <Icon name="facebook-f" size={18} color="#000" />
const instagram = <Icon name="instagram" size={18} color="#000" />
const linkedin = <Icon name="linkedin" size={18} color="#000" />

const Footer = () => {
  const handlePress = async () => {
    const email = 'someone@example.com';
    const subject = 'Hello';
    const body = 'Testing from React Native';
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailto).catch(() => {
      Alert.alert('Gmail app not found');
    });
  };
  const handleSocialPress = async (appUrl, webUrl) => {
    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      await Linking.openURL(webUrl);
    }
  };
  return (
    <ContactContainer>
      <TouchableOpacity onPress={handlePress}>
        <ContactText>
          Contact us: <LinkText>hello@propera.global</LinkText>
        </ContactText>
      </TouchableOpacity>
      <FooterLogoContainer>
        <LogoCircle onPress={() => handleSocialPress('fb://profile/100094492819251', 'https://www.facebook.com/propera.global')}>{facebook}</LogoCircle>
        <LogoCircle onPress={() => handleSocialPress('instagram://user?username=propera.global', 'https://www.instagram.com/propera.global')}>{instagram}</LogoCircle>
        <LogoCircle onPress={() => handleSocialPress('linkedin://company/propera.global', 'https://www.linkedin.com/company/propera.global')}>{linkedin}</LogoCircle>
      </FooterLogoContainer>
    </ContactContainer>
  )
}

export default Footer