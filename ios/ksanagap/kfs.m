#import "kfs.h"  
@implementation KFSObject

/*
public class kfs_droid {
    class FilePointer { RandomAccessFile f; int handle; String filename;}
    static Collection<FilePointer> filePointers = new ArrayList<FilePointer>();
    static int f_count = 0;
    static String rootpath= "";
    public kfs_droid(){//Context c) {
        // mContext = c;
    }
    protected static FilePointer find_fp(int handle) {
        for (FilePointer F : filePointers) if (F.handle == handle) return F;
        return null;
    }
    protected static FilePointer find_filename(String filename) {
        for (FilePointer F : filePointers) if (F.filename == filename) return F;
        return null;
    }
    public void setRootPath(String path){
        rootpath=path;
    }

    
    public void close(int handle) { // close the file by file handle
        FilePointer F = find_fp(handle);
        if (F!=null) {
            try {
                filePointers.remove(F);
                F.f.close();
            } catch (final Exception e) {

            };
        }
    }
    
    public int open(String fname) {  // open a file by name, check if the file already open
        FilePointer F = find_filename(rootpath + fname);
        if (F!=null) return F.handle;
        try {
            RandomAccessFile f = new RandomAccessFile(rootpath+fname, "r");
            F = new FilePointer();
            F.f=f;
            F.handle = ++f_count;
            filePointers.add(F);
        } catch (final Exception e) {
            return -1;
        };
        return F.handle;
    }
    
    public long getFileSize(int handle) {
        try {
            FilePointer F = find_fp(handle);
            return F.f.length();
        } catch (final Exception e) { return 0; }
    }

    protected byte[] readBytes (int handle, long pos, int sz) {
        byte[] b = new byte[sz];
        try{
            FilePointer F = find_fp(handle);
            F.f.seek(pos);
            F.f.read(b, 0, sz);
        } catch (final Exception e) { return null; }
        return b;
    }
    
    public int readInt32 (int handle, long pos) {
        byte[] b=readBytes(handle, pos, 4);
        ByteBuffer wrapped=ByteBuffer.wrap(b);
        int i=wrapped.getInt();
        return i;
    }
    
    public long readUInt32 (int handle, long pos) {
        return readInt32(handle, pos);//JAVA has no unsigned
    }

    
    public short readUInt8 (int handle, long pos) {
        byte[] b=readBytes(handle, pos, 1);
        ByteBuffer wrapped=ByteBuffer.wrap(b);
        short v=(short)(wrapped.get(0));
        return v;
    }

    
    public String readULE16String (int handle, long pos, int sz) {
        byte [] b=readBytes(handle, pos, sz);
        try{
            String s=new String(b,"UTF-16LE");
            return  s;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    
    public String readUTF8String (int handle, long pos, int sz) {
        byte [] b=readBytes(handle, pos, sz);
        try{
            String s = new String(b,"UTF-8");
            return s;
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    
    public String readBuf (int handle, long pos, int sz) {
        byte[] b=readBytes(handle, pos, sz);
        String str=b.toString();
        return str;
    }
    protected long[] unpack_int (byte[] A, int count, boolean reset , int[] adv) {
        long B[] = new long[A.length];
        int a = 0, b = 0 , n=0;
        do {
            short S = 0;
            do {
                n += (A[a] & 0x7f) << S;
                S += 7;
                a++; if (a>=A.length) break;
            } while ( (A[a] & 0x80)!=0 );
            B[b++] = n;
            if (reset) n=0;
            count--;
        } while (a<A.length && count>0);
        long R[] = new long[b];
        adv[0]=a; //how many bytes read
        for (int i = 0; i < R.length; i++) R[i] = B[i];
        return R;
    }
    
    public String readBuf_packedint (int handle, long pos, int blocksize, int count, boolean reset) {
        byte[] b=readBytes(handle, pos, blocksize);
        int[] adv= new int[1];
        long[] arr=unpack_int(b,count,reset,adv);
        String str=Arrays.toString(arr);
        String s=Integer.toString(adv[0]) + str; // javascript use parse Int to get the adv
        return s;
    }
    
    public String readFixedArray (int handle, long pos, int count, int unitsz) {
        byte[] b=readBytes(handle, pos, count * unitsz);
        String str="";
        ByteBuffer wrapped=ByteBuffer.wrap(b);
        if (unitsz==1) {
            str=wrapped.toString();
        } else if (unitsz==2){
            str=wrapped.asShortBuffer().toString();
        } else if (unitsz==4){
            str=wrapped.asIntBuffer().toString();
        }
        return str;
    }
    
    public String readStringArray (int handle, long pos, int sz, String enc) {
        String s;
        if (enc.compareTo("utf8")==0) s=readUTF8String(handle,pos,sz);
        else             s=readULE16String(handle,pos,sz);
        
        s=s.replaceAll("\0","\uffff");
        return s;
    }

}


NSMutableDictionary *kfs = [NSMutableDictionary dictionaryWithCapacity:10];
[fs setObject:fs_readFileSync forKey:@"readFileSync"];
[fs setObject:fs_writeFileSync forKey:@"writeFileSync"];

js[@"kfs"] = kfs;
*/