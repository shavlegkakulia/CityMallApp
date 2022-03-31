import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Colors} from '../../Colors/Colors';

export interface MessageInfoProps {
  label: string;
  identification: string;
}

const UserInfoView: React.FC<MessageInfoProps> = props => {
  const {label, identification} = props;

  return (
    <View style={{top: 17, paddingHorizontal: 10}}>
      <View style={styles.main}>
        <View>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={{top: 7}}>
          <Text style={styles.identification}>{identification}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: Colors.txtGrey,
  },
  label: {
    color: Colors.txtGrey,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'HM pangram',
    lineHeight: 17,
  },
  identification: {
    color: Colors.txtGrey,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'HM pangram',
  },
});

export default UserInfoView;
