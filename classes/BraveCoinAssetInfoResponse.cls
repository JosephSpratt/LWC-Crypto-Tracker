public class BraveCoinAssetInfoResponse {
    public class MarketCapPercentChange {
		@AuraEnabled public Double change24h;
		@AuraEnabled public Double change30d;
		@AuraEnabled public Double change7d;
	}

	@AuraEnabled public List<Content> content;

	public class Content {
		@AuraEnabled public String id;
		@AuraEnabled public String assetId;
		@AuraEnabled public String timestamp;
		@AuraEnabled public Integer marketCapRank;
		@AuraEnabled public Integer volumeRank;
		@AuraEnabled public Double price;
		@AuraEnabled public Double volume;
		@AuraEnabled public Long totalSupply;
		@AuraEnabled public Long freeFloatSupply;
		@AuraEnabled public Double marketCap;
		@AuraEnabled public Double totalMarketCap;
		@AuraEnabled public MarketCapPercentChange volumePercentChange;
        @AuraEnabled public MarketCapPercentChange totalMarketCapPercentChange;
        @AuraEnabled public MarketCapPercentChange pricePercentChange;
        @AuraEnabled public MarketCapPercentChange marketCapPercentChange;
	}

	
	public static BraveCoinAssetInfoResponse parse(String json) {
		return (BraveCoinAssetInfoResponse) System.JSON.deserialize(json, BraveCoinAssetInfoResponse.class);
	}
}
