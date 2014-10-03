package ksanaforge.ksanagap.jsintf;
import android.content.Context;
import android.webkit.JavascriptInterface;
import android.util.Log;
//import ksanaforge.ksanagap.jsintf;
/**
 * Created by yapcheahshen on 2014/10/2.
 */
public class console_droid{
    // Context mContext;
    public console_droid(){//Context c) {
        // mContext = c;
    }

    @JavascriptInterface
    public void log(String msg){
        Log.d("ksanagap",msg);
    }
}
