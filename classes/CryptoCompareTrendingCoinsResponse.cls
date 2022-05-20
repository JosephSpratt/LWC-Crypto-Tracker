public with sharing class CryptoCompareTrendingCoinsResponse {
	@AuraEnabled public String Message;	//Success
	@AuraEnabled public Integer Type;	//100
	@AuraEnabled public cls_MetaData MetaData;
	@AuraEnabled public cls_SponsoredData[] SponsoredData;
	@AuraEnabled public cls_Data[] Data;
	@AuraEnabled public cls_RateLimit RateLimit;
	@AuraEnabled public boolean HasWarning;
public 	class cls_MetaData {
		@AuraEnabled public Integer Count;	//3230
	}
	public class cls_SponsoredData {
	}
	public class cls_Data {
		@AuraEnabled public cls_CoinInfo CoinInfo;
		@AuraEnabled public cls_RAW RAW;
		@AuraEnabled public cls_DISPLAY DISPLAY;
	}
	public class cls_CoinInfo {
		@AuraEnabled public String Id;	//1182
		@AuraEnabled public String Name;	//BTC
		@AuraEnabled public String FullName;	//Bitcoin
		@AuraEnabled public String Internal;	//BTC
		@AuraEnabled public String ImageUrl;	///media/37746251/btc.png
		@AuraEnabled public String Url;	///coins/btc/overview
		@AuraEnabled public cls_Rating Rating;
		@AuraEnabled public Integer Type;	//1
		@AuraEnabled public String DocumentType;	//Webpagecoinp
	}
	public class cls_Rating {
		@AuraEnabled public cls_Weiss Weiss;
	}
	public class cls_Weiss {
		@AuraEnabled public String Rating;	//B+
		@AuraEnabled public String TechnologyAdoptionRating;	//A-
		@AuraEnabled public String MarketPerformanceRating;	//C-
	}
	public class cls_RAW {
		@AuraEnabled public cls_USD USD;
	}
	public class cls_USD {
		@AuraEnabled public String FROMSYMBOL;	//Ƀ
		@AuraEnabled public String TOSYMBOL;	//$
		@AuraEnabled public String MARKET;	//CryptoCompare Index
		@AuraEnabled public String PRICE;	//$ 29,388.2
		@AuraEnabled public String LASTUPDATE;	//Just now
		@AuraEnabled public String LASTVOLUME;	//Ƀ 0.0003218
		@AuraEnabled public String LASTVOLUMETO;	//$ 9.46
		@AuraEnabled public String LASTTRADEID;	//340192733
		@AuraEnabled public String VOLUMEDAY;	//Ƀ 19,909.7
		@AuraEnabled public String VOLUMEDAYTO;	//$ 579,314,592.6
		@AuraEnabled public String VOLUME24HOUR;	//Ƀ 48,625.6
		@AuraEnabled public String VOLUME24HOURTO;	//$ 1,415,632,466.9
		@AuraEnabled public String OPENDAY;	//$ 28,667.2
		@AuraEnabled public String HIGHDAY;	//$ 29,621.2
		@AuraEnabled public String LOWDAY;	//$ 28,653.2
		@AuraEnabled public String OPEN24HOUR;	//$ 29,534.8
		@AuraEnabled public String HIGH24HOUR;	//$ 29,654.2
		@AuraEnabled public String LOW24HOUR;	//$ 28,606.9
		@AuraEnabled public String LASTMARKET;	//Coinbase
		@AuraEnabled public String VOLUMEHOUR;	//Ƀ 1,686.85
		@AuraEnabled public String VOLUMEHOURTO;	//$ 49,683,829.2
		@AuraEnabled public String OPENHOUR;	//$ 29,469.8
		@AuraEnabled public String HIGHHOUR;	//$ 29,621.2
		@AuraEnabled public String LOWHOUR;	//$ 29,353.2
		@AuraEnabled public String TOPTIERVOLUME24HOUR;	//Ƀ 48,625.6
		@AuraEnabled public String TOPTIERVOLUME24HOURTO;	//$ 1,415,632,466.9
		@AuraEnabled public String CHANGE24HOUR;	//$ -146.64
		@AuraEnabled public String CHANGEPCT24HOUR;	//-0.50
		@AuraEnabled public String CHANGEDAY;	//$ 720.94
		@AuraEnabled public String CHANGEPCTDAY;	//2.51
		@AuraEnabled public String CHANGEHOUR;	//$ -81.58
		@AuraEnabled public String CHANGEPCTHOUR;	//-0.28
		@AuraEnabled public String CONVERSIONTYPE;	//direct
		@AuraEnabled public String CONVERSIONSYMBOL;	//
		@AuraEnabled public String SUPPLY;	//Ƀ 19,044,018.0
		@AuraEnabled public String MKTCAP;	//$ 559.67 B
		@AuraEnabled public String MKTCAPPENALTY;	//0 %
		@AuraEnabled public String CIRCULATINGSUPPLY;	//Ƀ 19,044,018.0
		@AuraEnabled public String CIRCULATINGSUPPLYMKTCAP;	//$ 559.67 B
		@AuraEnabled public String TOTALVOLUME24H;	//Ƀ 300.88 K
		@AuraEnabled public String TOTALVOLUME24HTO;	//$ 8.83 B
		@AuraEnabled public String TOTALTOPTIERVOLUME24H;	//Ƀ 296.14 K
		@AuraEnabled public String TOTALTOPTIERVOLUME24HTO;	//$ 8.69 B
		@AuraEnabled public String IMAGEURL;	///media/37746251/btc.png
	}
	public class cls_DISPLAY {
		@AuraEnabled public cls_USD USD;
	}
	public class cls_RateLimit {
	}
	@AuraEnabled public static CryptoCompareTrendingCoinsResponse parse(String json){
		return (CryptoCompareTrendingCoinsResponse) System.JSON.deserialize(json, CryptoCompareTrendingCoinsResponse.class);
	}
}
