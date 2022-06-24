import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { AppContext } from '../AppContext/AppContext';
import { Colors } from '../Colors/Colors';

interface IProps {
  text: string;
  ttl?: number;
  show: boolean;
}

const TemporaryText: React.FC<IProps> = props => {
  const [visibiliti, setVisibility] = useState<boolean>(false);
  const visibleTtlRef = useRef<NodeJS.Timeout>();
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;

  useEffect(() => {
    if (props.show) {
      if (visibleTtlRef.current) clearTimeout(visibleTtlRef.current);
      setVisibility(true);
      visibleTtlRef.current = setTimeout(() => {
        setVisibility(false);
      }, props.ttl || 2000);
    }

    return () => {
      if (visibleTtlRef.current && !props.show) clearTimeout(visibleTtlRef.current);
    };
  }, [props.show]);

  return (
    <View style={styles.copiedTextBox}>
      {visibiliti &&  <Text style={[styles.copiedText, {color: isDarkTheme ? Colors.white : Colors.black}]}>{props.text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  copiedTextBox: {
   paddingLeft: 5,
   top: 0
  },
  copiedText: {
    color: Colors.blue,
    fontFamily: 'HMpangram-Bold',
    lineHeight: 14,
    fontSize: 12,
  },
});

export default TemporaryText;
