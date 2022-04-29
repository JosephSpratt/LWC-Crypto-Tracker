public class BraveCoinAuthResponse{
    public String access_token;
    public String scope;
    public Integer expires_in;
    public String token_type;
    public static BraveCoinAuthResponse parse(String json){
        return (BraveCoinAuthResponse)System.JSON.deserialize(json, BraveCoinAuthResponse.class);
    }

}