// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = string;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'plus.circle.fill': 'add-circle',
  'person.fill': 'person',
  'mountain.2.fill': 'landscape',
  'building.2.fill': 'business',
  'mappin.and.ellipse': 'place',
  'magnifyingglass': 'search',
  'bell.fill': 'notifications',
  'globe': 'translate',
  'questionmark.circle': 'help-outline',
  'envelope': 'email',
  'star': 'star-outline',
  'info.circle': 'info-outline',
  'doc.text': 'description',
  'lock': 'security',
  'banknote': 'payments',
  'trash.fill': 'delete-forever',
  'chevron.left': 'chevron-left',
  'rectangle.portrait.and.arrow.right': 'logout',
  'camera.fill': 'photo-camera',
  'envelope.fill': 'email',
  'person.crop.circle.fill': 'account-circle',
  'crown.fill': 'workspace-premium',
  'lightbulb.fill': 'lightbulb-outline',
  'location.fill': 'my-location',
  'sparkles': 'auto-awesome',
  'apartment.fill': 'apartment',
  'mappin.circle.fill': 'location-city',
  'map.fill': 'map',
  'slider.horizontal.3': 'tune',
  'chevron.down': 'keyboard-arrow-down',
  'xmark.circle.fill': 'cancel',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'checkmark.circle.fill': 'check-circle',
  'cart.fill': 'shopping-cart',
  'hammer.fill': 'construction',
  'banknote.fill': 'payments',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
