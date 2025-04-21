import React from 'react';
import {useEffect} from 'react';
import {BackHandler} from 'react-native';

export const useBackButton = (props, handler) => {
    useEffect(() => {
        props.navigation.addListener('focus', () => {
            BackHandler.addEventListener('hardwareBackPress', handler);
        });
        props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener('hardwareBackPress', handler);
        });
    }, [handler]);
};