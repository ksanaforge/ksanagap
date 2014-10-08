// NODE.JS  compatible fs
//root path is name of application
// application folder in Documents/application_name


// http://blog.csdn.net/lizhongfu2013/article/details/9232129
// JSContext

#import "kfs_ios.h"

// context[@"fs"] = [[FSObject alloc] init];

@implementation kfs_ios {
    NSString *rootPath;
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


-(NSString*)readSignature:(NSString*)par {
    return @"aaa";
    /*
    NSString* file=[self getFullPath:fn];
    NSStringEncoding encoding=NSUTF8StringEncoding;
    if ([enc isEqualToString:@"ucs2"]) encoding=NSUnicodeStringEncoding;
    
    NSData *content = [NSData dataWithContentsOfFile:file];
    NSString *contentString = [[NSString alloc] initWithData:content encoding:encoding];
    return contentString;
     */
}


@end



/*
 - (void) testLog
 {
 JSContext *context = [[JSContextalloc]init];
 context[@"nativeObject"] = [[NativeObjectalloc]init];
 [context evaluateScript:@"nativeObject.log(\"Hello Javascript\")"];
 }
 */
/*
 - (void)install_fs:(JSContext *)js {
	NSMutableDictionary *fs = [NSMutableDictionary dictionaryWithCapacity:2];
	[fs setObject:fs_readFileSync forKey:@"readFileSync"];
	[fs setObject:fs_writeFileSync forKey:@"writeFileSync"];
	js[@"fs"] = fs;
 }
 */
/*
 NSString* (^fs_readFileSync)(NSString*, NSString*)=
 ^(NSString* fname, NSString* encoding) {
 
 }
 
 // write a string to a file
 int (^fs_WriteFileSync)(NSString*, NSString*, NSString *)=
 ^(NSString* fname, NSString* content , NSString* encoding) {
 }
 
 */

