import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../Colors/Colors';

interface IPageProps {
    length?: number;
    step: number,
    style?: StyleProp<ViewStyle>;
}


const PaginationDots: React.FC<IPageProps> = (props) => {
    const [length, setLength] = useState<number[]>([]);

    const DotColor = (i: number) => {
        if(i % 4 === 1) {
            return styles.dotRed;
        } else if (i% 4 === 2) {
            return styles.dotBlue;
        } if(i % 4 === 3) {
            return styles.dotLightBlue;
        } else {
            return styles.dotYellow;   
        }
    }

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        dot: {
            width: 4,
            height: 4,
            borderRadius: 50,
            marginHorizontal: 5,
        },

        dotYellow: {
            backgroundColor: Colors.yellow
        },

        dotBlue : {
            backgroundColor: Colors.blue
        },

        dotRed: {
            backgroundColor: Colors.red
        },

        dotLightBlue: {
            backgroundColor: Colors.lightBlue
        },
    
        dotActive: {
            width: 6,
            height: 6,
            borderRadius: 50,
            marginHorizontal: 5,
            backgroundColor: Colors.yellow
        }
    })
    

    useEffect(() => {
        if(!props.length) return
        setLength([...Array(props.length).keys()].map(() => 0))
    }, [props.length]);

    const dots = length.map((_, i) => 
    <View key={i} style={[i === props.step ?styles.dotActive : styles.dot, DotColor(i) ]}></View>
    );

    return (
        <View style={[styles.container, props.style]}>
            {dots}
        </View>
    )
}


export default PaginationDots;