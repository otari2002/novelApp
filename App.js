import { NavigationContainer  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import HomeScreen from "./screens/homescreen";
import AddNovel from "./screens/addNovel";
import { View, Alert } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'black', 
        }}>
        <Tab.Screen
          name="Liste Des Romans WEB"
          component={HomeScreen}
          options={{
            tabBarLabel: '', 
            tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
            headerRight: () => (
              <View style={{marginHorizontal: 15}}>
                <Ionicons 
                  name="help-circle-outline" 
                  size={28} 
                  color="black"
                  onPress={() => Alert.alert("Modification","Appuyez sur le titre d'un roman pendant une seconde pour modifier ses détails.",[])}
                />
              </View>
            )
          }}
        />
        <Tab.Screen
          name="Ajouter Un Roman WEB"
          component={AddNovel}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <AntDesign name="plussquareo" size={24} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
