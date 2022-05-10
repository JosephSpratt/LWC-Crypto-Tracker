public class CryptoCompareAssetHistoryReponse {
    public class RateLimit {

		public RateLimit(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						{
							System.debug(LoggingLevel.WARN, 'RateLimit consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	public class Data_Z {
		@AuraEnabled public Boolean Aggregated {get;set;} 
		@AuraEnabled public Integer TimeFrom {get;set;} 
		@AuraEnabled public Integer TimeTo {get;set;} 
		@AuraEnabled public List<Data> Data {get;set;} 

		public Data_Z(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'Aggregated') {
							Aggregated = parser.getBooleanValue();
						} else if (text == 'TimeFrom') {
							TimeFrom = parser.getIntegerValue();
						} else if (text == 'TimeTo') {
							TimeTo = parser.getIntegerValue();
						} else if (text == 'Data') {
							Data = arrayOfData(parser);
						} else {
							System.debug(LoggingLevel.WARN, 'Data_Z consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	@AuraEnabled public String Response {get;set;} 
	@AuraEnabled public String Message {get;set;} 
	@AuraEnabled public Boolean HasWarning {get;set;} 
	@AuraEnabled public Integer Type {get;set;} 
	@AuraEnabled public RateLimit RateLimit {get;set;} 
	@AuraEnabled public Data_Z Data {get;set;} 

	public CryptoCompareAssetHistoryReponse(JSONParser parser) {
		while (parser.nextToken() != System.JSONToken.END_OBJECT) {
			if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
				String text = parser.getText();
				if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
					if (text == 'Response') {
						Response = parser.getText();
					} else if (text == 'Message') {
						Message = parser.getText();
					} else if (text == 'HasWarning') {
						HasWarning = parser.getBooleanValue();
					} else if (text == 'Type') {
						Type = parser.getIntegerValue();
					} else if (text == 'RateLimit') {
						RateLimit = new RateLimit(parser);
					} else if (text == 'Data') {
						Data = new Data_Z(parser);
					} else {
						System.debug(LoggingLevel.WARN, 'CryptoCompareAssetHistoryReponse consuming unrecognized property: '+text);
						consumeObject(parser);
					}
				}
			}
		}
	}
	
	public class Data {
		@AuraEnabled public Integer time_Z {get;set;} // in json: time
		@AuraEnabled public Double high {get;set;} 
		@AuraEnabled public Double low {get;set;} 
		@AuraEnabled public Double open {get;set;} 
		@AuraEnabled public Double volumefrom {get;set;} 
		@AuraEnabled public Double volumeto {get;set;} 
		@AuraEnabled public Double close {get;set;} 
		@AuraEnabled public String conversionType {get;set;} 
		@AuraEnabled public String conversionSymbol {get;set;} 

		public Data(JSONParser parser) {
			while (parser.nextToken() != System.JSONToken.END_OBJECT) {
				if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
					String text = parser.getText();
					if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
						if (text == 'time') {
							time_Z = parser.getIntegerValue();
						} else if (text == 'high') {
							high = parser.getDoubleValue();
						} else if (text == 'low') {
							low = parser.getDoubleValue();
						} else if (text == 'open') {
							open = parser.getDoubleValue();
						} else if (text == 'volumefrom') {
							volumefrom = parser.getDoubleValue();
						} else if (text == 'volumeto') {
							volumeto = parser.getDoubleValue();
						} else if (text == 'close') {
							close = parser.getDoubleValue();
						} else if (text == 'conversionType') {
							conversionType = parser.getText();
						} else if (text == 'conversionSymbol') {
							conversionSymbol = parser.getText();
						} else {
							System.debug(LoggingLevel.WARN, 'Data consuming unrecognized property: '+text);
							consumeObject(parser);
						}
					}
				}
			}
		}
	}
	
	
	public static CryptoCompareAssetHistoryReponse parse(String json) {
		System.JSONParser parser = System.JSON.createParser(json);
		return new CryptoCompareAssetHistoryReponse(parser);
	}
	
	public static void consumeObject(System.JSONParser parser) {
		Integer depth = 0;
		do {
			System.JSONToken curr = parser.getCurrentToken();
			if (curr == System.JSONToken.START_OBJECT || 
				curr == System.JSONToken.START_ARRAY) {
				depth++;
			} else if (curr == System.JSONToken.END_OBJECT ||
				curr == System.JSONToken.END_ARRAY) {
				depth--;
			}
		} while (depth > 0 && parser.nextToken() != null);
	}
	




    private static List<Data> arrayOfData(System.JSONParser p) {
        List<Data> res = new List<Data>();
        if (p.getCurrentToken() == null) p.nextToken();
        while (p.nextToken() != System.JSONToken.END_ARRAY) {
            res.add(new Data(p));
        }
        return res;
    }
}
