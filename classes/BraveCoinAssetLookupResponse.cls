public class BraveCoinAssetLookupResponse{
    @AuraEnabled public List<Content> content;
    public class Content{
        @AuraEnabled public String id;
        @AuraEnabled public String name;
        @AuraEnabled public String symbol;
        @AuraEnabled public String slugName;
        @AuraEnabled public String status;
        @AuraEnabled public String type;
        @AuraEnabled public String url;
    }

    public static BraveCoinAssetLookupResponse parse(String json){
        return (BraveCoinAssetLookupResponse)System.JSON.deserialize(json, BraveCoinAssetLookupResponse.class);
    }

}