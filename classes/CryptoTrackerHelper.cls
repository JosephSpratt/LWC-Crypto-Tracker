public without sharing class CryptoTrackerHelper{

    private static final String AURA_HANDLED_EXCEPTION_TOKEN_MESSAGE = 'An error occurred when trying to generate an authentication token.';
    private static final String AURA_HANDLED_EXCEPTION_ASSET_MESSAGE = 'An error occurred when fetching asset/coin information.';
    
    @AuraEnabled
    public static String getToken(){
        try{
            Http http = new Http();

            BraveCoinCreds__c braveCoin = BraveCoinCreds__c.getOrgDefaults();
            HttpRequest req = new HttpRequest();
            req.setEndpoint(braveCoin.TokenUrl__c);
            req.setHeader('content-type', 'application/json');
            req.setHeader('X-RapidAPI-Host', 'bravenewcoin.p.rapidapi.com');
            req.setHeader('X-RapidAPI-Key', braveCoin.Rapid_Key__c);
            req.setMethod('POST');
            req.setBody('{ "audience": "https://api.bravenewcoin.com", "client_id": "' + braveCoin.Client_Id__c + '", "grant_type": "client_credentials"}');

            HTTPResponse res = http.send(req);
            System.debug(res.getBody());

            return BraveCoinAuthResponse.parse(res.getBody()).access_token;
        } catch (Exception e){
            throw new AuraHandledException(AURA_HANDLED_EXCEPTION_TOKEN_MESSAGE);
        }
    }

    @AuraEnabled
    public static BraveCoinAssetLookupResponse assetIdLookup(String ticker){
        try{
            Http http = new Http();

            BraveCoinCreds__c braveCoin = BraveCoinCreds__c.getOrgDefaults();
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://bravenewcoin.p.rapidapi.com/asset?symbol=' + ticker + '&status=ACTIVE');
            req.setHeader('X-RapidAPI-Host', 'bravenewcoin.p.rapidapi.com');
            req.setHeader('X-RapidAPI-Key', braveCoin.Rapid_Key__c);
            req.setMethod('GET');

            System.debug(req);
            

            HTTPResponse res = http.send(req);
            System.debug(res.getBody());

            System.debug(BraveCoinAssetLookupResponse.parse(res.getBody()));
            return BraveCoinAssetLookupResponse.parse(res.getBody());
        } catch (Exception e){
            System.debug(e.getMessage());
            throw new AuraHandledException(AURA_HANDLED_EXCEPTION_ASSET_MESSAGE);
        }
    }

    @AuraEnabled
    public static BraveCoinAssetInfoResponse getAssetInfo(String assetId, String token){
        try{
            Http http = new Http();

            BraveCoinCreds__c braveCoin = BraveCoinCreds__c.getOrgDefaults();
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://bravenewcoin.p.rapidapi.com/market-cap?assetId=' + assetId + '&percentChange=true');
            req.setHeader('X-RapidAPI-Host', 'bravenewcoin.p.rapidapi.com');
            req.setHeader('X-RapidAPI-Key', braveCoin.Rapid_Key__c);
            req.setHeader('Authorization', 'Bearer ' + token);
            req.setMethod('GET');

            System.debug(req);
            

            HTTPResponse res = http.send(req);
            System.debug(res.getBody());

            System.debug(BraveCoinAssetInfoResponse.parse(res.getBody()));
            return BraveCoinAssetInfoResponse.parse(res.getBody());
        } catch (Exception e){
            System.debug(e);
            throw new AuraHandledException(AURA_HANDLED_EXCEPTION_ASSET_MESSAGE);
        }
    }
}