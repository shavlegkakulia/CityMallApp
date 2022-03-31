export interface ShopList {
  name: String;
  id: number;
  image: string;
  address1: string,
  address2: string
}

export interface Location {
  address: string;
  id: number;
}

export  const Item = [
  {
    name: '- მაღაზია',
    id: 1,
    image: require('../assets/images/HMimage.png'),
    address: '| სითი მოლი გლდანი',
  },
  {
    name: '- მაღაზია',
    id: 2,
    image: require('../assets/images/HMimage.png'),
    address: '| სითი მოლი გლდანი',
  },
  {
    name: '- მაღაზია',
    id: 3,
    image: require('../assets/images/GantImage.png'),
    address: '| სითი მოლი გლდანი',
  },
  {
    name: '- მაღაზია',
    id: 4,
    image: require('../assets/images/ArmaniImage.png'),
    address: '| სითი მოლი საბურთალო',
  },
  {
    name: '- მაღაზია',
    id: 4,
    image: require('../assets/images/ArmaniImage.png'),
    address: '| სითი მოლი გლდანი',
  },
  {
    name: '- სალონი',
    id: 5,
    image: require('../assets/images/Podium.png'),
    address: '| სითი მოლი საბურთალო',
  },
];
