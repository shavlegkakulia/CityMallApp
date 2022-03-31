import React, {
    createRef,
    useContext,
    useState
} from 'react';
import {
    View,
    Text,
    ScrollView,
    NativeScrollEvent,
    StyleSheet,
    StyleProp,
    ViewStyle
} from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import PaginationDots from '../PaginationDots';
import {
    IServiceCategories,
    IServiceSubCategories
} from '../../Screens/Stores/Stores';
import CategoryFilterButton from './CategoryFilterButton';



interface ICatsProps {
    data?: IServiceCategories[] | IServiceSubCategories[];
    style?: StyleProp<ViewStyle>;
    title: string;
    isCategory?: boolean;
}

const RenderCategories: React.FC<ICatsProps> = ({ data, style, title, isCategory }) => {
    const [catStep, setCatStep] = useState<number>(0);

    const carouselRef = createRef<ScrollView>();
    const { state } = useContext(AppContext);
    const { isDarkTheme } = state;

    const onChangeCategoriesSectionStep = (nativeEvent: NativeScrollEvent) => {
        if (nativeEvent) {
            const slide = Math.ceil(
                nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
            );
            setCatStep(slide);
        };
    };


    const textStyle = {
        color: isDarkTheme ? Colors.white : Colors.black,
    };

    return (
        <View style={[styles.catView, style]}>
            <View style={styles.catHeader}>
                <Text style={[styles.catTitle, textStyle]}>{title}</Text>
                <PaginationDots
                    length={
                        data?.length
                            ? data?.length % 3 === 0
                                ? data?.length / 3
                                : Math.ceil(data?.length / 3)
                            : 1
                    }
                    step={catStep}
                />
            </View>
            <ScrollView
                style={styles.scrollerStyle}
                contentContainerStyle={styles.scrollContainer}
                ref={carouselRef}
                onScroll={({ nativeEvent }) => onChangeCategoriesSectionStep(nativeEvent)}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={false}
                horizontal>
                {data?.map((el: IServiceCategories | IServiceSubCategories) => (
                    <CategoryFilterButton key={el.id} data={el} isCategory={isCategory} />
                ))}
            </ScrollView>
        </View>
    );
};

export default RenderCategories;

const styles = StyleSheet.create({
    catView: {
        marginTop: 35
    },
    catHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '7%',
    },
    catTitle: {
        fontFamily: 'HMpangram-Bold',
        fontSize: 14,
        lineHeight: 17,
        fontWeight: '700',
    },
    catItem: {
        borderWidth: 1,
        borderRadius: 25,
        marginRight: 17,
        paddingVertical: 8,
        paddingHorizontal: 11,
    },
    catItemTitle: {
        fontFamily: 'HMpangram-Bold',
        fontSize: 14,
        lineHeight: 17,
    },
    scrollerStyle: {
        marginTop: 16,
    },
    scrollContainer: {
        paddingLeft: '7%',
    },
})