
#import <Foundation/Foundation.h>  
@import JavaScriptCore;  
@protocol FSObjectExport <JSExport>

JSExportAs(writeFileSync, -(NSNumber*)writeFileSync:(NSString*)fn str:(NSString*)str enc:(NSString*)enc);
JSExportAs(readFileSync,  -(NSString*)readFileSync:(NSString*)fn enc:(NSString*)enc);
JSExportAs(existsSync,    -(NSNumber*)existsSync:(NSString*)fn);
@end
  
@interface fs_ios: NSObject // <JSExport>
-(void) setRoot : (NSString*)root;
-(void) finalize ;
@end  
