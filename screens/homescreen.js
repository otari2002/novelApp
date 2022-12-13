import { useState, useRef, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';
import CompleteFlatList from 'react-native-complete-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { openBrowserAsync } from 'expo-web-browser';

export default function HomeScreen() {
  const ref = useRef();
  const isFocused = useIsFocused();
  const [list, setList] = useState([]);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (isFocused) {
      const boot = async () => {
        await AsyncStorage.getItem('NOVELS').then((novels) => {
          if (novels != null) {
            var arr = JSON.parse(novels);
            setList(arr);
            if (arr.length > 0) {
              setData(
                filter == ''
                  ? list
                  : list.filter((x) => x['type'].includes(filter))
              );
            } else setData([]);
          }
        });
      };
      boot();
    }
  }, [filter, list, isFocused]);

  const getNovels = () => {
    AsyncStorage.getItem('NOVELS').then((novels) => {
      if (novels != null) {
        var arr = JSON.parse(novels);
        setList(arr);
        cleanData(filter);
      }
    });
  };

  const RemoveEmpty = (props) => {
    if (props.value != '') {
      return (
        <Text style={props.styleValue}>
          {props.indicator} : {props.value}
        </Text>
      );
    } else {
      return <Text></Text>;
    }
  };


  const cleanData = (value) => {
    if (list.length > 0) {
      setData(
        value == '' ? list : list.filter((x) => x['type'].includes(value))
      );
    } else setData([]);
  };

  const deleteNovel = async (id) => {
    const value = await AsyncStorage.getItem('NOVELS');
    const n = JSON.parse(value);
    const lessOne = n.filter((x) => x.id != id);
    setList(lessOne);
    await AsyncStorage.setItem('NOVELS', JSON.stringify(lessOne)).then(getNovels);
  };

  const confirmRemoval = (id) => {
    return Alert.alert(
      'Vous êtes sûr ?',
      'Voulez-vous vraiment supprimer ce roman ?',
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteNovel(id);
            cleanData(filter);
          },
        },
        {
          text: 'No',
        },
      ]
    );
  };


  const renderItem = ({ item }) => {
    return (
      <View style={{ marginHorizontal: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between"}}>

          <View style={{flex:9, flexDirection: 'column', justifyContent: "space-around" }}>
          <Text style={styles.title}>{item.title}</Text>
          <RemoveEmpty
            styleValue={styles.details}
            indicator={'Auteur'}
            value={item.author}
          />
          <RemoveEmpty
            styleValue={styles.details}
            indicator={'Type'}
            value={item.type}
          /> 
          </View>

          <View style={{ flex:1, flexDirection: 'column', justifyContent: "space-around" }}>
            <Octicons
              name="repo-deleted"
              size={28}
              color="red"
              onPress={() => {
                confirmRemoval(item.id);
              }}
              style = {{marginVertical: "50%"}}
            />
            {
              (item.url != '') ?
              <MaterialCommunityIcons
                name="web"
                size={28}
                color="black"
                onPress={() => openBrowserAsync(item.url) }
                style = {{marginVertical: "50%"}}
              />
            : null
            }
          </View>

        </View>
        
      </View>
    );
  };
  const ItemSeparatorView = () => {
    return (
      <View style={{ height: 2, width: '100%', backgroundColor: 'black' }} />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Picker
        style={styles.filter}
        selectedValue={filter}
        onValueChange={function (itemValue) {
          setFilter(itemValue);
          cleanData(itemValue);
        }}>
        <Picker.Item label="Tous" value="" />
        <Picker.Item label="Fantasy" value="Fantasy" />
        <Picker.Item label="Sci-fi" value="Sci-fi" />
        <Picker.Item label="Games" value="Games" />
        <Picker.Item label="Action" value="Action" />
        <Picker.Item label="War" value="War" />
        <Picker.Item label="Realistic" value="Realistic" />
      </Picker>
      <CompleteFlatList
        searchKey={['title', 'author']}
        data={data}
        placeholder={'Recherche'}
        renderSeparator={ItemSeparatorView}
        ref={ref}
        renderItem={renderItem}
        pullToRefreshCallback={() => {
          getNovels();
          cleanData(filter);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filter: {
    width: 200,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    textAlign: 'center',
    marginHorizontal: '20%',
  },
  title: {
    fontSize: 20,
    padding: 12,
    color: 'blue',
    fontWeight: 'bold'
  },
  details: {
    fontSize: 18,
    padding: 12,
    color: '#9091BC',
    fontWeight: 'bold',
  },
});
