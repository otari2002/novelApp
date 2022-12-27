import { useState, useRef, useEffect } from 'react';
import { Modal, Text,TextInput, TouchableOpacity, View, SafeAreaView, StyleSheet, Alert, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';
import CompleteFlatList from 'react-native-complete-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Octicons, MaterialCommunityIcons, AntDesign  } from '@expo/vector-icons';
import { openBrowserAsync } from 'expo-web-browser';
import { canOpenURL } from 'expo-linking';

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
      
          <Pressable
            onLongPress={()=>{
              setTitle(item.title);
              setAuthor(item.author);
              setURL(item.url);
              setType(item.type);
              setId(item.id);
              setModalVisible(true);
            }}
            delayLongPress={1000}
          >
            <Text style={styles.title}>{item.title}</Text>
          </Pressable>
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

  const [Title, setTitle] = useState('');
  const [Author, setAuthor] = useState('');
  const [URL, setURL] = useState('');
  const [Type, setType] = useState('');
  const [Id, setId] = useState(0);
  const [TitleHolder, setTitleHolder] = useState('Titre Du Roman');
  const [AuthorHolder, setAuthorHolder] = useState('Auteur Du Roman');
  const [URLHolder, setURLHolder] = useState('URL Du Roman');
  const [ModalVisible ,setModalVisible] = useState(false);

  const editNovel = async (id, title, author, type, url) => {
    const value = await AsyncStorage.getItem("NOVELS");
    const n = JSON.parse(value);
    for(var x in n){
      if(n[x].id == id){
        n[x] = {"id":id, "title": title, "author": author, "type":  type, "url": url}
        break;
      }
    }
    await AsyncStorage.setItem("NOVELS", JSON.stringify(n)).then(()=> setModalVisible(false));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        visible={ModalVisible}
        transparent={true}
      >
      
      <View style={styles.container}>
      
      <AntDesign name="closesquareo" size={30} color="#5b97ac" onPress={()=>{
        setModalVisible(false);setAuthor('');setId(0);setTitle('');setType('');
      }} />
      <Text style={styles.title}>Modification des Données</Text>
      <TextInput
        value={Title}
        onChangeText={(Title) => setTitle(Title)}
        placeholder={TitleHolder}
        placeholderTextColor="black"
        style={styles.input}
      />
      <TextInput
        value={Author}
        onChangeText={(Author) => setAuthor(Author)}
        placeholder={AuthorHolder}
        placeholderTextColor="black"
        style={styles.input}
      />
      <TextInput
        value={URL}
        onChangeText={(URL) => setURL(URL)}
        placeholder={URLHolder}
        placeholderTextColor="black"
        style={styles.input}
      />
      <Picker
        style={styles.picker}
        selectedValue={Type}
        onValueChange={(itemValue) => setType(itemValue)}>
        <Picker.Item label="Type Du Roman" value =""/>
        <Picker.Item label="Fantasy" value="Fantasy" />
        <Picker.Item label="Sci-fi" value="Sci-fi" />
        <Picker.Item label="Games" value="Games" />
        <Picker.Item label="Action" value="Action" />
        <Picker.Item label="War" value="War" />
        <Picker.Item label="Realistic" value="Realistic" />
        <Picker.Item label="Sports" value="Sports" />
        <Picker.Item label="History" value="History" />
      </Picker>

      <View style={styles.editData}>
        <TouchableOpacity style={styles.editButton} onPress={()=>{
          if(Title == ""){
              setTitleHolder("LE TITRE EST OBLIGATOIRE");
          }
          if(Author == ""){
            setAuthorHolder("L'AUTEUR EST OBLIGATOIRE");
          }
          if(Title != "" && Author != "" && URL == ""){
            editNovel(Id,Title,Author,Type,URL);
          }
          else if(URL != ""){
            canOpenURL(URL).then((isValid) => {
              if(Title != "" && Author != "" && isValid ){
                editNovel(Id,Title,Author,Type,URL);
              }
              if(!isValid ){
                setURL("");
                setURLHolder("L'URL DOIT ETRE VALIDE");
              }  
            })
          }
          }}>
            <Text style={styles.text}>MODIFIER</Text>
          </TouchableOpacity>
        </View> 
        </View> 
      </Modal>
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
        <Picker.Item label="Sports" value="Sports" />
        <Picker.Item label="History" value="History" />
      </Picker>
      <CompleteFlatList
        searchKey={['title', 'author']}
        data={data}
        placeholder={'Recherche'}
        renderSeparator={ItemSeparatorView}
        ref={ref}
        renderItem={renderItem}
        pullToRefreshCallback={() => {}}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#ffffff',
  },
  input: {
    width: 300,
    height: 44,
    padding: 10,
    margin: 10,
    backgroundColor: '#e8e8e8',
  },
  picker: {
    width: 230,
    backgroundColor: '#e8e8e8',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginVertical: 20,
    fontSize : 15
  },
  editData: {
    flexDirection:"column",
    justifyContent:"space-evenly",
  },
  editButton: {
    textAlign: 'center',
    width: 150,
    height: 40,
    backgroundColor: '#2196f3',
    borderRadius: 10,
    marginVertical: 30
  },
  text: {
    color: 'white',
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold'
  },
});
