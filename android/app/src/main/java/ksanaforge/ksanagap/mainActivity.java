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
import java.io.File;
import java.io.*;
public class mainActivity extends Activity {

    private String ksanapath= Environment.getExternalStorageDirectory() +"/ksanagap/";
    private String sdpath="",sdindex="";
    private String assetpath="file:///android_asset/";
    protected WebView webView;
    final ksanagap_droid ksanagap_api= new ksanagap_droid();//this);
    final fs_droid fs_api= new fs_droid();//this);
    final kfs_droid kfs_api= new kfs_droid();
    protected String[] dirs=null;
    //  final console_droid console_api= new console_droid();//this);  //already have in 4.4
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(activity_main);
        dirs=getAppDirs();
        initWebview();
        if (dirs.length>0) loadHomepage(dirs[0]);
    }


    protected void initWebview() {
        WebView myWebView = (WebView) findViewById(R.id.webview);
        myWebView.getSettings().setDomStorageEnabled(true);
        myWebView.getSettings().setJavaScriptEnabled(true);
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        myWebView.addJavascriptInterface(ksanagap_api, "ksanagap");
        //myWebView.addJavascriptInterface(console_api, "console");
        myWebView.addJavascriptInterface(fs_api, "fs"); //node compatible interface
        myWebView.addJavascriptInterface(kfs_api, "kfs"); //for kdb
    }

    public void loadHomepage(String appname) {
        setTitle(appname);
        sdpath=ksanapath+appname+"/";
        fs_api.setRootPath(sdpath);
        kfs_api.setRootPath(sdpath);
        sdindex=sdpath+this.getString(R.string.homepage);
        WebView myWebView = (WebView) findViewById(R.id.webview);
        myWebView.loadUrl("file://"+sdindex);
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        createAppMenu(menu);
        return true;
    }
    protected String[] getAppDirs() {
        File file=new File(ksanapath);
        String[] directories = file.list(new FilenameFilter() {
            @Override
            public boolean accept(File current, String name) {
                return new File(current, name).isDirectory();
            }
        });
        return directories;
    }
    private int APPITEMSTART=100;
    protected void createAppMenu(Menu menu) {
        for (int i=0;i<dirs.length;i++) {
            menu.add(Menu.NONE, i+APPITEMSTART, Menu.NONE, dirs[i]);
        }
    }
    protected void gotoApp(int id){
        String appname=dirs[id-APPITEMSTART];
        loadHomepage(appname);
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        } else {
            gotoApp(id);
        }
        return super.onOptionsItemSelected(item);
    }
}
