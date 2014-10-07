package ksanaforge.ksanagap.jsintf;
import android.content.Context;
import android.webkit.JavascriptInterface;
import android.util.Log;

import java.io.UnsupportedEncodingException;

/**
 * Created by yapcheahshen on 2014/10/2.
 */

public class ksanagap_droid {
    public ksanagap_droid(){//Context c) {
        // mContext = c;
    }

    @JavascriptInterface
    public void log(String msg){
        Log.d("ksanagap",msg);
    }
}
