import React from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const MyComponent = ({ navigation }) => {
  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item.id)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleItemPress = async (itemId) => {
    try {
      // Salve o ID do item no AsyncStorage
      await AsyncStorage.setItem('selectedItemId', JSON.stringify(itemId));
      // Navegue para a próxima tela
      navigation.navigate('Detalhes');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const DetalhesScreen = () => {
  const [itemId, setItemId] = React.useState(null);

  React.useEffect(() => {
    const fetchItemId = async () => {
      try {
        // Obtenha o ID do item armazenado no AsyncStorage
        const storedItemId = await AsyncStorage.getItem('selectedItemId');
        setItemId(JSON.parse(storedItemId));
      } catch (error) {
        console.log(error);
      }
    };

    fetchItemId();
  }, []);

  return (
    <Text>Detalhes do item: {itemId}</Text>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={MyComponent} />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
