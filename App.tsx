import { StatusBar } from 'expo-status-bar';
import { useEffect, useState ,} from 'react';
import { Button, StyleSheet, Text, TextInput, View , Platform, AppState} from 'react-native';
import {getDevicePushTokenAsync, } from 'expo-notifications'
import axios from 'axios';

import { setNotificationHandler, setNotificationChannelAsync, AndroidImportance, getPresentedNotificationsAsync, } from 'expo-notifications';
import * as Device from 'expo-device'

setNotificationHandler({
  handleNotification : async (x) => {

    if(AppState.currentState === 'background' || AppState.currentState === 'inactive' || AppState.currentState === 'unknown'){
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
         
      }
    }

    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
       
    }
  }
})



export default function App() {

  const [inputVal, setInputVal] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendNoti = async () => {

    if(!Device.isDevice) return

    try {
      setIsLoading(true)
      const token = (await getDevicePushTokenAsync()).data
      
      await axios.post('http://192.168.1.105:3000/send',
      {
        token : token,
        msg : inputVal
      })

    } catch (error) {
      
      console.log("Error : ", error)
    }

    setIsLoading(false)
  }

  useEffect(()=>{

    const setNotiChannel = async () => {
      if (Platform.OS === 'android') {
        await setNotificationChannelAsync('default', {
          name: 'default',
          importance:AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    }

    setNotiChannel()

  },[])
  

  return (
    <View style={styles.container}>
      <Text>Write a Message!</Text>


      <TextInput style={styles.input}
        placeholder='Notification Message'
        value={inputVal}
        onChangeText={e => {
          setInputVal(e)
        }}
      />


      <Button title='Send' onPress={sendNoti} disabled={isLoading}/>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap : 16
  },
  input :{
    textAlign : 'center',
    width : '80%',
    padding : 8,
    borderWidth : 1,
    borderRadius : 4
  }
});
