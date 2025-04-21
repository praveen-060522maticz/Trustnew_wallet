import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import { useCodeScanner, Camera, useCameraDevice } from 'react-native-vision-camera';
import { useIsForeground } from '../hooks/useIsForeground';
import themeContext from '../Utilities/themecontext';
import { isEmpty } from '../Utilities/commenfuctions';

const QRcodeScanner = ({ onRead }) => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [scanned,setScanned]=useState(false)
    console.log('onRead---->', onRead, permissionGranted);

    const isFocused = useIsFocused()
    const isForeground = useIsForeground()
    const isActive = isFocused && isForeground

    const theme = useContext(themeContext);

    const device = useCameraDevice('back')

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
            console.log(`Scanned ${codes.length} codes!`, codes)
            const value = codes[0]?.value
            if (scanned ||  isEmpty(value)) return
            setScanned(true)
            onRead({ data: value })
        }
    })


    useEffect(() => {
        const requestPermissions = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs permission to use your camera for scanning QR codes',
                        buttonPositive: 'OK',
                    }
                );
                console.log('granted---->', granted);
                setPermissionGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
            } else {

            }
        };

        requestPermissions();
    }, []);

    if (!permissionGranted) {
        return <Text style={{ color: theme.text }}>Waiting for camera permission...</Text>;
    }

    return (
        <View style={styles.container}>
            {device != null && (
                <>
                    <Camera
                        // style={StyleSheet.absoluteFillObject}
                        style={styles.camera}
                        device={device}
                        isActive={isActive}
                        codeScanner={codeScanner}
                        enableZoomGesture={true}
                    />

                    {/* QR Scanner Box */}
                    <View style={styles.qrBox} />
                </>
            )}
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000', // optional
      justifyContent: 'center',
      alignItems: 'center',
    //   marginTop:"10%"
    },
    camera: {
    //   width: '100%',
      height: "80%",
      position: 'relative',
    },
    qrBox: {
      position: 'absolute',
      top: "40%",
      left: '50%',
      transform: [{ translateX: -75 }],
      height: 150,
      width: 150,
      borderWidth: 2,
      borderColor: '#00FF00',
      borderRadius: 8,
      zIndex: 10,
    },
  });
  

export default QRcodeScanner;
