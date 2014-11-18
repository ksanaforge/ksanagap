package ksanaforge.ksanagap;

/**
 * Created by yapcheahshen on 2014/10/20.
 */
import android.content.res.AssetManager;

import java.io.File;
import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;

import ksanaforge.ksanagap.jsintf.JSON;
import ksanaforge.ksanagap.jsintf.fs_droid;
import org.json.JSONObject;

public class installer {
    static public void copySelf(AssetManager assets,String installerpath) throws IOException {

        String[] filenames = {"index.html","jquery.js","react-with-addons.js","build.css","build.js",
                "nodemain.js","systemmenu.js","package.json","banner.png","ksana.js"};

        final File path = new File(installerpath);
        if (!path.exists()) path.mkdirs();

        for (int i=0;i<filenames.length;i++) {
            InputStream input=assets.open(filenames[i]);
            copy(input, installerpath+filenames[i]);
        }
    }


    static public boolean newer(AssetManager assets,String installerpath) {
        Date date1=new Date(0),date2=new Date(0);
        try {
            String sdjsonstr=fs_droid.getStringFromFile(installerpath+"ksana.js");
            sdjsonstr=sdjsonstr.substring(14,sdjsonstr.length()-1);
            JSONObject sdksana=JSON.parse(sdjsonstr);


            InputStream bundleksanastream=assets.open("ksana.js");
            String bundlejsonstr = fs_droid.convertStreamToString(bundleksanastream);
            bundleksanastream.close();

            bundlejsonstr=bundlejsonstr.substring(14,bundlejsonstr.length()-1);
            JSONObject bundleksana=JSON.parse(bundlejsonstr);

            String bundledatestr=bundleksana.getString("date");
            String sddatestr=sdksana.getString("date");
            DateFormat df1 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            date1 = df1.parse(bundledatestr);
            date2 = df1.parse(sddatestr);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return date1.after(date2);
    }



    static void copy(InputStream in, String dst) throws IOException {
        OutputStream out = new FileOutputStream(dst);

        // Transfer bytes from in to out
        byte[] buf = new byte[1024];
        int len;
        while ((len = in.read(buf)) > 0) {
            out.write(buf, 0, len);
        }
        in.close();
        out.close();
    }
}
