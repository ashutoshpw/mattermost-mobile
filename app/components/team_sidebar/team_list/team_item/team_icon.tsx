// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import NetworkManager from '@managers/network_manager';
import {makeStyleSheetFromTheme} from '@utils/theme';

type Props = {
    id: string;
    lastIconUpdate: number;
    displayName: string;
    selected: boolean;
    testID?: string;
}

export default function TeamIcon({id, lastIconUpdate, displayName, selected, testID}: Props) {
    const [imageError, setImageError] = useState(false);
    const ref = useRef<View>(null);
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const serverUrl = useServerUrl();
    const client = NetworkManager.getClient(serverUrl);

    useEffect(() =>
        setImageError(false)
    , [id, lastIconUpdate]);

    const handleImageError = useCallback(() => {
        if (ref.current) {
            setImageError(true);
        }
    }, []);

    let teamIconContent;
    if (imageError || !lastIconUpdate) {
        teamIconContent = (
            <Text
                style={styles.text}
                testID={`${testID}.display_name_abbreviation`}
            >
                {displayName?.substring(0, 2).toUpperCase()}
            </Text>
        );
    } else {
        teamIconContent = (
            <FastImage
                style={styles.image}
                source={{uri: `${serverUrl}${client.getTeamIconUrl(id, lastIconUpdate)}`}}
                onError={handleImageError}
            />
        );
    }

    return (
        <View
            style={selected ? styles.containerSelected : styles.container}
            ref={ref}
            testID={testID}
        >
            {teamIconContent}
        </View>
    );
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.centerChannelColor,
            borderRadius: 10,
        },
        containerSelected: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.centerChannelColor,
            borderRadius: 6,
        },
        text: {
            color: theme.sidebarText,
            fontFamily: 'OpenSans',
            fontWeight: 'bold',
            fontSize: 15,
        },
        image: {
            borderRadius: 6,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
        },
    };
});