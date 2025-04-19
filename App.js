import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { checkAuthStatus } from './redux/authActions';
import Screen01 from './Screens/Screen01.js';
import Screen02 from './Screens/Screen02.js';
import Screen03 from './Screens/Screen03.js';
import Screen04 from './Screens/Screen04.js';
import Screen05 from './Screens/Screen05.js';
import Screen06 from './Screens/Screen06.js';
import EditProfileUser from './Screens/EditProfileUser.js';

const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    store.dispatch(checkAuthStatus());
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Screen01 là màn hình đầu tiên */}
          <Stack.Screen 
            name="Screen01" 
            component={Screen01} 
            options={{ headerShown: false }}
          />
          
          {/* Các màn hình đăng nhập/đăng ký */}
          <Stack.Screen name="Screen02" component={Screen02} />
          <Stack.Screen name="Screen03" component={Screen03} />
          
          {/* Màn hình chính sau khi đăng nhập */}
          <Stack.Screen 
            name="Screen05" 
            component={Screen05} 
            options={{ headerShown: false }}
          />
          
          {/* Các màn hình khác */}
          <Stack.Screen name="Screen04" component={Screen04} />
          <Stack.Screen name="Screen06" component={Screen06} />
          <Stack.Screen name="EditProfileUser" component={EditProfileUser} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
