
#import <Foundation/Foundation.h>  
@import JavaScriptCore;  
//@protocol FSObjectExport <JSExport>
//-(void)log:(NSString*)string;  

//@end
  
@interface fs_ios: NSObject // <JSExport>
-(void) setRoot : (NSString*)root;
-(NSNumber*)writeFileSync:(NSString*)fn str:(NSString*)str enc:(NSString*)enc;

-(NSString*)readFileSync:(NSString*)fn enc:(NSString*)enc;

+ (void)print;

@end  
