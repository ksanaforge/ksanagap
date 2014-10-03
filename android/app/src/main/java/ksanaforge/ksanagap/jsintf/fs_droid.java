package ksanaforge.ksanagap.jsintf;
import java.io.*;
import java.util.*;
import android.content.Context;
import android.webkit.JavascriptInterface;

/**
 * Created by yapcheahshen on 2014/10/2.
 */
public class fs_droid {
    class FilePointer { RandomAccessFile f; int id; String filename;}
    static Collection<FilePointer> filePointers = new ArrayList<FilePointer>();
    static int fid_count = 0;
    static String rootpath= "";

    protected static FilePointer find_fp(int id) {
        for (FilePointer F : filePointers) if (F.id == id) return F;
        return null;
    }
    protected static FilePointer find_filename(String filename) {
        for (FilePointer F : filePointers) if (F.filename == filename) return F;
        return null;
    }
    public void setRootPath(String path){
        rootpath=path;
    }
   // Context mContext;
    public fs_droid(){//Context c) {
       // mContext = c;
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
    public String readFileSync(String filename,String encoding){
        try{
            return getStringFromFile(rootpath+filename);
        } catch (final Exception e) {
            return "";
        }
    }

    @JavascriptInterface
    public int openSync(String fname) {
        FilePointer F = find_filename(rootpath+fname);
        if (F!=null) return F.id;
        try {
            RandomAccessFile f = new RandomAccessFile(rootpath+fname, "r");
            F = new FilePointer();
            F.f=f;
            F.id = fid_count++;
            filePointers.add(F);
        } catch (final Exception e) {
            return -1;
        };
        return F.id;
    }

    @JavascriptInterface
    public String readStringSync (int fid, long pos, int sz) {
        byte[] b = new byte[sz];
        try{
            FilePointer F = find_fp(fid);
            F.f.seek(pos);
            F.f.read(b, 0, sz);
        } catch (final Exception e) { return null; }

        try{
            String s = new String(b,"UTF-8");
            return s;
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }
}
