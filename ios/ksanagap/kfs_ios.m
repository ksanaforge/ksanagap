// ksana filesystem
//learned from https://github.com/node-app/Nodelike/blob/master/Nodelike/NLFS.h
//yapcheahshen@gmail.com 2014/10/10
#import "kfs_ios.h"

@implementation kfs_ios {
    NSString *rootPath;
    NSMutableDictionary *opened;
    int fileopened;
}
- (id)init {
    self = [super init];
    opened=[[NSMutableDictionary alloc] init];
    fileopened=0;
    return self;
}
-(void) setRoot : (NSString*)root {
    //set root
    rootPath = root;
}
-(NSString *)getFullPath :(NSString*)fn {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    documentsDirectory = [NSString stringWithFormat:@"%@/%@/", documentsDirectory, rootPath];
    //append with root
    NSString *file = [documentsDirectory stringByAppendingPathComponent:fn];
    return file;
}

-(NSFileHandle)handleByTag:(int)tag {
    NSArray * values=[opened allValues];
    for (id h in values) {
        if (h.tag==tag) return values;
    }
    return nil;
}
-(NSString*)filenameByTag:(int)tag {
    for (id fn in opened) {
        if (opened[fn].tag==tag) return fn;
    }
    return nil;
}

-(void) finalize {
    for (id fn in opened) {
        [opened[fh] closeFile];
        [opened removeObjectForKey:h];
    }
}

// for Javascripts
-(NSNumber *)open:(NSString*)fn {
    NSFileHandle* handle = [opened objectForKey:fn];
    if (!handle)
        NSString *fullpath=[getFullPath fn];
        handle=[NSFileHandle fileHandleForReadingAtPath:fullpath];
        handle.tag=++fileopened;
        opens[fn] = handle;
    }
    return handle.tag;
}

-(NSNumber*)close:(NSNumber*)handle {
    NSString* fn=[self filenameByTag tag:handle];
    if (fn) {
        [opened[fn] closeFile];
        [opened removeObjectForKey:fn];
        return [NSNumber numberwithbool:true];
    }
    return [NSNumber numberwithbool:false];
}

-(NSString *)readSignature:(NSNumber *)handle pos:(JSValue *)pos {
    NSFileHandle h=[self handleByTag tag:handle];
    if (!h) return nil;

    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [handle.intValue readDataOfLength:1];
    char c = *(char*)([data bytes]);
    return [NSString stringWithFormat:@"%c" , c];
}

-(NSNumber *)readInt32:(NSNumber *)handle pos:(JSValue *)pos {
    NSFileHandle h=[self handleByTag tag:handle];
    if (!h) return nil;

    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:4];

    int i = *(int*)([data bytes]);
    return [NSNumber numberWithInt:i];
}

-(NSNumber *)readUInt32:(NSNumber *)handle pos:(JSValue *)pos {
    NSFileHandle h=[self handleByTag tag:handle];
    if (!h) return nil;
    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:4];

    unsigned int i = *(unsigned int*)([data bytes]);
    return [NSNumber numberWithUnsignedInt:i];
}

-(NSNumber *)readUInt8:(NSNumber *)handle pos:(JSValue *)pos {
    NSFileHandle h=[self handleByTag tag:handle];
    if (!h) return nil;

    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:1];

    unsigned int i =(unsigned int)(*(char*)([data bytes]));
    return [NSNumber numberWithUnsignedInt:i];
}

-(NSString *)readUTF8String:(NSNumber *)handle pos:(JSValue *)pos size:(JSValue *)size {
    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:[size toUInt32]];

    NSString *str = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    return str;
}
-(NSString *)readULE16String:(NSNumber *)handle pos:(JSValue *)pos size:(JSValue *)size {
    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:[size toUInt32]];

    NSString *str = [[NSString alloc] initWithData:data encoding:NSUTF16LittleEndianStringEncoding];
    return str;
}

-(NSArray *)readBuffer:(NSNumber *)handle pos:(JSValue *)pos size:(JSValue *)size {
    NSFileHandle h=[self handleByTag tag:handle];
    if (!h) return nil;

    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:[size toUInt32]];

    NSMutableArray* out=[NSMutableArray arrayWithCapacity [size toUInt32]];
    unsigned char * c = (unsigned char*)([data bytes]);
    for(i=0;i<[size toUInt32];i++) {
        [out addObject: [NSNumber numberWithUnsignedInt:(unsigned int)(*(c+i))];
    }
    return out;
}

-(NSDictionary*) unpack_int:(unsigned char*)data length:(int)length count:(int)count reset:(bool)reset) {
    NSMutableArray* out=[NSMutableArray arrayWithCapacity:count];
    int adv = 0, b = 0 , n=0;
    do {
        int S = 0;
        do {
            n += ( (int)(A[a]) & 0x7f) << S;
            S += 7;
            adv++; 
            if (a>=length) break;
        } while (( (int)(A[a]) & 0x80)!=0 );

        [out addObject: [NSNumber numberWithUnsignedInt:n];
        if (reset) n=0;
        count--;
    } while (a<length && count>0);

    return [NSDictionary dictionaryWithObjectsAndKeys:@"data", out, 
                                                      @"adv", [NSNumber numberWithUnsignedInt:adv]];
}

-(NSDictionary *)readBuf_packedint:(NSNumber *)handle pos:(JSValue *)pos size:(JSValue *)size : count(JSValue *)count : reset(JSValue *)reset {
    NSFileHandle h=[self handleByTag tag:handle];
    if (!h) return nil;

    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:[size toUInt32]];

    unsigned char * c = (unsigned char*)([data bytes]);
    NSDictionary *r=[unpack_int data:c length:[size toUInt32] count:[count toUInt32] reset:[reset toBool] ];
    return r;
}

-(NSArray *)readFixedArray:(NSNumber *)handle pos:(JSValue *)pos count:(JSValue *)count unitsz:(JSValue *)unitsz {
    NSFileHandle h=[self handleByTag tag:handle];
    if (!h) return nil;

    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:[size toUInt32]];

    NSMutableArray* out=[NSMutableArray arrayWithCapacity [size toUInt32]];

    int unit=[unitsz toUInt32];
    if (unit==1) {
        unsigned char* b1 = (unsigned char*)([data bytes]);
        for(i=0;i<[size toUInt32];i++) {
            [out addObject: [NSNumber numberWithUnsignedInt:(unsigned int)(*(b1+i))];
        }
    } else if (unit==2) {
        unsigned short* b2 = (unsigned short*)([data bytes]);
        for(i=0;i<[size toUInt32];i++) {
            [out addObject: [NSNumber numberWithUnsignedInt:(unsigned int)(*(b2+i))];
        }
    } else if (unit==4) {
        unsigned int* b4 = (unsigned int*)([data bytes]);
        for(i=0;i<[size toUInt32];i++) {
            [out addObject: [NSNumber numberWithUnsignedInt:*(b4+i)];
        }
    } else {
        //throw unsuppoted unit sz
    }
    return out;
}
-(NSArray*) readStringArray:(NSNumber *)handle :pos(JSValue *)pos : size(JSValue *)size :enc(JSValue *)enc;
    NSString *s;

    if ( [[enc toString] isEqualToString:@"utf8")]) {
        s=[readUTF8String handle:handle pos:pos size:sz];
    } else{
        s=[readULE16String handle:handle pos:pos size:sz];
    }
      
    return [s componentsSeparatedByString:@"\0"];
}

@end

