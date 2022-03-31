const devEnvironmentVariables = {
    API_URL: 'https://citymallapi.payunicard.ge:8061',
    CONNECT_URL: 'https://citymallidentity.payunicard.ge:8060',
    client_id: 'ClientApp',
    client_secret: 'secret',
    TOKEN_TTL: ''
} 

const prodEnvironmentVariables = {
    API_URL: 'https://cmapi.payunicard.ge:18011',
    CONNECT_URL: 'https://cmidentity.payunicard.ge:17411',
    client_id: 'ClientAppProd',
    client_secret: 'asdasccewpiaijdacoeqqacd224325sdafd',
    TOKEN_TTL: ''
}

export default __DEV__ ? devEnvironmentVariables : prodEnvironmentVariables;