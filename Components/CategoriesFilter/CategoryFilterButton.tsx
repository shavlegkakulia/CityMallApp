import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { IServiceCategories, IServiceSubCategories } from '../../Screens/Stores/Stores';
import { useState } from 'react';
import { Colors } from '../../Colors/Colors';
import { AppContext } from '../../AppContext/AppContext';

interface ICatButton {
  data?: IServiceCategories | IServiceSubCategories,
  isCategory?: boolean
}

const CategoryFilterButton: React.FC<ICatButton> = ({ data, isCategory }) => {
  const { state, setGlobalState } = useContext(AppContext);
  const { isDarkTheme,categoryArray, subCategoryArray } = state;
  const [isChosen, setIsChosen] = useState<boolean>(false);

  const handleChoseCategory = (catId: number) => {
    setIsChosen(!isChosen)
  };

  const startFilter = () => {
    handleChoseCategory(data?.id!);
  }


  useEffect(() => {
    if (isCategory) {
      if (!isChosen) {
        let tempArray = categoryArray.filter((el: number) => el != data?.id);
        setGlobalState({ categoryArray: [...tempArray] });
      } else {
        let tempArray = categoryArray;
        tempArray.push(data?.id);
        setGlobalState({ categoryArray: tempArray });
      };
    } else {
      if (!isChosen) {
        let tempArray = subCategoryArray.filter((el: number) => el != data?.id);
        setGlobalState({ subCategoryArray: [...tempArray] });
      } else {
        let tempArray = subCategoryArray;
        tempArray.push(data?.id);
        setGlobalState({ subCategoryArray: tempArray });
      };
    };

  }, [isChosen])




  const textStyle = {
    color: isDarkTheme ? Colors.white : Colors.black,
  };

  const textStyleActive = {
    color: isDarkTheme ? Colors.bgColor : Colors.white,
  };

  const buttonBgColor = {
    backgroundColor: isDarkTheme ? Colors.black : Colors.white
  };

  const buttonBgColorActive = {
    backgroundColor: isDarkTheme ? Colors.white : Colors.black
  };

  const borderStyle = {
    borderColor: isDarkTheme ? Colors.white : Colors.black,
  };



  return (
    <TouchableOpacity
      style={[styles.catItem, borderStyle, isChosen ? buttonBgColorActive : buttonBgColor]}
      onPress={startFilter}>
      <Text
        style={[styles.catItemTitle, isChosen ? textStyleActive : textStyle]}>
        {data?.name}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryFilterButton;

const styles = StyleSheet.create({
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
});
