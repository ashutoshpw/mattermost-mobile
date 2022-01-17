// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Platform, StyleProp, Text, View, ViewStyle} from 'react-native';

// import {showModalOverCurrentContext} from '@actions/navigation';
// import {ViewTypes} from '@constants';
import ProfilePicture from '@components/profile_picture';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import type UserModel from '@typings/database/models/servers/user';

const OVERFLOW_DISPLAY_LIMIT = 99;

type Props = {
    users: UserModel[];
    breakAt?: number;
    style?: StyleProp<ViewStyle>;
}

const Avatars = ({breakAt = 3, style: baseContainerStyle, users}: Props) => {
    const theme = useTheme();

    const showParticipantsList = () => {
        //@TODO
        // const screen = 'ParticipantsList';
        // const passProps = {
        //     userIds,
        // };
        // showModalOverCurrentContext(screen, passProps);
    };

    const displayUsers = users.slice(0, breakAt);
    const overflowUsersCount = Math.min(users.length - displayUsers.length, OVERFLOW_DISPLAY_LIMIT);

    const style = getStyleSheet(theme);

    return (
        <TouchableWithFeedback
            onPress={showParticipantsList}
            style={baseContainerStyle}
            type={'opacity'}
        >
            <View style={style.container}>
                {displayUsers.map((user, index) => (
                    <View
                        key={user.id}
                        style={index === 0 ? style.firstAvatar : style.notFirstAvatars}
                    >
                        <ProfilePicture
                            author={user}
                            size={24/*ViewTypes.AVATAR_LIST_PICTURE_SIZE*/}
                            showStatus={false}
                            testID='avatars.profile_picture'
                        />
                    </View>
                ))}
                {Boolean(overflowUsersCount) && (
                    <View style={style.overflowContainer}>
                        <View style={style.overflowItem}>
                            <Text style={style.overflowText} >
                                {'+' + overflowUsersCount.toString()}
                            </Text>
                        </View>

                    </View>
                )}
            </View>
        </TouchableWithFeedback>
    );
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    const size = 24; //ViewTypes.AVATAR_LIST_PICTURE_SIZE;

    // compensate for the status buffer that is not rendered (but still padded)
    // by the ProfilePicture Component
    let STATUS_BUFFER = Platform.select({
        ios: 3,
        android: 2,
    });
    STATUS_BUFFER = STATUS_BUFFER || 0;
    const overflowSize = size + STATUS_BUFFER;
    const imgOverlap = -6;
    return {
        container: {
            flexDirection: 'row',
        },
        firstAvatar: {
            justifyContent: 'center',
            alignItems: 'center',
            width: size,
            height: size,
            borderWidth: (size / 2) + 1,
            borderColor: theme.centerChannelBg,
            backgroundColor: theme.centerChannelBg,
            borderRadius: size / 2,
        },
        notFirstAvatars: {
            justifyContent: 'center',
            alignItems: 'center',
            width: size,
            height: size,
            borderWidth: (size / 2) + 1,
            borderColor: theme.centerChannelBg,
            backgroundColor: theme.centerChannelBg,
            borderRadius: size / 2,
            marginLeft: imgOverlap,
        },
        overflowContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            width: overflowSize,
            height: overflowSize,
            borderRadius: overflowSize / 2,
            borderWidth: 1,
            borderColor: theme.centerChannelBg,
            backgroundColor: theme.centerChannelBg,
            marginLeft: imgOverlap,
        },
        overflowItem: {
            justifyContent: 'center',
            alignItems: 'center',
            width: overflowSize,
            height: overflowSize,
            borderRadius: overflowSize / 2,
            borderWidth: 1,
            borderColor: theme.centerChannelBg,
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
        },
        overflowText: {
            fontSize: 10,
            fontWeight: 'bold',
            color: changeOpacity(theme.centerChannelColor, 0.64),
            textAlign: 'center',
        },
    };
});

export default Avatars;