import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { checkAuthStatus } from './redux/authActions';
import Screen01 from './screens/Screen01';
import Screen02 from './screens/Screen02';
import Screen03 from './screens/Screen03';
import Screen04 from './screens/Screen04';
import Screen05 from './screens/Screen05';
import Screen06 from './screens/Screen06';
import EditProfile from './screens/EditProfile';

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
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
