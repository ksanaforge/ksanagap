package ksanaforge.ksanagap.jsintf;
import java.io.*;
import java.nio.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.*;
import android.content.Context;
import android.provider.MediaStore;
import android.webkit.JavascriptInterface;
import android.util.Log;
import java.util.Arrays;

/**
 * Created by yapcheahshen on 2014/10/2.
 */

public class fs_droid {
    static String rootpath= "";
    public void setRootPath(String path){
        rootpath=path;
    }
    public static String convertStreamToString(InputStream is) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line = null;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }
        reader.close();
        return sb.toString();
    }
    public static String getStringFromFile (String filePath) throws Exception {
        File fl = new File(filePath);
        FileInputStream fin = new FileInputStream(fl);
        String ret = convertStreamToString(fin);
        //Make sure you close all streams.
        fin.close();
        return ret;
    }
    @JavascriptInterface
    public boolean existsSync(String fname) {
        File f = new File(rootpath+fname);
        return (f.exists() && !f.isDirectory());
    }
    @JavascriptInterface
    public String readFileSync(String filename) {
        return readFileSync(filename,"utf8");
    }
    @JavascriptInterface
    public String readFileSync(String filename,String encoding){
        try{
            return getStringFromFile(rootpath+filename);
        } catch (final Exception e) {
            return "";
        }
    }
    @JavascriptInterface
    public int writeFileSync(String fname, String content , String encoding) {
        try {
            OutputStream ofs = new FileOutputStream(new File(rootpath+fname ),false);
            Charset charset=StandardCharsets.UTF_8;
            if (encoding=="ucs2") charset=StandardCharsets.UTF_16LE;
            byte[] dataout=content.getBytes(charset);
            ofs.write(dataout);
            ofs.close();
            return dataout.length;
        } catch (final Exception e) {
            return 0;
        }
    }
    @JavascriptInterface
         public int writeFileSync(String fname, String content) {
        return writeFileSync(fname,content,"utf8");
    }

}

