package ksanaforge.ksanagap.jsintf;
import android.app.Activity;
import android.app.DownloadManager;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.webkit.JavascriptInterface;
import android.util.Log;
import android.webkit.WebView;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
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
    protected String downloadresult="";

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
        String hash="";
        int hashash=Path.indexOf("#");
        if (hashash>-1) {
            hash=Path.substring(hashash);
            Path=Path.substring(0,hashash);
        }
        final String hashtag=hash;
        List list= Arrays.asList(dirs);
        if (!list.contains(Path)) return;
        final String path=Path;
        sdpath=ksanapath+Path+"/";
        fs_api.setRootPath(sdpath);
        kfs_api.setRootPath(sdpath);
        activity.runOnUiThread(new Runnable() {
            public void run() {
                activity.setTitle(path);
                wv.loadUrl("file://" + sdpath + "index.html"+ hashtag);
            }
        });

    }
    protected Boolean downloading=false;
    protected DownloadManager downloadManager;
    public ArrayList<Long> downloads=new ArrayList();
    protected ArrayList<Long> downloads_saved=new ArrayList();
    public long downloadedbyte=0;

    private void deleteFileIfExists( String filename) {
        File f1 = new File(filename);
        if (f1.exists()) {
            Log.d("ksanagap","delete"+filename);
            f1.delete();
        }
    }
@JavascriptInterface
    public boolean startDownload(String dbid, String baseurl, String _files) {
    if (downloading) return false;
    String[] files=_files.split("\uffff");
    downloads_saved.clear();
    downloads.clear();
    downloadManager = (DownloadManager)activity.getSystemService(Context.DOWNLOAD_SERVICE);

    for (int i=0;i<files.length;i++) {
        deleteFileIfExists(ksanapath+dbid+'/'+files[i]);
        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(baseurl+files[i]));
        request.setTitle(dbid+":"+files[i]);
        //Set a description of this download, to be displayed in notifications (if enabled)
        request.setDescription(baseurl+files[i]);
        request.setDestinationInExternalPublicDir("/accelon/"+dbid,files[i]);
    //Environment.DIRECTORY_DOWNLOADS
        long id=downloadManager.enqueue(request);
        downloads.add(id);
        downloads_saved.add(id);
    }
    return true;
}


    @JavascriptInterface
    public long downloadingFile() {
        return 0;
    } //file is downloaded in parallel

    public long[] getDownloadIds() {
        long [] downloadids=new long[downloads_saved.size()];
        for (int i=0;i<downloads_saved.size();i++) downloadids[i]= downloads_saved.get(i);
        return downloadids;
    }

    @JavascriptInterface
    public long downloadedByte() {
        //doesn't return correct value when downloading big file
        DownloadManager.Query q = new DownloadManager.Query();
        if (downloads.size()==0) return 0;

        long[] downloadids=getDownloadIds();
        q.setFilterById(downloadids);
        Cursor cursor = downloadManager.query(q);
        cursor.moveToFirst();
        int bytes_downloaded=0;
        do {
            bytes_downloaded += cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
            if (cursor.isLast()) break;
            else cursor.moveToNext();
        } while (true);
        cursor.close();
        return bytes_downloaded;
    }

    @JavascriptInterface
    public long cancelDownload() {
//http://stackoverflow.com/questions/14073323/is-it-possible-to-cancel-stop-a-download-started-using-downloadmanager
        long[] downloadids=getDownloadIds();
        downloadManager.remove(downloadids);
        return 0;
    }

    @JavascriptInterface
    public String doneDownload() {
        if (downloads.size()==0) return downloadresult;
        else return "";
    }
    public void finish() {
        downloadresult = "success";
    }

}
