import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function NavigationGuard() {
  const navigation = useNavigation();
  const isLoggedIn = useSelector(state => !!state.user.token);

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.replace('Screen01'); // Chuyển về màn hình đăng nhập
    }
  }, [isLoggedIn, navigation]);

  return null;
}
