import { Alert, Image, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import WrapperComponent from '../../../components/wrapperComponent'
import { appImages, colors, fontFamily } from '../../../services/utilities'
import { endPoints, fontPixel, hp, routes, wp } from '../../../services/constants'
import Input from '../../../components/input'
import Button from '../../../components/button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import appStyles from '../../../services/utilities/appStyles'
import { fetchApi } from '../../../apiCalling'
import { useDispatch } from 'react-redux'
import { userData } from '../../../redux/Slices/userDataSlice'

export default function SignIn(props) {
  const dispatch = useDispatch()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [PasswordShow, setPasswordShow] = React.useState(true)

  const appLogin = async () => {
    await fetchApi(endPoints.signIn, {
      method: 'POST',
      body: {
        // "nickname": email.toLowerCase(),
        "nickname": email,
        "password": password
      },
    })
      .then(data => {
        console.log("Login Response:-", data)
        if (data?.nickname == 'error' && data?.password == 'error') {
          Alert.alert('la Credencial es incorrecta')
        } else {
          data.password = password
          dispatch(userData(data))
          props.navigation.reset({
            index: 0,
            routes: [{ name: routes.tab }],
          });
        }
      })
      .catch(error => console.log("Login Error:-", error));
  }

  useEffect(() => {
    if (__DEV__) {
      setEmail('test2')
      setPassword('qwerty12345')
    }
  }, [])

  return (
    <WrapperComponent>
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false} contentContainerStyle={appStyles.scrollContainer}>
          <View style={[appStyles.ph30, appStyles.flex1, { justifyContent: 'space-evenly', }]}>
            <Image source={appImages.splashLogo} style={{ height: hp(20.5), width: wp(43.5) }} />

            <Input
              value={email}
              onChangeText={(e) => setEmail(e)}
              placeholder='Usuario'
              placeholderTextColor='rgba(255,255,255,0.4)'
              style={styles.input}
            />

            <Input
              value={password}
              onChangeText={(e) => setPassword(e)}
              placeholder='Contraseña'
              placeholderTextColor='rgba(255,255,255,0.4)'
              secureTextEntry={PasswordShow}
              eye
              onPressEye={() => setPasswordShow(!PasswordShow)}
              style={styles.input}
            />

            <Button onPress={() => appLogin()}>
              ENTRAR
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </WrapperComponent>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    marginVertical: hp(10)
  },
  input: {
    fontSize: fontPixel(16),
    height: 42,
    color: colors.white,
    fontFamily: fontFamily.appTextMedium,
    marginVertical: hp(5),
    borderBottomColor: 'rgba(255,255,255,0.4)',
    borderBottomWidth: 2
  }
})