import React from 'react';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {StyleProp, ViewStyle} from 'react-native';

interface ComponentProps {
  maxZoom: number;
  minZoom: number;
  zoomStep: number;
  initialZoom: number;
  bindToBorders: boolean;
  style?: StyleProp<ViewStyle>;
}

const ZoomableView: React.FC<ComponentProps> = props => {
  return (
    <ReactNativeZoomableView {...props} style={props.style}>
      {props.children}
    </ReactNativeZoomableView>
  );
};

export default ZoomableView;
