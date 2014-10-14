// NODE.JS  compatible fs
//root path is name of application
// application folder in Documents/application_name


// http://blog.csdn.net/lizhongfu2013/article/details/9232129
// JSContext 

#import "fs_ios.h"

@implementation fs_ios {
    NSString *rootPath;
}
-(void) setRoot : (NSString*)root {
    rootPath = root;
}
- (id)init {
    self = [super init];
    return self;
}
-(NSString *)getFullPath :(NSString*)fn {
	  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    documentsDirectory = [NSString stringWithFormat:@"%@/%@/", documentsDirectory, rootPath];
    //append with root
    NSString *file = [documentsDirectory stringByAppendingPathComponent:fn];
    return file;
}

-(void) finalize {
    return;
}
// for Javascripts
-(NSNumber*)writeFileSync:(NSString*)fn str:(NSString*)str enc:(NSString*)enc{
    NSString* file=[self getFullPath:fn];
    NSStringEncoding encoding=NSUTF8StringEncoding;
    if ([enc isEqualToString:@"ucs2"]) encoding=NSUTF16LittleEndianStringEncoding;
    NSData* data = [str dataUsingEncoding:encoding];
    NSError *error;
    [data writeToFile:file options:NSDataWritingAtomic error:&error];
    return [NSNumber numberWithInt:0];
}

-(NSString*)readFileSync :(NSString*)fn enc:(NSString*)enc{
    NSString* file=[self getFullPath:fn];
    NSStringEncoding encoding=NSUTF8StringEncoding;
    if ([enc isEqualToString:@"ucs2"]) encoding=NSUTF16LittleEndianStringEncoding;
    NSData *content = [NSData dataWithContentsOfFile:file];
    NSString *contentString = [[NSString alloc] initWithData:content encoding:encoding];
    return contentString;
}


-(NSNumber*) existsSync:(NSString*)fn {
    NSString* file=[self getFullPath:fn];
    BOOL fileExists = [[NSFileManager defaultManager] fileExistsAtPath:file];
    return [NSNumber numberWithBool: fileExists];
}
@end  