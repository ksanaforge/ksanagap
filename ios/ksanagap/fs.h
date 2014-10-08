
#import <Foundation/Foundation.h>  
@import JavaScriptCore;  
@protocol FSObjectExport <JSExport>  
//-(void)log:(NSString*)string;  
-(int)writeFileSync :(NSString*)fn str:(NSString*)str enc:(NSString*)enc;
-(NSString*)readFileSync :(NSString*)fn enc:(NSString*)enc;
@end  
  
@interface FSObject : NSObject <FSObjectExport>  
@end  
  

