import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AppContext } from '../AppContext/AppContext';
import { Colors } from '../Colors/Colors';
import { useDimension } from '../Hooks/UseDimension';
import translateService from '../Services/translateService';

const StatusBar = () => {
    const { width } = useDimension();
    const { state } = useContext(AppContext);
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
            <View style={{backgroundColor: 'red'  }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.round, { backgroundColor: Colors.silver }]}>
                    </View>
                </View>
                <Text style={{ color: Colors.white, fontSize: 8 }}>
                {state?.t('common.silver')}
                </Text>
            </View>
            <View style={[styles.line, { width: width / 2 - 30 - width * 15 / 100, backgroundColor: Colors.silver }]} />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                    <View style={[styles.round, { backgroundColor: Colors.gold }]}>
                    </View>
                    <Text style={{ color: Colors.white, fontSize: 8 }}>
                    {state?.t('common.gold')}
                    </Text>
                </View>
                <View style={[styles.line, { width: width / 2 - 30 - width * 15 / 100, backgroundColor: Colors.gold }]} />
            </View>
            <View>
                <View style={[styles.round, { backgroundColor: Colors.platinum }]}>
                </View>
                <Text style={{ color: Colors.white, fontSize: 8 }}>
                {state?.t('common.platin')}
                </Text>
            </View>
        </View>
    )
};
export default StatusBar;

const styles = StyleSheet.create({
    round: {
        borderRadius: 15,
        width: 30,
        height: 30

    },

    line: {
        height: 4,
    }
})
