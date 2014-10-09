// ksana filesystem
//learned from https://github.com/node-app/Nodelike/blob/master/Nodelike/NLFS.h
//yapcheahshen@gmail.com 2014/10/10
#import "kfs_ios.h"

@implementation kfs_ios {
    NSString *rootPath;
    NSMutableDictionary *opened;
    int32_t fileopened;
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

-(NSFileHandle)handleByTag:(int32_t)tag {
    NSArray * values=[opened allValues];
    for (id h in values) {
        if (h.tag==tag) return values;
    }
    return nil;
}
-(NSString*)filenameByTag:(int32_t)tag {
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
    NSData *data = [h readDataOfLength:1];
    char c = *(char*)([data bytes]);
    return [NSString stringWithFormat:@"%c" , c];
}

-(NSNumber *)readInt32:(NSNumber *)handle pos:(JSValue *)pos {
    NSFileHandle h=[self handleByTag tag:handle];
    if (!h) return nil;

    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:4];

    int32_t i = *(int*)([data bytes]);
    return [NSNumber numberWithInt:i];
}

-(NSNumber *)readUInt32:(NSNumber *)handle pos:(JSValue *)pos {
    NSFileHandle h=[self handleByTag tag:handle];
    if (!h) return nil;
    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:4];

    uint32_t i = *(unsigned int*)([data bytes]);
    return [NSNumber numberWithUnsignedInt:i];
}

-(NSNumber *)readUInt8:(NSNumber *)handle pos:(JSValue *)pos {
    NSFileHandle h=[self handleByTag tag:handle];
    if (!h) return nil;

    [h seekToFileOffset:[pos toUInt32]];
    NSData *data = [h readDataOfLength:1];

    uint8_t i =(uint8_t)(*(uint8_t*)([data bytes]));
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
    uint8_t * c = (uint8_t*)([data bytes]);
    for(i=0;i<[size toUInt32];i++) {
        [out addObject: [NSNumber numberWithUnsignedInt:*(c+i)];
    }
    return out;
}

-(NSDictionary*) unpack_int:(uint8_t*)data length:(int)length count:(int)count reset:(bool)reset) {
    NSMutableArray* out=[NSMutableArray arrayWithCapacity:count];
    int adv = 0, b = 0 , n=0;
    do {
        int S = 0;
        do {
            n += ( A[a] & 0x7f) << S;
            S += 7;
            adv++; 
            if (a>=length) break;
        } while (( A[a] & 0x80)!=0 );

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

    uint8_t * c = (uint8_t*)([data bytes]);
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
        uint8_t* b1 = (uint8_t*)([data bytes]);
        for(i=0;i<[size toUInt32];i++) {
            [out addObject: [NSNumber numberWithUnsignedInt:*(b1+i)];
        }
    } else if (unit==2) {
        uint16_t* b2 = (uint16_t*)([data bytes]);
        for(i=0;i<[size toUInt32];i++) {
            [out addObject: [NSNumber numberWithUnsignedInt:*(b2+i)];
        }
    } else if (unit==4) {
        uint32_t* b4 = (uint32_t*)([data bytes]);
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

