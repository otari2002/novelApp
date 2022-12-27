import { useState } from 'react';
import { View , StyleSheet , TextInput, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { canOpenURL } from 'expo-linking';

export default function AddNovel() {
  const [Title, setTitle] = useState('');
  const [Author, setAuthor] = useState('');
  const [URL, setURL] = useState('');
  const [Type, setType] = useState('');
  const [TitleHolder, setTitleHolder] = useState('Titre Du Roman');
  const [AuthorHolder, setAuthorHolder] = useState('Auteur Du Roman');
  const [URLHolder, setURLHolder] = useState('URL Du Roman');

  const saveNovel = async (title, author, type, url) => {
    const value = await AsyncStorage.getItem("NOVELS");
    const n = value ? JSON.parse(value) : [];
    const id = (n.length == 0) ? 0 : (n[n.length-1].id +1);
    n.push({"id":id, "title": title, "author": author, "type":  type, "url": url});
    await AsyncStorage.setItem("NOVELS", JSON.stringify(n)).then(()=>{
      setAuthor("");setTitle("");setURL("");setType("");
    })
  };

  return (
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.addButton} onPress={()=>{
          if(Title == ""){
              setTitleHolder("LE TITRE EST OBLIGATOIRE");
          }
          if(Author == ""){
            setAuthorHolder("L'AUTEUR EST OBLIGATOIRE");
          }
          if(Title != "" && Author != "" && URL == ""){
            saveNovel(Title,Author,Type,URL);
            setTitleHolder("Titre Du Roman");
            setAuthorHolder("Auteur Du Roman");
            setURLHolder("URL Du Roman");
          }
          else if(URL != ""){
            canOpenURL(URL).then((isValid) => {
              if(Title != "" && Author != "" && isValid ){
                saveNovel(Title,Author,Type,URL);
                setTitleHolder("Titre Du Roman");
                setAuthorHolder("Auteur Du Roman");
                setURLHolder("URL Du Roman");
              }
              if(!isValid ){
                setURL("");
                setURLHolder("L'URL DOIT ETRE VALIDE");
              }  
            })
          }
          }}>
          <Text style={styles.text}>AJOUTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#f2f2f2',
  },
  input: {
    width: 300,
    height: 44,
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    borderWidth: 1,
  },
  picker: {
    width: 230,
    backgroundColor: 'white',
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
  addButton: {
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