package ksanaforge.ksanagap.jsintf;
import android.app.Activity;
import android.content.Context;
import android.webkit.JavascriptInterface;
import android.util.Log;
import android.webkit.WebView;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.List;

/**
 * Created by yapcheahshen on 2014/10/2.
 */

public class ksanagap_droid {
    private String sdpath="";
    public fs_droid fs_api= new fs_droid();//this);
    public kfs_droid kfs_api= new kfs_droid();
    public String ksanapath="";
    public WebView wv=null;
    public String[] dirs=null;
    public Activity activity=null;
    public ksanagap_droid(){//Context c) {
        // mContext = c;
    }

    @JavascriptInterface
    public void log(String msg){
        Log.d("ksanagap",msg);
    }

    @JavascriptInterface
    public void switchApp(String Path) {
        /*
        for iOS
        http://stackoverflow.com/questions/12874917/how-to-run-code-in-the-ui-thread-calling-it-from-the-others-ones
         */
        List list= Arrays.asList(dirs);
        if (!list.contains(Path)) return;
        final String path=Path;
        sdpath=ksanapath+Path+"/";
        fs_api.setRootPath(sdpath);
        kfs_api.setRootPath(sdpath);
        activity.runOnUiThread(new Runnable() {
            public void run() {
                activity.setTitle(path);
                wv.loadUrl("file://" + sdpath + "index.html");
            }
        });

    }
}
