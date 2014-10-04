package ksanaforge.ksanagap;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebView;
import android.os.Environment;
import android.webkit.WebChromeClient;
import android.util.Log;
import ksanaforge.ksanagap.jsintf.*;
import android.os.Build;
import static ksanaforge.ksanagap.R.layout.activity_main;

public class mainActivity extends Activity {

    private String ksanapath= Environment.getExternalStorageDirectory() +"/ksanagap/";
    private String sdpath="",sdindex="";
    private String assetpath="file:///android_asset/";
    protected WebView webView;
    final ksanagap_droid ksanagap_api= new ksanagap_droid();//this);
    final fs_droid fs_api= new fs_droid();//this);
    final console_droid console_api= new console_droid();//this);
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        sdpath=ksanapath+this.getString(R.string.appath)+"/";
        setContentView(activity_main);
        fs_api.setRootPath(sdpath);
        initWebview();
    }

    protected void initWebview() {
        WebView myWebView = (WebView) findViewById(R.id.webview);
        myWebView.getSettings().setDomStorageEnabled(true);
        myWebView.getSettings().setJavaScriptEnabled(true);
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        myWebView.addJavascriptInterface(ksanagap_api, "ksanagap");
        myWebView.addJavascriptInterface(console_api, "console");
        myWebView.addJavascriptInterface(fs_api, "fs");
        loadHomepage();
    }

    public void loadHomepage() {

        sdindex=sdpath+this.getString(R.string.homepage);
        WebView myWebView = (WebView) findViewById(R.id.webview);
        myWebView.loadUrl("file://"+sdindex);
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        } else if (id==R.id.action_refresh) {
            loadHomepage();
        }
        return super.onOptionsItemSelected(item);
    }
}
